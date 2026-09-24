// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Puzzle, Eye, Wind, ListOrdered, Users, Search, BookOpen, Compass, Pencil, Sparkles, MapPin } from 'lucide-react';
import MatchPairs from './MatchPairs';
import SpotDifference from './SpotDifference';
import BalloonPop from './BalloonPop';
import SequenceMemory from './SequenceMemory';
import FamiliarFaces from './FamiliarFaces';
import ObjectFind from './ObjectFind';
import StorySolver from './StorySolver';
import MemoryJourney from './MemoryJourney';
import GentleRouteRunner from './regional/GentleRouteRunner';
import ShapeDraw from './ShapeDraw';
import SortingGame from './regional/SortingGame';
import RhythmTapGame from './regional/RhythmTapGame';
import RegionalMatchGame from './regional/RegionalMatchGame';
import TracingGame from './regional/TracingGame';
import NavigationGame from './regional/NavigationGame';
import { getRegionalPack } from './regional/index';
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
  {
    id: 'shape-draw',
    titleKey: 'gamesHub.drawTitle',
    descKey: 'gamesHub.drawDesc',
    diffKey: 'gamesHub.drawDiff',
    icon: Pencil,
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
  'shape-draw': ShapeDraw,
};

const REGIONAL_ENGINES = {
  sorting: SortingGame,
  rhythm: RhythmTapGame,
  match: RegionalMatchGame,
  tracing: TracingGame,
  navigation: NavigationGame,
};

const REGIONAL_TYPE_META = {
  sorting: { icon: '📦', diffLabel: 'Easy · Sorting' },
  rhythm: { icon: '🎵', diffLabel: 'Medium · Rhythm' },
  match: { icon: '🃏', diffLabel: 'Easy · Memory' },
  tracing: { icon: '✏️', diffLabel: 'Medium · Tracing' },
  navigation: { icon: '🧭', diffLabel: 'Easy · Navigation' },
};

export default function BrainGames() {
  const { gameIntent, setActiveGameId } = useAppNav();
  const { t, lang } = useI18n();
  const [activeGame, setActiveGame] = useState<unknown>(null);
  const [activeRegional, setActiveRegional] = useState<unknown>(null); // { type, data }
  const [showSpatialGame, setShowSpatialGame] = useState(false);

  const regionalPack = getRegionalPack(lang);

  useEffect(() => {
    if (!gameIntent?.ts) return;
    if (gameIntent.gameId && GAME_COMPONENTS[gameIntent.gameId]) {
      setActiveGame(gameIntent.gameId);
      setActiveRegional(null);
    } else {
      setActiveGame(null);
    }
  }, [gameIntent]);

  useEffect(() => {
    setActiveGameId?.(activeGame || activeRegional?.type || null);
  }, [activeGame, activeRegional, setActiveGameId]);

  useEffect(() => () => setActiveGameId?.(null), [setActiveGameId]);

  if (showSpatialGame) {
    return (
      <div className="game-wrapper">
        <GentleRouteRunner onClose={() => setShowSpatialGame(false)} />
      </div>
    );
  }

  // Render regional game
  if (activeRegional) {
    const Engine = REGIONAL_ENGINES[activeRegional.type];
    return (
      <div className="game-wrapper">
        <div className="game-topbar">
          <button
            type="button"
            className="bg-back-btn"
            onClick={() => setActiveRegional(null)}
          >
            <ArrowLeft size={16} />
            {t('gamesHub.back')}
          </button>
        </div>
        <Engine data={activeRegional.data} onBack={() => setActiveRegional(null)} />
      </div>
    );
  }

  // Render existing game
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

  const regionalGames = [
    { type: 'sorting', data: regionalPack.sorting },
    { type: 'rhythm', data: regionalPack.rhythm },
    { type: 'match', data: regionalPack.match },
    { type: 'tracing', data: regionalPack.tracing },
    { type: 'navigation', data: regionalPack.navigation },
  ];

  return (
    <div className="bg-hub">
      <div className="bg-hub-head">
        <div>
          <h2>{t('gamesHub.title')}</h2>
          <p>{t('gamesHub.lead')}</p>
        </div>
      </div>

      {/* ── Regional Cultural Games ── */}
      <p className="bg-category-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={16} /> Your Cultural Games
      </p>

      <div className="bg-grid">
        {regionalGames.map((rg) => {
          const meta = REGIONAL_TYPE_META[rg.type];
          return (
            <article
              key={rg.data.id}
              className="bg-game-tile"
              onClick={() => setActiveRegional(rg)}
            >
              <div className="bg-tile-emoji" style={{ fontSize: 32 }}>
                {rg.data.emoji}
              </div>
              <h3>{rg.data.title}</h3>
              <p>{rg.data.subtitle}</p>
              <div className="bg-tile-meta">
                <span className="bg-tile-badge">{meta.diffLabel}</span>
                <button
                  type="button"
                  className="bg-tile-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveRegional(rg);
                  }}
                >
                  {t('gamesHub.play')} <Play size={13} fill="currentColor" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Spatial Intelligence ── */}
      <p className="bg-category-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '24px' }}>
        <MapPin size={16} /> Safe Journey
      </p>

      <div className="bg-grid">
        <article
          className="bg-game-tile featured"
          onClick={() => setShowSpatialGame(true)}
        >
          <div className="bg-tile-emoji" style={{ fontSize: 32 }}>🌍</div>
          <h3>Let's Go Home</h3>
          <p>A gentle walk home. We’re with you.</p>
          <div className="bg-tile-meta">
            <span className="bg-tile-badge" style={{ background: 'rgba(23,107,88,0.1)', color: '#176b58' }}>Safe Journey</span>
            <button
              type="button"
              className="bg-tile-play"
              onClick={(e) => {
                e.stopPropagation();
                setShowSpatialGame(true);
              }}
            >
              Start Walk <Play size={13} fill="currentColor" />
            </button>
          </div>
        </article>
      </div>

      {/* ── Original Games ── */}
      <p className="bg-category-label" style={{ marginTop: '24px' }}>Classic Brain Games</p>

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
