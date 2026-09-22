package adapters

import "time"

// RawObservation represents the messy format incoming from various hardware devices
type RawObservation struct {
	DeviceID  string  `json:"device_id"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp int64   `json:"timestamp"`
	Sensor    string  `json:"sensor"` // e.g. "gps", "apple_watch"
}

// NormalizedLocation is the standard structure our pipeline uses
type NormalizedLocation struct {
	PatientID string  `json:"patient_id"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	Timestamp int64   `json:"timestamp"`
	Source    string  `json:"source"`
}

// NormalizeGPS takes raw device payloads and formats them for the spatial engine
func NormalizeGPS(raw RawObservation, patientID string) NormalizedLocation {
	ts := raw.Timestamp
	if ts == 0 {
		ts = time.Now().UnixMilli()
	}

	return NormalizedLocation{
		PatientID: patientID,
		Lat:       raw.Latitude,
		Lng:       raw.Longitude,
		Timestamp: ts,
		Source:    raw.Sensor,
	}
}
