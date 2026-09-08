import { Brain, Play, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAppNav } from "../AppNavContext";

function BrainActivity() {
  const {t} = useLanguage();
  const { openModule } = useAppNav();
  const games = [
    {
      name: t("pictureMatch"),
      detail: t("memoryGame"),
      time: t("minutes"),
      level: t("easy"),
      gameId: "match-pairs",
      image:
        "https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&w=500&q=80",
      className: "game-memory",
    },
    {
      name: t("findPair"),
      detail: t("attentionGame"),
      time: t("minutes"),
      level: t("easy"),
      gameId: "spot-diff",
      image:
        "https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=500&q=80",
      className: "game-attention",
    },
    {
      name: t("patternGame"),
      detail: t("thinkingGame"),
      time: t("minutes"),
      level: t("easy"),
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
            <p>{t("simpleActivities")}</p>
          </div>
        </div>

        <span className="recommended-badge">
          {t("recommendedToday")}
        </span>
      </div>

      <div className="brain-games-list">
        {games.map((game) => (
          <div
            className={`brain-game-item ${game.className}`}
            key={game.gameId}
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