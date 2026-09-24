import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Mic, Send, ShieldCheck, CheckCircle2, AlertCircle, Info, MapPin, Users, Sparkles, BookOpen, Clock, Heart, TriangleAlert } from 'lucide-react';
import './TrainAiPage.css';

const INITIAL_KNOWLEDGE = {
  about: [
    { id: 'a1', text: 'Born in Shillong, moved to Guwahati in 1985.', source: 'Rina (Daughter)' },
    { id: 'a2', text: 'Likes old Assamese songs and classical music.', source: 'Rina (Daughter)' }
  ],
  routine: [
    { id: 'r1', text: 'Has tea exactly at 4 PM every day.', source: 'Rina (Daughter)' },
    { id: 'r2', text: 'Goes for a walk in the garden after breakfast.', source: 'Rina (Daughter)' }
  ],
  people: [
    { id: 'p1', text: 'Daughter is Rina. Grandson is Rahul.', source: 'System' },
    { id: 'p2', text: 'Best friend from childhood is Sunita (passed away).', source: 'Rina (Daughter)' }
  ],
  confusion: [
    { id: 'c1', text: 'Sometimes asks for her husband (passed away 5 years ago).', source: 'Rina (Daughter)' },
    { id: 'c2', text: 'Gets confused about whether she took her morning pill.', source: 'Rina (Daughter)' }
  ],
  responses: [
    { id: 'rs1', text: 'If she asks for husband: Say "He went to the market and will be late, let\'s have tea first."', source: 'Rina (Daughter)' },
    { id: 'rs2', text: 'When anxious about pills: Calmly assure her that Rina has kept the count and she is safe.', source: 'Doctor' }
  ],
  avoid: [
    { id: 'av1', text: 'Do not argue if she says she needs to go to work.', source: 'Doctor' },
    { id: 'av2', text: 'Avoid mentioning hospitalization.', source: 'Rina (Daughter)' }
  ]
};

const CATEGORIES = [
  { id: 'about', label: 'About Patient', icon: Info },
  { id: 'routine', label: 'Places & Routine', icon: MapPin },
  { id: 'people', label: 'Important People', icon: Users },
  { id: 'confusion', label: 'Memory/Confusion Patterns', icon: BrainCircuit },
  { id: 'responses', label: 'Preferred Responses', icon: Sparkles },
  { id: 'avoid', label: 'Things to Avoid', icon: TriangleAlert }
];

export default function TrainAiPage() {
  const [knowledge, setKnowledge] = useState(INITIAL_KNOWLEDGE);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('about');

  const handleTrain = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // In a real app, backend NLP would extract category and structure.
    // Here we just append to the active category for prototyping.
    const newFact = {
      id: Date.now().toString(),
      text: inputText,
      source: 'Rina (Daughter)'
    };
    
    setKnowledge(prev => ({
      ...prev,
      [activeCategory]: [...prev[activeCategory], newFact]
    }));
    
    setInputText('');
  };

  const removeFact = (category, id) => {
    setKnowledge(prev => ({
      ...prev,
      [category]: prev[category].filter(fact => fact.id !== id)
    }));
  };

  return (
    <div className="train-ai-page">
      <div className="train-ai-header">
        <div className="title-row">
          <div className="icon-wrap">
            <BrainCircuit size={24} className="title-icon" />
          </div>
          <div>
            <h2>Train AI Agent</h2>
            <p>Teach the Care Agent specific facts and preferences to personalize patient assistance.</p>
          </div>
        </div>
        <div className="privacy-badge">
          <ShieldCheck size={16} />
          <span>Private & Secure. Used only for this patient.</span>
        </div>
      </div>

      <div className="train-ai-layout">
        {/* Left Column: Input Panel */}
        <div className="train-ai-input-panel">
          <div className="panel-header">
            <h3>Add New Knowledge</h3>
            <p>Type or speak to teach the Care Agent a new fact or preference.</p>
          </div>
          
          <form className="train-form" onSubmit={handleTrain}>
            <div className="input-category-select">
              <label>Select Category:</label>
              <div className="category-chips">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    type="button" 
                    className={`cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-wrapper">
              <textarea 
                placeholder="e.g., 'When she gets anxious, talking about her childhood home usually calms her.'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
              />
              <div className="input-actions">
                <button 
                  type="button" 
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => setIsListening(!isListening)}
                >
                  <Mic size={18} />
                  {isListening ? 'Listening...' : 'Speak'}
                </button>
                <button type="submit" className="submit-btn" disabled={!inputText.trim()}>
                  <Send size={18} />
                  Train Agent
                </button>
              </div>
            </div>
          </form>

          <div className="continuous-learning-note">
            <div className="cl-icon"><Sparkles size={20} /></div>
            <div className="cl-text">
              <strong>Continuous Learning</strong>
              <p>As the patient interacts with the Care Agent, it will suggest new facts here for your approval before saving them permanently.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Knowledge Base */}
        <div className="train-ai-kb-panel">
          <div className="panel-header">
            <h3>What Care Agent Knows</h3>
            <p>Structured memory base retrieved during patient interactions.</p>
          </div>

          <div className="kb-scroll-area">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="kb-category-section">
                <h4 className="kb-cat-title">
                  <cat.icon size={18} />
                  {cat.label}
                  <span className="fact-count">{knowledge[cat.id].length}</span>
                </h4>
                
                {knowledge[cat.id].length === 0 ? (
                  <p className="empty-state">No facts added yet.</p>
                ) : (
                  <ul className="fact-list">
                    {knowledge[cat.id].map(fact => (
                      <li key={fact.id} className="fact-item">
                        <div className="fact-content">
                          <p>{fact.text}</p>
                          <span className="fact-source">Added by {fact.source}</span>
                        </div>
                        <button 
                          className="remove-fact-btn" 
                          onClick={() => removeFact(cat.id, fact.id)}
                          aria-label="Remove fact"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
