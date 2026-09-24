// @ts-nocheck — leftover JS-shaped module; runtime unchanged
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  CalendarDays,
  BookOpen,
  Puzzle,
  MapPin,
  LineChart,
  X,
  GripHorizontal,
  Pill,
  Users,
  MessageCircleHeart,
  LifeBuoy,
  FileText,
} from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import {
  getFriendlySeverity,
  subscribeAssessmentChange,
} from '../lib/assessmentStore';
import logoMark from '../assets/smriti-saarthi-logo.png';
import './SaarthiRadialMenu.css';

const PATIENT_ID = 'aita';
const POS_KEY = 'ss-saarthi-widget-pos';
const WIDGET_SIZE = 96;
const HEADER_SAFE = 72;
const EDGE_PAD = 12;
const DRAG_THRESHOLD = 8;

/** Radii sized so 72px / 64px bubbles never collide (gap > combined radii + padding). */
const INNER_RADIUS = 150;
const OUTER_RADIUS = 250;

/**
 * Two clear rings with fixed 36° spacing and 18° ring interleave.
 * Angle 0 = east, 90 = south, 180 = west, 270 = north — fan opens upward/left for a bottom-right widget.
 */
const INNER_ITEMS = [
  { id: 'home', labelKey: 'radial.today', hint: 'Opening Today…', icon: CalendarDays, angle: 198, color: '#176B58' },
  { id: 'memory-book', labelKey: 'radial.memory', hint: 'Opening Memory…', icon: BookOpen, angle: 234, color: '#2A7C6A' },
  { id: 'games', labelKey: 'radial.games', hint: 'Opening Games…', icon: Puzzle, angle: 270, color: '#3D8B7A' },
  { id: 'safety', labelKey: 'radial.safety', hint: "You're safe", icon: MapPin, angle: 306, color: '#C18429' },
  { id: 'progress', labelKey: 'radial.progress', hint: 'Opening Progress…', icon: LineChart, angle: 342, color: '#214D42' },
];

const OUTER_ITEMS = [
  { id: 'routine', labelKey: 'radial.myDay', hint: 'Opening My Day…', icon: Pill, angle: 180, color: '#1F6F5B', action: 'module' },
  { id: 'care-circle', labelKey: 'radial.family', hint: 'Opening Family…', icon: Users, angle: 216, color: '#3A7A6C', action: 'module' },
  { id: 'ai', labelKey: 'radial.assist', hint: 'Saarthi is here…', icon: MessageCircleHeart, angle: 252, color: '#176B58', action: 'assist' },
  { id: 'help', labelKey: 'radial.help', hint: "You're not alone", icon: LifeBuoy, angle: 288, color: '#B45309', action: 'help' },
  { id: 'documents', labelKey: 'radial.papers', hint: 'Opening Papers…', icon: FileText, angle: 324, color: '#4A6B62', action: 'module' },
];

function defaultPos() {
  if (typeof window === 'undefined') return { x: 24, y: 240 };
  return {
    x: Math.max(EDGE_PAD, window.innerWidth - WIDGET_SIZE - 20),
    y: Math.max(HEADER_SAFE, window.innerHeight - WIDGET_SIZE - 110),
  };
}

function clampPos(x, y) {
  if (typeof window === 'undefined') return { x, y };
  const maxX = Math.max(EDGE_PAD, window.innerWidth - WIDGET_SIZE - EDGE_PAD);
  const maxY = Math.max(HEADER_SAFE, window.innerHeight - WIDGET_SIZE - EDGE_PAD);
  return {
    x: Math.min(maxX, Math.max(EDGE_PAD, x)),
    y: Math.min(maxY, Math.max(HEADER_SAFE, y)),
  };
}

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
      return clampPos(parsed.x, parsed.y);
    }
  } catch {
    /* ignore */
  }
  return null;
}

function savePos(pos) {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

function polar(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(rad) * radius),
    y: Math.round(Math.sin(rad) * radius),
  };
}

const STAGGER = 0.055;

