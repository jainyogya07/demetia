import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Mic, Volume2, Send } from "lucide-react";

function VoiceCompanion() {

    const navigate = useNavigate(); 
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  const languages = [
    "অসমীয়া",
    "Khasi",
    "Mizo",
    "Manipuri",
    "Bodo"
  ];

  const handleSpeak = () => {
    navigate("/talk-to-smriti");
  };

  const handleSend = () => {
    if (message.trim() === "") return;

    alert(`Smriti received: ${message}`);
    setMessage("");
  };

  return (
    <section className="voice-companion-card">

      <div className="voice-top">

        <div className="smriti-avatar">
          👵
        </div>

        <div className="voice-text">
          <h2>Smriti – Your Voice Companion</h2>

          <p>I can talk, listen and help you with your day.</p>
          <p>Speak in your language.</p>
        </div>

      </div>

      <button
        className={`speak-button ${listening ? "listening" : ""}`}
        onClick={handleSpeak}
      >
        <Mic size={24} />

        {listening ? "Listening..." : "Tap to Speak"}
      </button>

      <div className="message-box">

        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button onClick={handleSend}>
          <Send size={18} />
        </button>

      </div>

      <div className="voice-languages">

        <span>I speak in:</span>

        {languages.map((language) => (
          <button key={language}>
            {language}
          </button>
        ))}

        <button>+ More</button>

      </div>

      <div className="voice-note">
        <Volume2 size={17} />

        <span>
          Smriti supports Assamese, Khasi, Mizo, Manipuri, Bodo
          and 10+ regional languages.
        </span>
      </div>

    </section>
  );
}

export default VoiceCompanion;