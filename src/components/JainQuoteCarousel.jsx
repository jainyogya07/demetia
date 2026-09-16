import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import './JainQuoteCarousel.css';

const QUOTES = [
  {
    text: "Forgiveness is the fragrance that gives peace to the mind.",
    author: "Lord Mahavira"
  },
  {
    text: "A peaceful mind remembers the beautiful things.",
    author: "Lord Mahavira"
  },
  {
    text: "Silence and Self-control is non-violence.",
    author: "Lord Mahavira"
  },
  {
    text: "Soul is the central point of spiritual discipline.",
    author: "Lord Mahavira"
  }
];

function JainQuoteCarousel({ compact = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => setIndex((prev) => (prev + 1) % QUOTES.length);
  const prevQuote = () => setIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);

  return (
    <div className={`jain-quote-carousel${compact ? ' is-compact' : ''}`}>
      <button type="button" className="jain-quote-nav" onClick={prevQuote} aria-label="Previous quote">
        <ChevronLeft size={compact ? 18 : 20} />
      </button>

      <div className="jain-quote-content">
        <div className="jain-quote-icon-wrap">
          <Leaf className="jain-quote-icon" size={compact ? 16 : 20} />
        </div>
        <div className="jain-quote-text-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="jain-quote-text-box"
            >
              <div className="jain-quote-text">"{QUOTES[index].text}"</div>
              <div className="jain-quote-author">— {QUOTES[index].author}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button type="button" className="jain-quote-nav" onClick={nextQuote} aria-label="Next quote">
        <ChevronRight size={compact ? 18 : 20} />
      </button>
    </div>
  );
}

export default JainQuoteCarousel;
