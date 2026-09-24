import { useNavigate } from "react-router-dom";
import agentImage from "../assets/voice-agent/saheli-agent.jpg";

function VoiceAssistant() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 86px)",
        padding: "30px",
        background: "#f8fbfa",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 18px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          marginTop: "25px",
          minHeight: "600px",
          background: "white",
          border: "1px solid #e5e5e5",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <img
          src={agentImage}
          alt="Saheli voice assistant"
          style={{
            width: "240px",
            height: "240px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "5px solid #d7eee9",
          }}
        />

        <h1 style={{ marginTop: "25px" }}>
          I'm here to listen
        </h1>

        <p style={{ color: "#777" }}>
          Tap the microphone and start speaking.
        </p>

        <button
          style={{
            marginTop: "25px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "none",
            background: "#3d9f96",
            color: "white",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          🎙
        </button>

        <p style={{ color: "#555" }}>
          Tap to speak
        </p>
      </div>
    </div>
  );
}

export default VoiceAssistant;