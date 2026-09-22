package tracking

import (
	"fmt"
	"time"
	"github.com/go-resty/resty/v2"

	"detection-go/internal/adapters"
)

type SpatialNode struct {
	ID   string  `json:"id"`
	Name string  `json:"name"`
	Lat  float64 `json:"lat"`
	Lng  float64 `json:"lng"`
}

type SpatialEdge struct {
	FromNode               string      `json:"from_node"`
	ToNode                 string      `json:"to_node"`
	Coordinates            [][]float64 `json:"coordinates"`
	AllowedDeviationMeters float64     `json:"allowed_deviation_meters"`
}

type FamiliarRouteGraph struct {
	RouteID string        `json:"route_id"`
	Name    string        `json:"name"`
	Nodes   []SpatialNode `json:"nodes"`
	Edges   []SpatialEdge `json:"edges"`
}

type RustDeviationRequest struct {
	Patient adapters.NormalizedLocation `json:"patient"`
	Graph   FamiliarRouteGraph          `json:"graph"`
}

type RustDeviationResponse struct {
	DeviationMeters float64 `json:"deviation_meters"`
	State           string  `json:"state"`
}

type SpatialStateUpdate struct {
	PatientID             string  `json:"patientId"`
	Status                string  `json:"status"`
	LastKnownLocation     string  `json:"lastKnownLocation"`
	LastKnownTime         string  `json:"lastKnownTime"`
	Direction             string  `json:"direction"`
	NearestFamiliarPlace  string  `json:"nearestFamiliarPlace"`
	Summary               string  `json:"summary"`
}

// ProcessLocation handles a new incoming coordinate
func ProcessLocation(loc adapters.NormalizedLocation) SpatialStateUpdate {
	// 1. Mock a Graph representing the Home -> Park route
	// In production, fetch this from Redis/Postgres
	mockGraph := FamiliarRouteGraph{
		RouteID: "route_123",
		Name:    "Morning Park Route",
		Nodes: []SpatialNode{
			{ID: "node_home", Name: "Home", Lat: 19.0760, Lng: 72.8777},
			{ID: "node_park", Name: "Park", Lat: 19.0780, Lng: 72.8790},
		},
		Edges: []SpatialEdge{
			{
				FromNode: "node_home",
				ToNode:   "node_park",
				Coordinates: [][]float64{
					{72.8777, 19.0760},
					{72.8780, 19.0770},
					{72.8790, 19.0780},
				},
				AllowedDeviationMeters: 50.0,
			},
		},
	}

	// 2. Call the Rust Spatial Engine for heavy geometry math
	client := resty.New()
	reqBody := RustDeviationRequest{
		Patient: loc,
		Graph:   mockGraph,
	}

	var rustResp RustDeviationResponse
	
	// Fast failover / timeout for real-time safety
	client.SetTimeout(2 * time.Second)
	
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(reqBody).
		SetResult(&rustResp).
		Post("http://localhost:5005/api/engine/deviation")

	status := "NORMAL"
	summary := "Patient is moving."
	
	if err == nil && resp.IsSuccess() {
		status = rustResp.State
		summary = fmt.Sprintf("Patient is %.1fm from expected route. State: %s", rustResp.DeviationMeters, rustResp.State)
	} else {
		fmt.Println("⚠️ Failed to reach Rust engine, falling back to basic heuristics.")
	}

	// 3. Construct the state update
	return SpatialStateUpdate{
		PatientID:            loc.PatientID,
		Status:               status,
		LastKnownLocation:    fmt.Sprintf("%.4f, %.4f", loc.Lat, loc.Lng),
		LastKnownTime:        time.Now().Format(time.RFC3339),
		Direction:            "Moving",
		NearestFamiliarPlace: "Unknown",
		Summary:              summary,
	}
}
