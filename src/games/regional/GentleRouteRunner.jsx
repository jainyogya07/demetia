import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import BlurText from '../../components/bits/BlurText';
import { getFamiliarPlaces } from '../../spatial/FamiliarPlaces';
import './RegionalGames.css';

/**
 * GentleRouteRunner
 * Simulated Spatial Experience using simple 2D or basic 3D rendering (mocked here).
 * Focuses purely on orientation and familiarity, strictly without clinical assessment scores.
 */
export default function GentleRouteRunner({ onClose }) {
  const [gameState, setGameState] = useState('briefing'); // briefing, playing, finished, recovery
  const [places, setPlaces] = useState([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    setPlaces(getFamiliarPlaces());
  }, []);

  const handleStart = () => setGameState('playing');

  const handleTurn = (direction) => {
    // In a full implementation, this controls the 3D WebGL engine
    // For this mockup, we just simulate progress or a wrong turn
    if (progress > 2 && direction === 'left') {
      // Simulate wrong turn
      setGameState('recovery');
    } else {
      setProgress(p => p + 1);
      if (progress > 4) {
        setGameState('finished');
      }
    }
  };

  const handleRecovery = () => {
    setGameState('playing');
  };

  if (gameState === 'briefing') {
    return (
      <div className="rg-engine">
        <div className="rg-header">
          <div className="rg-header-emoji">🏡</div>
          <div className="rg-header-text">
            <h3>Let's go home.</h3>
            <p>We'll take a calm walk through your familiar places.</p>
          </div>
        </div>
        <button className="rg-nav-btn" onClick={handleStart} style={{ width: '100%', padding: '16px', fontSize: '18px', marginTop: '32px' }}>Start Walking</button>
      </div>
    );
  }

  if (gameState === 'recovery') {
    return (
      <div className="rg-engine" style={{ background: 'rgba(23, 107, 88, 0.1)' }}>
        <div className="rg-complete">
          <BlurText text="Let's look around..." className="rg-complete-h3" delay={50} style={{ fontSize: '24px', fontWeight: 700, color: '#176b58', margin: 0 }} />
          <p style={{ fontSize: '18px', marginTop: '16px' }}>Does this place feel familiar?</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', width: '100%', justifyContent: 'center' }}>
            <button className="rg-nav-btn" onClick={handleRecovery}>Turn Back Safely</button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="rg-engine">
        <div className="rg-complete">
          <div className="rg-complete-emoji">📍</div>
          <BlurText text="We made it home safely!" className="rg-complete-h3" delay={50} style={{ fontSize: '26px', fontWeight: 800, color: '#176b58', margin: 0 }} />
          <button className="rg-play-again" onClick={onClose}><RotateCcw size={18} /> Close Walk</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rg-engine">
      <div className="rg-header" style={{ opacity: 0.5 }}>
        <div className="rg-header-text">
          <h3>Walking...</h3>
          <p>Heading towards: {places.find(p => p.category === 'HOME')?.name || 'Home'}</p>
        </div>
      </div>

      <div className="rg-instruction" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#60716b' }}>
        [ 3D Route Simulation Layer ]
      </div>

      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '32px' }}>
        <button className="rg-nav-btn" onClick={() => handleTurn('left')} style={{ width: '120px', height: '120px' }}>
          <ArrowLeft size={48} />
        </button>
        <button className="rg-nav-btn" onClick={() => handleTurn('right')} style={{ width: '120px', height: '120px' }}>
          <ArrowRight size={48} />
        </button>
      </div>
    </div>
  );
}
