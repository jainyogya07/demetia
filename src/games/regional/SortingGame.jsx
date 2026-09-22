import React, { useState, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import SpotlightCard from '../../components/bits/SpotlightCard';
import BlurText from '../../components/bits/BlurText';
import './RegionalGames.css';

/** SortingGame — Drag-and-drop categorization engine */
export default function SortingGame({ data, onBack }) {
  const { title, subtitle, emoji, instruction, categories, items: allItems, bgColor } = data;
  const [remaining, setRemaining] = useState(() => shuffle([...allItems]));
  const [bins, setBins] = useState(() => Object.fromEntries(categories.map(c => [c.id, []])));
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const [overZone, setOverZone] = useState(null);

  const finished = remaining.length === 0;

  const handleDrop = useCallback((categoryId) => {
    if (!dragItem) return;
    if (dragItem.category === categoryId) {
      setScore(s => s + 1);
      setBins(b => ({ ...b, [categoryId]: [...b[categoryId], dragItem] }));
      setRemaining(r => r.filter(i => i.id !== dragItem.id));
      setLastFeedback('✅ Correct!');
    } else {
      setWrong(w => w + 1);
      setLastFeedback('❌ Try again');
    }
    setDragItem(null);
    setOverZone(null);
    setTimeout(() => setLastFeedback(null), 900);
  }, [dragItem]);

  const handleTapItem = useCallback((item) => {
    setDragItem(prev => prev?.id === item.id ? null : item);
  }, []);

  const handleTapZone = useCallback((categoryId) => {
    if (dragItem) handleDrop(categoryId);
  }, [dragItem, handleDrop]);

  const reset = () => {
    setRemaining(shuffle([...allItems]));
    setBins(Object.fromEntries(categories.map(c => [c.id, []])));
    setScore(0);
    setWrong(0);
    setLastFeedback(null);
    setDragItem(null);
  };

  if (finished) {
    return (
      <div className="rg-engine">
        <div className="rg-complete">
          <div className="rg-complete-emoji">🎉</div>
          <BlurText text="Wonderful!" className="rg-complete-h3" delay={50} style={{ fontSize: '26px', fontWeight: 800, color: '#176b58', margin: 0 }} />
          <p>You sorted all {allItems.length} items with {score} correct and {wrong} mistakes.</p>
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
        <span>✅ {score}</span>
        <span>❌ {wrong}</span>
        <span>📦 {remaining.length} left</span>
      </div>

      {lastFeedback && <div className="rg-instruction" style={{ fontWeight: 700 }}>{lastFeedback}</div>}

      <div className="rg-sort-zones">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`rg-sort-zone${overZone === cat.id ? ' is-over' : ''}`}
            style={{ borderColor: cat.color }}
            onDragOver={e => { e.preventDefault(); setOverZone(cat.id); }}
            onDragLeave={() => setOverZone(null)}
            onDrop={e => { e.preventDefault(); handleDrop(cat.id); }}
            onClick={() => handleTapZone(cat.id)}
          >
            <div className="rg-sort-zone-label" style={{ color: cat.color }}>
              {cat.emoji} {cat.label}
            </div>
            <div className="rg-sort-zone-items">
              {bins[cat.id].map(item => (
                <span key={item.id} className="rg-sort-zone-item">{item.emoji}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rg-sort-items">
        {remaining.map(item => (
          <SpotlightCard spotlightColor="rgba(23, 107, 88, 0.2)" key={item.id}>
            <div
              className={`rg-sort-item${dragItem?.id === item.id ? ' is-correct' : ''}`}
              draggable
              onDragStart={() => setDragItem(item)}
              onClick={() => handleTapItem(item)}
              style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
            >
              <span className="rg-sort-item-emoji">{item.emoji}</span>
              <span className="rg-sort-item-label">{item.label}</span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
