package com.smritisaarthi.app

import android.app.*
import android.content.Context
import android.content.Intent
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

/**
 * 🛰️ SpatialTelemetryDaemon
 * Native Kotlin background service providing non-terminating, battery-conscious
 * spatial positioning to the Smriti Saarthi Go Telemetry Ingest Hub.
 */
class SpatialTelemetryDaemon : Service(), LocationListener {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var locationManager: LocationManager? = null
    private val channelId = "smriti_guardian_channel"
    private val notificationId = 1007

    override fun onCreate() {
        super.onCreate()
        try {
            createNotificationChannel()
            val hasFineLocation = androidx.core.content.ContextCompat.checkSelfPermission(
                this, android.Manifest.permission.ACCESS_FINE_LOCATION
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
            val hasCoarseLocation = androidx.core.content.ContextCompat.checkSelfPermission(
                this, android.Manifest.permission.ACCESS_COARSE_LOCATION
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED

            if (hasFineLocation || hasCoarseLocation) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    startForeground(
                        notificationId,
                        buildNotification("Guardian Mode Active", "Continuous safety monitoring"),
                        android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
                    )
                } else {
                    startForeground(
                        notificationId,
                        buildNotification("Guardian Mode Active", "Continuous safety monitoring")
                    )
                }
                setupLocationTracking()
            } else {
                stopSelf()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            stopSelf()
        }
    }

    private fun setupLocationTracking() {
        try {
            locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
            // Requests GPS every 5 seconds or 5 meters displacement to preserve battery
            locationManager?.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                5000L,
                5.0f,
                this
            )
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    override fun onLocationChanged(location: Location) {
        serviceScope.launch {
            sendLocationToGoIngest(location.latitude, location.longitude, location.speed)
        }
    }

    private suspend fun sendLocationToGoIngest(lat: Double, lng: Double, speed: Float) {
        withContext(Dispatchers.IO) {
            try {
                // Post directly to Go Ingestion Hub (Port 8080)
                val url = URL("http://10.0.2.2:8080/api/ingest/location")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.doOutput = true
                conn.connectTimeout = 3000
                conn.readTimeout = 3000

                val payload = JSONObject().apply {
                    put("device_id", "aita_android_wear")
                    put("latitude", lat)
                    put("longitude", lng)
                    put("speed", speed)
                    put("timestamp", System.currentTimeMillis())
                    put("sensor", "fused_gps")
                }

                OutputStreamWriter(conn.outputStream).use { writer ->
                    writer.write(payload.toString())
                    writer.flush()
                }

                val responseCode = conn.responseCode
                conn.disconnect()
            } catch (e: Exception) {
                // Silent failover or queue locally into SQLite Room
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Smriti Saarthi Safety Daemon",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Monitors safe boundaries and routine locations"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(title: String, text: String): Notification {
        return NotificationCompat.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY // Ensures service resurrects if system pressure kills it
    }

    override fun onDestroy() {
        super.onDestroy()
        locationManager?.removeUpdates(this)
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // Boilerplate for legacy SDKs
    override fun onProviderEnabled(provider: String) {}
    override fun onProviderDisabled(provider: String) {}
    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
}
