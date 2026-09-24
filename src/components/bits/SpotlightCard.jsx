import { useRef } from 'react';
import './SpotlightCard.css';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(23, 107, 88, 0.16)',
}) {
  const divRef = useRef(null);

  const handleMouseMove = (event) => {
    const node = divRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    node.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`.trim()}>
      {children}
    </div>
  );
}
