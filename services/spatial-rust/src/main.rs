mod geometry;
mod geofence;
mod indexing;
mod trajectory;

use axum::{
    routing::post,
    Router,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use geometry::types::{PatientLocation, SpatialStateUpdate};
use trajectory::deviation::{calculate_graph_deviation, evaluate_state};
use geo::LineString;
use std::net::SocketAddr;

#[derive(Deserialize)]
struct DeviationRequest {
    patient: PatientLocation,
    // Expects route as a simple array of [lng, lat]
    expected_route: Vec<[f64; 2]>,
}

async fn check_deviation(
    Json(payload): Json<geometry::types::GraphDeviationRequest>,
) -> Json<serde_json::Value> {
    
    // Evaluate deviation contextually across the entire unified graph
    let dev_meters = trajectory::deviation::calculate_graph_deviation(&payload.patient, &payload.graph);
    let state = trajectory::deviation::evaluate_state(dev_meters);

    Json(json!({
        "deviation_meters": dev_meters,
        "state": state
    }))
}

#[tokio::main]
async fn main() {
    println!("🚀 Rust Spatial Engine starting...");

    let app = Router::new()
        .route("/api/engine/deviation", post(check_deviation))
        .route("/health", axum::routing::get(|| async { "Rust Engine OK" }));

    let addr = SocketAddr::from(([0, 0, 0, 0], 5005));
    println!("Listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
