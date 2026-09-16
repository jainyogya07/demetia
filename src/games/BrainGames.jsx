import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Puzzle, Eye, Wind, ListOrdered, Users, Search, BookOpen, Compass } from 'lucide-react';
import MatchPairs from './MatchPairs';
import SpotDifference from './SpotDifference';
import BalloonPop from './BalloonPop';
import SequenceMemory from './SequenceMemory';
import FamiliarFaces from './FamiliarFaces';
import ObjectFind from './ObjectFind';
import StorySolver from './StorySolver';
import MemoryJourney from './MemoryJourney';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import './BrainGames.css';

/* ── Game-specific AI-generated illustrations ─────────────── */
import imgPastStories from '../assets/game-past-stories.jpg';
import imgMatchPairs from '../assets/game-match-pairs.jpg';
import imgSpotDiff from '../assets/game-spot-difference.jpg';
import imgBalloonPop from '../assets/game-balloon-pop.jpg';
import imgSequence from '../assets/game-sequence-recall.jpg';
import imgFaces from '../assets/game-familiar-faces.jpg';
import imgFindObject from '../assets/game-find-object.jpg';

const GAME_DEFS = [
  {
    id: 'story-solver',
    featured: true,
    titleKey: 'gamesHub.storyTitle',
    descKey: 'gamesHub.storyDesc',
    diffKey: 'gamesHub.storyDiff',
    icon: BookOpen,
    photo: imgPastStories,
  },
  {
    id: 'match-pairs',
    titleKey: 'gamesHub.matchTitle',
    descKey: 'gamesHub.matchDesc',
    diffKey: 'gamesHub.matchDiff',
    icon: Puzzle,
    photo: imgMatchPairs,
  },
  {
    id: 'spot-diff',
    titleKey: 'gamesHub.spotTitle',
    descKey: 'gamesHub.spotDesc',
    diffKey: 'gamesHub.spotDiff',
    icon: Eye,
    photo: imgSpotDiff,
  },
  {
    id: 'balloon-pop',
    titleKey: 'gamesHub.balloonTitle',
    descKey: 'gamesHub.balloonDesc',
    diffKey: 'gamesHub.balloonDiff',
    icon: Wind,
    photo: imgBalloonPop,
  },
  {
    id: 'sequence',
    titleKey: 'gamesHub.sequenceTitle',
    descKey: 'gamesHub.sequenceDesc',
    diffKey: 'gamesHub.sequenceDiff',
    icon: ListOrdered,
    photo: imgSequence,
  },
  {
    id: 'faces',
    titleKey: 'gamesHub.facesTitle',
    descKey: 'gamesHub.facesDesc',
    diffKey: 'gamesHub.facesDiff',
    icon: Users,
    photo: imgFaces,
  },
  {
    id: 'memory-journey',
    titleKey: 'gamesHub.journeyTitle',
    descKey: 'gamesHub.journeyDesc',
    diffKey: 'gamesHub.journeyDiff',
    icon: Compass,
    photo: imgPastStories,
  },
  {
    id: 'object-find',
    titleKey: 'gamesHub.findTitle',
    descKey: 'gamesHub.findDesc',
    diffKey: 'gamesHub.findDiff',
    icon: Search,
    photo: imgFindObject,
  },
];

const GAME_COMPONENTS = {
  'story-solver': StorySolver,
  'match-pairs': MatchPairs,
  'spot-diff': SpotDifference,
  'balloon-pop': BalloonPop,
  sequence: SequenceMemory,
  faces: FamiliarFaces,
  'object-find': ObjectFind,
  'memory-journey': MemoryJourney,
};

export default function BrainGames() {
  const { gameIntent, setActiveGameId } = useAppNav();
  const { t } = useI18n();
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    if (!gameIntent?.ts) return;
    if (gameIntent.gameId && GAME_COMPONENTS[gameIntent.gameId]) {
      setActiveGame(gameIntent.gameId);
    } else {
      setActiveGame(null);
    }
  }, [gameIntent]);

  useEffect(() => {
    setActiveGameId?.(activeGame);
  }, [activeGame, setActiveGameId]);

  useEffect(() => () => setActiveGameId?.(null), [setActiveGameId]);

  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    return (
      <div className="game-wrapper">
        <div className="game-topbar">
          <button
            type="button"
            className="bg-back-btn"
            onClick={() => setActiveGame(null)}
          >
            <ArrowLeft size={16} />
            {t('gamesHub.back')}
          </button>
        </div>
        <GameComponent onBack={() => setActiveGame(null)} onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="bg-hub">
      <div className="bg-hub-head">
        <div>
          <h2>{t('gamesHub.title')}</h2>
          <p>{t('gamesHub.lead')}</p>
        </div>
      </div>

      <p className="bg-category-label">Featured, then the rest</p>

      <div className="bg-grid">
        {GAME_DEFS.map((game) => {
          const Icon = game.icon;
          return (
            <article
              key={game.id}
              className={`bg-game-tile ${game.featured ? 'featured' : ''}`}
              onClick={() => setActiveGame(game.id)}
            >
              <div className="bg-tile-emoji">
                {game.photo ? <img src={game.photo} alt="" /> : <Icon size={22} />}
              </div>
              <h3>{t(game.titleKey)}</h3>
              <p>{t(game.descKey)}</p>
              <div className="bg-tile-meta">
                <span className="bg-tile-badge">{t(game.diffKey)}</span>
                <button
                  type="button"
                  className="bg-tile-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGame(game.id);
                  }}
                >
                  {t('gamesHub.play')} <Play size={13} fill="currentColor" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
