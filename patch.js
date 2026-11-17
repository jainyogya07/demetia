const fs = require('fs');
const path = 'src/components/SaarthiRadialMenu.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const endDrag = \(e\) => \{[\s\S]*?toggleOpen\(\);\n  \};/,
  `const endDrag = (e) => {
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
  };`
);

code = code.replace(
  /onPointerCancel=\{endDrag\}/,
  `onPointerCancel={endDrag}\n            onClick={handleClick}`
);

fs.writeFileSync(path, code);
