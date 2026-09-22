use geo::prelude::*;
use geo::Point;
use crate::geometry::types::{FamiliarPlace, PatientLocation};

pub fn is_within_radius(patient: &PatientLocation, place: &FamiliarPlace) -> bool {
    let p_point = Point::new(patient.lng, patient.lat);
    let place_point = Point::new(place.lng, place.lat);
    
    // Calculate Haversine distance in meters
    let distance = p_point.haversine_distance(&place_point);
    
    distance <= place.radius_meters
}

pub fn calculate_distance(patient: &PatientLocation, place: &FamiliarPlace) -> f64 {
    let p_point = Point::new(patient.lng, patient.lat);
    let place_point = Point::new(place.lng, place.lat);
    
    p_point.haversine_distance(&place_point)
}
