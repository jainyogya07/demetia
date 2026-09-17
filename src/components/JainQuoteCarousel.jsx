import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../I18nContext';
import './JainQuoteCarousel.css';

const QUOTE_KEYS = [
  'quotes.q1',
  'quotes.q2',
  'quotes.q3',
  'quotes.q4',
  'quotes.q5',
  'quotes.q6',
  'quotes.q7',
  'quotes.q8',
  'quotes.q9',
  'quotes.q10',
  'quotes.q11',
  'quotes.q12',
  'quotes.q13',
  'quotes.q14',
  'quotes.q15',
  'quotes.q16',
  'quotes.q17',
  'quotes.q18',
];

function JainQuoteCarousel({ compact = false }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTE_KEYS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => setIndex((prev) => (prev + 1) % QUOTE_KEYS.length);
  const prevQuote = () => setIndex((prev) => (prev - 1 + QUOTE_KEYS.length) % QUOTE_KEYS.length);

  return (
    <div className={`jain-quote-carousel${compact ? ' is-compact' : ''}`}>
      <button type="button" className="jain-quote-nav" onClick={prevQuote} aria-label={t('quotes.prev')}>
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
              <div className="jain-quote-text">"{t(QUOTE_KEYS[index])}"</div>
              <div className="jain-quote-author">— {t('quotes.author')}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button type="button" className="jain-quote-nav" onClick={nextQuote} aria-label={t('quotes.next')}>
        <ChevronRight size={compact ? 18 : 20} />
      </button>
    </div>
  );
}

export default JainQuoteCarousel;
