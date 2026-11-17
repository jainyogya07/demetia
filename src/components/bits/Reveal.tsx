import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function Reveal({ children, delay = 0, className = '' }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Safety fallback: ensure content is visible even if IntersectionObserver doesn't fire immediately in mobile WebViews
    const timer = setTimeout(() => setShown(true), 180 + Math.round(delay * 1000));
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
