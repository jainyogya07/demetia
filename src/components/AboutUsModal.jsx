import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import { useI18n } from '../I18nContext';
import './AboutUsModal.css';

export default function AboutUsModal({ open, onClose }) {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ss-about-overlay"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="ss-about-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ss-about-title"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: 'spring', stiffness: 360, damping: 26 }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="ss-about-close"
              onClick={onClose}
              aria-label={t('aboutUs.close')}
            >
              <X size={20} />
            </button>

            <div className="ss-about-brand">
              <img src={logoMark} alt="" className="ss-about-logo" draggable={false} />
              <div>
                <p className="ss-about-kicker">{t('aboutUs.kicker')}</p>
                <h2 id="ss-about-title">Smriti Saarthi</h2>
                <p className="ss-about-tag">{t('aboutUs.tag')}</p>
              </div>
            </div>

            <div className="ss-about-copy">
              <p>{t('aboutUs.p1')}</p>
              <p>{t('aboutUs.p2')}</p>
              <p>{t('aboutUs.p3')}</p>
            </div>

            <button type="button" className="ss-about-done" onClick={onClose}>
              {t('aboutUs.gotIt')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
