import { Brain, Play, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAppNav } from "../AppNavContext";

function BrainActivity() {
  const {t} = useLanguage();
  const { openModule } = useAppNav();
  const games = [
    {
      name: "Picture Match",
      detail: "Match familiar objects",
      time: "5 min",
      level: "Easy",
      gameId: "match-pairs",
      image:
        "https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&w=500&q=80",
      className: "game-memory",
    },
    {
      name: "Find the Pair",
      detail: "Improve attention",
      time: "5 min",
      level: "Easy",
      gameId: "spot-diff",
      image:
        "https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=500&q=80",
      className: "game-attention",
    },
    {
      name: "Pattern Game",
      detail: "Complete the pattern",
      time: "5 min",
      level: "Easy",
      gameId: "sequence",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80",
      className: "game-pattern",
    },
  ];

  return (
    <div className="brain-activity-card">
      <div className="brain-activity-header">
        <div className="section-title">
          <div className="title-icon">
            <Brain size={21} />
          </div>

          <div>
            <h2>{t("brainActivity")}</h2>
            <p>Simple activities for a healthy mind</p>
          </div>
        </div>

        <span className="recommended-badge">
          {t("recommended")}
        </span>
      </div>

      <div className="brain-games-list">
        {games.map((game) => (
          <div
            className={`brain-game-item ${game.className}`}
            key={game.name}
          >
            <div className="brain-image-wrapper">
              <img
                src={game.image}
                alt={game.name}
                className="brain-game-image"
              />

              <span className="game-level">
                {game.level}
              </span>
            </div>

            <div className="brain-game-info">
              <h3>{game.name}</h3>
              <p>{game.detail}</p>

              <div className="game-meta">
                <span>
                  <Clock size={13} />
                  {game.time}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="start-game-btn"
              onClick={() => openModule("games", { gameId: game.gameId })}
            >
              <Play size={14} fill="currentColor" />
              {t("start")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrainActivity;