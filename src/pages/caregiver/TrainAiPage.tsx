import React, { useState, useEffect } from 'react';
import { BrainCircuit, Mic, Send, ShieldCheck, Info, MapPin, Users, Sparkles, TriangleAlert } from 'lucide-react';
import {
  getAiKnowledge,
  addAiKnowledgeFact,
  removeAiKnowledgeFact,
  subscribeCaregiverStore,
} from '../../lib/caregiverStore';
import { bffSilent } from '../../lib/bff';
import './TrainAiPage.css';

const CATEGORIES = [
  { id: 'about', label: 'About Patient', icon: Info },
  { id: 'routine', label: 'Places & Routine', icon: MapPin },
  { id: 'people', label: 'Important People', icon: Users },
  { id: 'confusion', label: 'Memory/Confusion Patterns', icon: BrainCircuit },
  { id: 'responses', label: 'Preferred Responses', icon: Sparkles },
  { id: 'avoid', label: 'Things to Avoid', icon: TriangleAlert }
];

export default function TrainAiPage() {
  const [knowledge, setKnowledge] = useState(() => getAiKnowledge());
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('about');

  useEffect(() => {
    return subscribeCaregiverStore(() => {
      setKnowledge(getAiKnowledge());
    });
  }, []);

  const handleTrain = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addAiKnowledgeFact(activeCategory, inputText.trim(), 'Rina (Daughter)');
    bffSilent('POST', '/api/v1/caregiver/train-ai', {
      category: activeCategory,
      text: inputText.trim(),
      source: 'Rina (Daughter)',
    });
    setInputText('');
  };

  const removeFact = (category, id) => {
    removeAiKnowledgeFact(category, id);
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
