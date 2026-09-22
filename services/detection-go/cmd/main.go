package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"

	"detection-go/internal/adapters"
	"detection-go/internal/tracking"
)

func main() {
	fmt.Println("🛰️ Go Detection & Ingestion Service Starting...")

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "detection-go"})
	})

	// Webhook endpoint for receiving high-throughput device streams (GPS, IoT)
	r.POST("/api/ingest/location", func(c *gin.Context) {
		var raw adapters.RawObservation
		
		if err := c.ShouldBindJSON(&raw); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 1. Normalize
		loc := adapters.NormalizeGPS(raw, raw.DeviceID)

		// 2. Process (Call Rust Math)
		stateUpdate := tracking.ProcessLocation(loc)

		// 3. Emit to Node.js Orchestrator (Mocking Redis Pub/Sub)
		fmt.Printf("📢 Emitting Spatial State for %s: %s\n", stateUpdate.PatientID, stateUpdate.Status)
		
		client := resty.New()
		_, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(stateUpdate).
			Post("http://localhost:4000/api/spatial/internal/broadcast")
			
		if err != nil {
			fmt.Printf("⚠️ Failed to broadcast to Node.js: %v\n", err)
		}

		c.JSON(http.StatusOK, gin.H{"status": "processed", "state": stateUpdate})
	})

	r.Run(":8080") // Go runs on port 8080
}
