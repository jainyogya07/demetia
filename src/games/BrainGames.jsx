import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Puzzle, Eye, Wind, ListOrdered, Users, Search, BookOpen } from 'lucide-react';
import MatchPairs from './MatchPairs';
import SpotDifference from './SpotDifference';
import BalloonPop from './BalloonPop';
import SequenceMemory from './SequenceMemory';
import FamiliarFaces from './FamiliarFaces';
import ObjectFind from './ObjectFind';
import StorySolver from './StorySolver';
import { useAppNav } from '../AppNavContext';
import './BrainGames.css';

const GAME_LIST = [
  {
    id: 'story-solver',
    featured: true,
    title: 'Past stories',
    description: 'Smriti tells a full memory, asks from that scene, then continues the same story.',
    difficulty: 'Featured · 8–10 min',
    icon: BookOpen,
  },
  {
    id: 'match-pairs',
    title: 'Match the pairs',
    description: 'Flip cards to find matching objects — tea, gamosa, dhol, pitha.',
    difficulty: 'Easy · 5 min',
    icon: Puzzle,
  },
  {
    id: 'spot-diff',
    title: 'Spot the difference',
    description: 'Find what changed between two familiar scenes.',
    difficulty: 'Easy · 5 min',
    icon: Eye,
  },
  {
    id: 'balloon-pop',
    title: 'Balloon pop',
    description: 'Tap the floating balloons. Gentle, no wrong answers.',
    difficulty: 'Easy · 3 min',
    icon: Wind,
  },
  {
    id: 'sequence',
    title: 'Sequence recall',
    description: 'Watch a short order of familiar objects, then tap them in the same sequence.',
    difficulty: 'Easy · 4 min',
    icon: ListOrdered,
  },
  {
    id: 'faces',
    title: 'Familiar faces',
    description: 'Match a person to their name — family, neighbour, ASHA, doctor.',
    difficulty: 'Easy · 4 min',
    icon: Users,
  },
  {
    id: 'object-find',
    title: 'Find the object',
    description: 'Pick the named household thing from a quiet table of daily objects.',
    difficulty: 'Easy · 4 min',
    icon: Search,
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
};

export default function BrainGames() {
  const { gameIntent } = useAppNav();
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    if (gameIntent?.gameId && GAME_COMPONENTS[gameIntent.gameId]) {
      setActiveGame(gameIntent.gameId);
    }
  }, [gameIntent]);

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
            All Games
          </button>
        </div>
        <GameComponent onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="bg-hub">
      <div className="bg-hub-head">
        <div>
          <h2>Brain games</h2>
          <p>Pick a game. Short, unhurried, at your own pace.</p>
        </div>
      </div>

      <p className="bg-category-label">Featured, then the rest</p>

      <div className="bg-grid">
        {GAME_LIST.map((game) => {
          const Icon = game.icon;
          return (
            <article
              key={game.id}
              className={`bg-game-tile ${game.featured ? 'featured' : ''}`}
              onClick={() => setActiveGame(game.id)}
            >
              <div className="bg-tile-emoji"><Icon size={22} /></div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="bg-tile-meta">
                <span className="bg-tile-badge">{game.difficulty}</span>
                <button
                  type="button"
                  className="bg-tile-play"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGame(game.id);
                  }}
                >
                  Start <Play size={13} fill="currentColor" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
