import { Mic, MessageSquare, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import voiceAgentImage from "../assets/voice-agent/saheli-agent.jpg";

function VoiceAgentCard() {
  const navigate = useNavigate();

  return (
    <div className="voice-agent-card">

      {/* Voice Agent Image */}
      <div className="voice-agent-image">
        <img
          src={voiceAgentImage}
          alt="Saheli Voice Assistant"
        />
      </div>

      {/* Heading */}
      <h3 className="voice-agent-title">
        Talk to Saheli
        <Heart className="voice-heart" size={20} />
      </h3>

      {/* Description */}
      <p className="voice-agent-description">
        You can type or speak in your language.
      </p>

      {/* Buttons */}
      <div className="voice-agent-actions">

        <button
          className="voice-button"
          onClick={() => navigate("/voice-assistant")}
        >
          <Mic size={19} />
          <span>Talk by Voice</span>
        </button>

        <button
          className="message-button"
          onClick={() => navigate("/chat-assistant")}
        >
          <MessageSquare size={18} />
          <span>Type a message</span>
        </button>

      </div>

      {/* Languages */}
      <div className="voice-agent-language">
        Available in Hindi and 10+ regional languages
      </div>

    </div>
  );
}

export default VoiceAgentCard;