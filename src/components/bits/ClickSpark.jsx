import { useCallback, useRef } from 'react';
import './ClickSpark.css';

export default function ClickSpark({
  children,
  sparkColor = '#176b58',
  sparkCount = 10,
  sparkRadius = 18,
  duration = 420,
  className = '',
}) {
  const rootRef = useRef(null);

  const spark = useCallback((event) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < sparkCount; i += 1) {
      const bit = document.createElement('span');
      bit.className = 'ss-spark';
      const angle = (Math.PI * 2 * i) / sparkCount;
      bit.style.setProperty('--sx', `${Math.cos(angle) * sparkRadius}px`);
      bit.style.setProperty('--sy', `${Math.sin(angle) * sparkRadius}px`);
      bit.style.left = `${x}px`;
      bit.style.top = `${y}px`;
      bit.style.background = sparkColor;
      bit.style.animationDuration = `${duration}ms`;
      root.appendChild(bit);
      window.setTimeout(() => bit.remove(), duration + 40);
    }
  }, [duration, sparkColor, sparkCount, sparkRadius]);

  return (
    <div ref={rootRef} className={`ss-click-spark ${className}`.trim()} onClick={spark}>
      {children}
    </div>
  );
}
