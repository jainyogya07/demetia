import React, { useState, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import Magnet from '../../components/bits/Magnet';
import BlurText from '../../components/bits/BlurText';
import './RegionalGames.css';

/** NavigationGame — Grid-based spatial navigation with collectibles */
export default function NavigationGame({ data, onBack }) {
  const { title, subtitle, emoji, instruction, gridSize, obstacles, collectibles, playerEmoji, goalEmoji, bgColor } = data;

  const generateGrid = useCallback(() => {
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    // Place player at top-left
    grid[0][0] = { type: 'player' };
    // Place goal at bottom-right
    grid[gridSize - 1][gridSize - 1] = { type: 'goal' };

    // Place obstacles randomly (avoiding player and goal)
    const totalCells = gridSize * gridSize;
    const obstacleCount = Math.min(Math.floor(totalCells * 0.2), obstacles.length * 2);
    let placed = 0;
    while (placed < obstacleCount) {
      const r = Math.floor(Math.random() * gridSize);
      const c = Math.floor(Math.random() * gridSize);
      if (!grid[r][c] && !(r === 0 && c === 0) && !(r === gridSize - 1 && c === gridSize - 1)) {
        grid[r][c] = { type: 'obstacle', emoji: obstacles[Math.floor(Math.random() * obstacles.length)] };
        placed++;
      }
    }

    // Place collectibles
    const collectCount = Math.min(3, collectibles.length);
    let cPlaced = 0;
    while (cPlaced < collectCount) {
      const r = Math.floor(Math.random() * gridSize);
      const c = Math.floor(Math.random() * gridSize);
      if (!grid[r][c]) {
        grid[r][c] = { type: 'collectible', emoji: collectibles[cPlaced % collectibles.length] };
        cPlaced++;
      }
    }

    return grid;
  }, [gridSize, obstacles, collectibles]);

  const [grid, setGrid] = useState(() => generateGrid());
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [collected, setCollected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  const move = useCallback((dr, dc) => {
    if (finished) return;
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return;

    const cell = grid[nr][nc];
    if (cell?.type === 'obstacle') return;

    // Collect item
    if (cell?.type === 'collectible') {
      setCollected(prev => [...prev, cell.emoji]);
      const newGrid = grid.map(row => [...row]);
      newGrid[nr][nc] = null;
      setGrid(newGrid);
    }

    // Move player
    const newGrid = grid.map(row => [...row]);
    newGrid[playerPos.r][playerPos.c] = null;
    newGrid[nr][nc] = newGrid[nr][nc]?.type === 'goal' ? { type: 'goal' } : { type: 'player' };
    setGrid(newGrid);
    setPlayerPos({ r: nr, c: nc });
    setMoves(m => m + 1);

    // Check win
    if (nr === gridSize - 1 && nc === gridSize - 1) {
      setFinished(true);
    }
  }, [finished, playerPos, grid, gridSize]);

  // Keyboard support
  React.useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); move(-1, 0); break;
        case 'ArrowDown': e.preventDefault(); move(1, 0); break;
        case 'ArrowLeft': e.preventDefault(); move(0, -1); break;
        case 'ArrowRight': e.preventDefault(); move(0, 1); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  const reset = () => {
    setGrid(generateGrid());
    setPlayerPos({ r: 0, c: 0 });
    setCollected([]);
    setMoves(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="rg-engine">
        <div className="rg-complete">
          <div className="rg-complete-emoji">🏆</div>
          <BlurText text="You Made It!" className="rg-complete-h3" delay={50} style={{ fontSize: '26px', fontWeight: 800, color: '#176b58', margin: 0 }} />
          <p>{moves} moves · Collected: {collected.length > 0 ? collected.join(' ') : 'None'}</p>
          <Trophy size={48} color="#176b58" />
          <button className="rg-play-again" onClick={reset}><RotateCcw size={18} /> Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rg-engine">
      <div className="rg-header">
        <div className="rg-header-emoji">{emoji}</div>
        <div className="rg-header-text">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="rg-instruction">{instruction}</div>

      <div className="rg-score-bar">
        <span>👣 {moves} moves</span>
        <span>🎒 {collected.length > 0 ? collected.join(' ') : '—'}</span>
      </div>

      <div className="rg-nav-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.map((row, ri) =>
          row.map((cell, ci) => {
            const isPlayer = ri === playerPos.r && ci === playerPos.c;
            const isGoal = ri === gridSize - 1 && ci === gridSize - 1;
            const isObstacle = cell?.type === 'obstacle';
            const isCollectible = cell?.type === 'collectible';

            return (
              <div
                key={`${ri}-${ci}`}
                className={`rg-nav-cell${isPlayer ? ' is-player' : ''}${isGoal ? ' is-goal' : ''}${isObstacle ? ' is-obstacle' : ''}`}
                onClick={() => {
                  // Allow tap to move if adjacent
                  const dr = ri - playerPos.r;
                  const dc = ci - playerPos.c;
                  if (Math.abs(dr) + Math.abs(dc) === 1) move(dr, dc);
                }}
              >
                {isPlayer ? playerEmoji : isGoal && !isPlayer ? goalEmoji : isObstacle ? cell.emoji : isCollectible ? cell.emoji : ''}
              </div>
            );
          })
        )}
      </div>

      <div className="rg-nav-controls">
        <div style={{ gridArea: 'up' }}>
          <Magnet padding={20} disabled={false} magnetStrength={3}>
            <button className="rg-nav-btn" onClick={() => move(-1, 0)}>⬆️</button>
          </Magnet>
        </div>
        <div style={{ gridArea: 'left' }}>
          <Magnet padding={20} disabled={false} magnetStrength={3}>
            <button className="rg-nav-btn" onClick={() => move(0, -1)}>⬅️</button>
          </Magnet>
        </div>
        <div style={{ gridArea: 'right' }}>
          <Magnet padding={20} disabled={false} magnetStrength={3}>
            <button className="rg-nav-btn" onClick={() => move(0, 1)}>➡️</button>
          </Magnet>
        </div>
        <div style={{ gridArea: 'down' }}>
          <Magnet padding={20} disabled={false} magnetStrength={3}>
            <button className="rg-nav-btn" onClick={() => move(1, 0)}>⬇️</button>
          </Magnet>
        </div>
      </div>
    </div>
  );
}
