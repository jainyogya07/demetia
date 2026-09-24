use geo::prelude::*;
use geo::{Point, LineString};
use crate::geometry::types::{PatientLocation, FamiliarRouteGraph};

/// Calculates the shortest distance from the patient to the closest edge in the FamiliarRouteGraph.
/// Returns the distance in meters.
pub fn calculate_graph_deviation(patient: &PatientLocation, graph: &FamiliarRouteGraph) -> f64 {
    let p = Point::new(patient.lng, patient.lat);
    let mut min_dist_deg = f64::MAX;

    for edge in &graph.edges {
        // Convert the edge coordinates into a LineString
        let coords: Vec<(f64, f64)> = edge.coordinates.iter().map(|c| (c[0], c[1])).collect();
        let line_string = LineString::from(coords);

        // Calculate Euclidean distance to this specific edge
        let dist = p.euclidean_distance(&line_string);
        if dist < min_dist_deg {
            min_dist_deg = dist;
        }
    }

    if min_dist_deg == f64::MAX {
        return 99999.0; // Fallback if graph has no edges
    }

    // Rough conversion from degrees to meters
    min_dist_deg * 111_320.0
}

/// Determines if the deviation is large enough to trigger an 'UNUSUAL' or 'ATTENTION_REQUIRED' state.
pub fn evaluate_state(deviation_meters: f64) -> String {
    if deviation_meters < 50.0 {
        "NORMAL".to_string()
    } else if deviation_meters < 150.0 {
        "UNUSUAL".to_string()
    } else {
        "ATTENTION_REQUIRED".to_string()
    }
}
