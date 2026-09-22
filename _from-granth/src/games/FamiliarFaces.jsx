import React, { useCallback, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const PEOPLE = [
  { id: 'rina', name: 'Rina', relation: 'Daughter', initial: 'R' },
  { id: 'amit', name: 'Doom', relation: 'Son', initial: 'D' },
  { id: 'mina', name: 'Mina', relation: 'ASHA worker', initial: 'M' },
  { id: 'bina', name: 'Bina', relation: 'Neighbour', initial: 'B' },
  { id: 'kiran', name: 'Kiran', relation: 'Sister', initial: 'K' },
  { id: 'arun', name: 'Arun', relation: 'Doctor', initial: 'A' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound(person, pool) {
  const distractors = shuffle(pool.filter((p) => p.id !== person.id)).slice(0, 3);
  return {
    person,
    options: shuffle([person, ...distractors]),
  };
}

export default function FamiliarFaces({ onBack }) {
  const [queue, setQueue] = useState(() => shuffle(PEOPLE));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(() => makeRound(shuffle(PEOPLE)[0], PEOPLE));

  const reset = useCallback(() => {
    const nextQueue = shuffle(PEOPLE);
    setQueue(nextQueue);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
    setRound(makeRound(nextQueue[0], PEOPLE));
  }, []);

  const choose = (personId) => {
    if (picked || finished) return;
    const correct = personId === round.person.id;
    setPicked(personId);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      const next = index + 1;
      if (next >= queue.length) {
        setFinished(true);
        return;
      }
      setIndex(next);
      setPicked(null);
      setRound(makeRound(queue[next], PEOPLE));
    }, 700);
  };

  if (finished) {
    return (
      <div className="game-area">
        <div className="game-result">
          <div className="game-result-emoji">🤍</div>
          <h2>Names and faces</h2>
          <p>You matched {score} of {PEOPLE.length} familiar people.</p>
          <div className="game-result-stats">
            <div className="game-result-stat">
              <span>Correct</span>
              <strong>{score}/{PEOPLE.length}</strong>
            </div>
          </div>
          <div className="game-result-actions">
            <button type="button" className="game-btn-primary" onClick={reset}>
              <RotateCcw size={15} /> Play again
            </button>
            <button type="button" className="game-btn-secondary" onClick={onBack}>
              All Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-inline-head">
        <h2>Familiar faces</h2>
        <div className="game-stats">
          <span className="game-stat-chip">{index + 1}/{PEOPLE.length}</span>
          <span className="game-stat-chip">{score} right</span>
        </div>
      </div>
      <p className="game-soft-lead">Who is this? Choose the name that belongs with the person.</p>
      <div className="game-area faces-board">
        <div className="faces-portrait" aria-hidden>
          <span>{round.person.initial}</span>
        </div>
        <p className="faces-hint">{round.person.relation}</p>
        <div className="faces-options">
          {round.options.map((option) => {
            const state = !picked
              ? ''
              : option.id === round.person.id
                ? 'correct'
                : option.id === picked
                  ? 'wrong'
                  : '';
            return (
              <button
                key={option.id}
                type="button"
                className={`faces-option ${state}`}
                onClick={() => choose(option.id)}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
