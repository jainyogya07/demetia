import { ShieldAlert } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import { useAppNav } from '../AppNavContext';
import './Footer.css';

function Footer() {
  const { openEmergency } = useAppNav();

  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logoMark} alt="" className="footer-brand-logo" />
          <div>
            <p className="footer-brand-en">Smriti Saarthi</p>
            <p className="footer-brand-hi">स्मृति सारथी</p>
          </div>
        </div>
        <p className="footer-message">A calm companion for every day.</p>
        <button type="button" className="footer-emergency" onClick={openEmergency}>
          <ShieldAlert size={16} aria-hidden="true" />
          Emergency help
        </button>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Smriti Saarthi. All rights reserved.</span>
        <span>Made with care for older people and families.</span>
      </div>
    </footer>
  );
}

export default Footer;
