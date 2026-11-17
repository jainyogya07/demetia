mod geometry;
mod geofence;
mod indexing;
mod trajectory;

use axum::{
    routing::{get, post},
    Router,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use geometry::types::{GraphDeviationRequest, FamiliarPlace, PatientLocation};
use trajectory::deviation::{calculate_graph_deviation, evaluate_state};
use indexing::rtree::PlaceIndex;
use geo::{Point, Polygon, LineString, Coord, Contains, Simplify};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[derive(Deserialize)]
struct SimplifyRequest {
    // Array of [lng, lat]
    coordinates: Vec<[f64; 2]>,
    // Epsilon in degrees (default 0.0001 ~ 11 meters)
    epsilon: Option<f64>,
}

#[derive(Serialize)]
struct SimplifyResponse {
    original_points: usize,
    simplified_points: usize,
    coordinates: Vec<[f64; 2]>,
}

#[derive(Deserialize)]
struct GeofenceCheckRequest {
    latitude: f64,
    longitude: f64,
    polygon_vertices: Vec<[f64; 2]>, // Array of [lat, lng] or [lng, lat]
}

#[derive(Serialize)]
struct GeofenceCheckResponse {
    is_inside: bool,
    latency_micros: u128,
}

#[derive(Deserialize)]
struct NearestPlaceRequest {
    patient: PatientLocation,
    places: Vec<FamiliarPlace>,
}

async fn check_deviation(
    Json(payload): Json<GraphDeviationRequest>,
) -> Json<serde_json::Value> {
    let dev_meters = calculate_graph_deviation(&payload.patient, &payload.graph);
    let state = evaluate_state(dev_meters);

    Json(json!({
        "deviation_meters": dev_meters,
        "state": state
    }))
}

async fn simplify_polyline(
    Json(payload): Json<SimplifyRequest>,
) -> Json<SimplifyResponse> {
    let orig_count = payload.coordinates.len();
    if orig_count <= 2 {
        return Json(SimplifyResponse {
            original_points: orig_count,
            simplified_points: orig_count,
            coordinates: payload.coordinates,
        });
    }

    let epsilon = payload.epsilon.unwrap_or(0.0001);
    let coords: Vec<Coord<f64>> = payload
        .coordinates
        .iter()
        .map(|c| Coord { x: c[0], y: c[1] })
        .collect();

    let line = LineString::new(coords);
    let simplified = line.simplify(epsilon);

    let result_coords: Vec<[f64; 2]> = simplified
        .into_iter()
        .map(|c| [c.x, c.y])
        .collect();

    let sim_count = result_coords.len();

    Json(SimplifyResponse {
        original_points: orig_count,
        simplified_points: sim_count,
        coordinates: result_coords,
    })
}

async fn check_geofence(
    Json(payload): Json<GeofenceCheckRequest>,
) -> Json<GeofenceCheckResponse> {
    let start = std::time::Instant::now();
    let point = Point::new(payload.longitude, payload.latitude);

    let poly_coords: Vec<Coord<f64>> = payload
        .polygon_vertices
        .into_iter()
        .map(|v| Coord { x: v[1], y: v[0] })
        .collect();

    let polygon = Polygon::new(LineString::new(poly_coords), vec![]);
    let is_inside = polygon.contains(&point);
    let latency_micros = start.elapsed().as_micros();

    Json(GeofenceCheckResponse {
        is_inside,
        latency_micros,
    })
}

async fn find_nearest_place(
    Json(payload): Json<NearestPlaceRequest>,
) -> Json<serde_json::Value> {
    let index = PlaceIndex::new(payload.places);
    let nearest = index.nearest_place(payload.patient.lng, payload.patient.lat);

    Json(json!({
        "nearest_place": nearest
    }))
}

#[tokio::main]
async fn main() {
    println!("🦀 Rust Spatial Engine booting on port 5005...");

    let app = Router::new()
        .route("/health", get(|| async { "Rust Spatial Core OK" }))
        .route("/api/engine/deviation", post(check_deviation))
        .route("/api/engine/simplify", post(simplify_polyline))
        .route("/api/engine/geofence", post(check_geofence))
        .route("/api/engine/nearest", post(find_nearest_place))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 5005));
    println!("Listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
