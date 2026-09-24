use rstar::{RTree, RTreeObject, AABB, PointDistance};
use crate::geometry::types::FamiliarPlace;

// Wrapper for rstar compatibility
#[derive(Clone, Debug)]
pub struct IndexedPlace {
    pub place: FamiliarPlace,
}

impl RTreeObject for IndexedPlace {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_point([self.place.lng, self.place.lat])
    }
}

impl PointDistance for IndexedPlace {
    fn distance_2(&self, point: &[f64; 2]) -> f64 {
        let dx = self.place.lng - point[0];
        let dy = self.place.lat - point[1];
        dx * dx + dy * dy // squared euclidean distance for quick comparison
    }
}

pub struct PlaceIndex {
    tree: RTree<IndexedPlace>,
}

impl PlaceIndex {
    pub fn new(places: Vec<FamiliarPlace>) -> Self {
        let indexed: Vec<IndexedPlace> = places.into_iter().map(|p| IndexedPlace { place: p }).collect();
        Self {
            tree: RTree::bulk_load(indexed),
        }
    }

    pub fn nearest_place(&self, lng: f64, lat: f64) -> Option<FamiliarPlace> {
        self.tree.nearest_neighbor([lng, lat]).map(|ip| ip.place.clone())
    }
}
