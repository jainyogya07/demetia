use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatientLocation {
    pub patient_id: String,
    pub lat: f64,
    pub lng: f64,
    pub timestamp: i64,
    pub source: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FamiliarPlace {
    pub id: String,
    pub name: String,
    pub lat: f64,
    pub lng: f64,
    pub radius_meters: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialStateUpdate {
    pub patient_id: String,
    pub status: String,
    pub last_known_location: String,
    pub last_known_time: String,
    pub direction: String,
    pub nearest_familiar_place: String,
    pub summary: String,
}

// ==========================================
// UNIFIED GRAPH ARCHITECTURE
// ==========================================

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct SpatialNode {
    pub id: String,
    pub name: String,
    pub lat: f64,
    pub lng: f64,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct SpatialEdge {
    pub from_node: String,
    pub to_node: String,
    pub coordinates: Vec<[f64; 2]>, // Array of [lng, lat]
    pub allowed_deviation_meters: f64,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct FamiliarRouteGraph {
    pub route_id: String,
    pub name: String,
    pub nodes: Vec<SpatialNode>,
    pub edges: Vec<SpatialEdge>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GraphDeviationRequest {
    pub patient: PatientLocation,
    pub graph: FamiliarRouteGraph,
}
