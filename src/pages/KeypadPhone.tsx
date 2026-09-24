import { Link } from 'react-router-dom';
import './KeypadPhone.css';

export default function KeypadPhone() {
  return (
    <div className="kp-shell">
      <header className="kp-chrome">
        <Link to="/">Smriti Saarthi</Link>
        <span>Keypad · 2G</span>
      </header>
      <iframe
        className="kp-frame"
        title="Smriti keypad"
        src="/keypad.html"
      />
    </div>
  );
}
