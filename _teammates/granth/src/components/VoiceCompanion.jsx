import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Mic, Volume2, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function VoiceCompanion() {

  const navigate = useNavigate(); 
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const {t} = useLanguage();

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
          <h2>{t("smritiVoiceCompanion")}</h2>

          <p>{t("voiceDescription")}</p>
          <p>{t("speakLang")}</p>
        </div>

      </div>

      <button
        className={`speak-button ${listening ? "listening" : ""}`}
        onClick={handleSpeak}
      >
        <Mic size={24} />

        {listening ? t("listening...") : t("tapToSpeak")}
      </button>

      <div className="message-box">

        <input
          type="text"
          placeholder={t("typeMessage")}
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
          {t("availableLanguages")}
        </span>
      </div>

    </section>
  );
}

export default VoiceCompanion;