export default function SaarthiRadialMenu() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState(() => loadPos() || defaultPos());
  const [severity, setSeverity] = useState(() => getFriendlySeverity(PATIENT_ID));
  const [dragging, setDragging] = useState(false);
  const [announce, setAnnounce] = useState('');
  const { openModule, openEmergency, openAssist, currentModuleId } = useAppNav();
  const menuRef = useRef<any>(null);
  const announceTimer = useRef<any>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const softAnnounce = useCallback((message) => {
    setAnnounce(message);
    if (announceTimer.current) window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(() => setAnnounce(''), 1600);
  }, []);

  useEffect(() => () => {
    if (announceTimer.current) window.clearTimeout(announceTimer.current);
  }, []);

  const refreshSeverity = useCallback((detail) => {
    if (detail?.patientId && detail.patientId !== PATIENT_ID) return;
    setSeverity(getFriendlySeverity(PATIENT_ID));
  }, []);

  useEffect(() => {
    refreshSeverity();
    return subscribeAssessmentChange(refreshSeverity);
  }, [refreshSeverity]);

  useEffect(() => {
    const onResize = () => setPos((prev) => clampPos(prev.x, prev.y));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (item) => {
    softAnnounce(item.hint || `Opening ${item.label}…`);
    const go = () => {
      if (item.action === 'help') {
        openEmergency?.();
      } else if (item.action === 'assist') {
        if (typeof openAssist === 'function') openAssist();
        else openModule('ai', { startVoice: true });
      } else {
        openModule(item.id);
      }
      setIsOpen(false);
    };
    window.setTimeout(go, reduceMotion ? 0 : 280);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      softAnnounce(next ? 'Menu open — choose gently' : 'Menu closed');
      return next;
    });
  };

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const target = e.target;
    if (target.closest?.('.radial-node')) return;

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active || d.pointerId !== e.pointerId) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    d.moved = true;
    if (isOpen) setIsOpen(false);
    setPos(clampPos(d.originX + dx, d.originY + dy));
  };

  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d.active || (e.pointerId != null && d.pointerId !== e.pointerId)) return;

    const wasMoved = d.moved;
    dragRef.current.active = false;
    setDragging(false);

    if (wasMoved) {
      setPos((prev) => {
        const next = clampPos(prev.x, prev.y);
        savePos(next);
        return next;
      });
    }
  };

  const handleClick = (e) => {
    if (dragRef.current.moved) return;
    toggleOpen();
  };

  const scoreText =
    severity.wellnessPercent != null ? `${severity.wellnessPercent}%` : '···';
  const labelText = severity.labelKey
    ? t(severity.labelKey)
    : (severity.label || t('severity.checking'));
  const stageText = severity.stageKey
    ? t(severity.stageKey)
    : (severity.stageLabel || labelText);
  const showDistinctStage =
    Boolean(severity.band) &&
    stageText &&
    stageText !== labelText;

  const springIn = reduceMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 320, damping: 18, mass: 0.9 };
  const fadeDur = reduceMotion ? 0.01 : 0.28;

  const ringVariants = {
    hidden: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.03,
        staggerDirection: -1,
      },
    },
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : STAGGER,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.12, x: 0, y: 0 },
    visible: ({ x, y }) => ({
      opacity: 1,
      scale: 1,
      x,
      y,
      transition: springIn,
    }),
  };

  const renderNode = (item, radius, ringClass) => {
    const { x, y } = polar(item.angle, radius);
    const isCurrent = item.action !== 'help' && currentModuleId === item.id;
    const Icon = item.icon;
    const label = t(item.labelKey);

    return (
      <motion.button
        key={`${ringClass}-${item.id}`}
        type="button"
        role="menuitem"
        className={`radial-node ${ringClass} ${isCurrent ? 'is-current' : ''}`}
        style={{ '--node-color': item.color }}
        custom={{ x, y }}
        variants={nodeVariants}
        whileHover={reduceMotion ? undefined : { scale: 1.1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        onClick={() => handleSelect(item)}
        aria-label={`${label}. ${item.hint}`}
        title={label}
      >
        <span className="radial-node-glow" aria-hidden="true" />
        <div className="radial-node-icon">
          <Icon size={ringClass === 'is-outer' ? 20 : 24} strokeWidth={2.25} />
        </div>
        <span className="radial-node-label">{label}</span>
      </motion.button>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="radial-backdrop"
            className="saarthi-radial-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDur }}
            onClick={() => {
              softAnnounce('Menu closed');
              setIsOpen(false);
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div
        className={`saarthi-widget ${isOpen ? 'is-open' : ''} ${dragging ? 'is-dragging' : ''} tone-${severity.tone}`}
        ref={menuRef}
        style={{ left: pos.x, top: pos.y }}
      >
        <AnimatePresence>
          {announce && (
            <motion.div
              key="soft-toast"
              className="saarthi-soft-toast"
              role="status"
              aria-live="polite"
              style={{ x: '-50%' }}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 380, damping: 24 }}
            >
              {announce}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="satellites"
              className="saarthi-radial-satellites"
              role="menu"
              aria-label="Quick navigation"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
            >
              <motion.div
                className="saarthi-orbit-ring saarthi-orbit-ring--outer"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 0.55, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: fadeDur }}
              />
              <motion.div
                className="saarthi-orbit-ring saarthi-orbit-ring--inner"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.45 }}
                animate={{ opacity: 0.72, scale: 1 }}
                exit={{ opacity: 0, scale: 0.65 }}
                transition={{ duration: fadeDur, delay: reduceMotion ? 0 : 0.05 }}
              />
              <motion.div
                className="saarthi-radial-nodes"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={ringVariants}
              >
                {INNER_ITEMS.map((item) => renderNode(item, INNER_RADIUS, 'is-inner'))}
                {OUTER_ITEMS.map((item) => renderNode(item, OUTER_RADIUS, 'is-outer'))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="saarthi-widget-spark">
          <motion.button
            type="button"
            className={`saarthi-widget-handle ${isOpen ? 'is-open' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={handleClick}
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? t('wellness.closeMenu')
                : `${t('wellness.openMenu')}. ${scoreText}, ${labelText}${showDistinctStage ? `, ${stageText}` : ''}.`
            }
            whileTap={reduceMotion || dragging ? undefined : { scale: 0.96 }}
            animate={
              reduceMotion
                ? undefined
                : isOpen
                  ? { scale: 1.04 }
                  : { scale: 1 }
            }
            transition={springIn}
          >
            <span className="widget-severity-ring" aria-hidden="true" />
            <span className="widget-drag-hint" aria-hidden="true">
              <GripHorizontal size={14} />
            </span>

            <div className="widget-core">
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="open-core"
                    className="widget-core-open"
                    initial={{ opacity: 0, scale: 0.65, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    <img
                      src={logoMark}
                      alt=""
                      className="widget-logo widget-logo--open"
                      draggable={false}
                    />
                    <X size={18} className="widget-close-badge" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed-core"
                    className="widget-core-closed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 380, damping: 24 }}
                  >
                    <img
                      src={logoMark}
                      alt=""
                      className="widget-logo"
                      draggable={false}
                    />
                    <span className="widget-score">{scoreText}</span>
                    {showDistinctStage && (
                      <span className="widget-stage">{stageText}</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="widget-caption">
              {isOpen ? t('wellness.close') : labelText}
            </span>
          </motion.button>
        </div>
      </div>
    </>
  );
}
