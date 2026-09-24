import { Heart, ShieldCheck, Phone } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import { useAppNav } from '../AppNavContext';
import './Footer.css';

/** Granth footer layout (brand + links + support) plus in-app jumps and 112. Single instance in the patient workspace. */
function Footer() {
  const { openModule, openEmergency } = useAppNav();

  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logoMark} alt="" className="footer-brand-logo" />
          <div>
            <h3>Smriti Saarthi</h3>
            <p>
              Your caring companion for memory, health,
              safety and everyday support.
            </p>
          </div>
        </div>

        <div className="footer-links">
          <button type="button" onClick={() => openModule('settings')}>Privacy &amp; Safety</button>
          <button type="button" onClick={() => openModule('help')}>Help &amp; Support</button>
          <button type="button" onClick={() => openEmergency()}>Emergency Information</button>
          <button type="button" onClick={() => openModule('routine')}>Daily routine</button>
          <button type="button" onClick={() => openModule('memory-book')}>Memory Book</button>
          <a className="footer-tel" href="tel:112">Call 112</a>
        </div>

        <div className="footer-support">
          <ShieldCheck size={18} />
          <span>Safe &amp; Secure</span>
          <Heart size={18} />
          <span>Made with care</span>
          <Phone size={18} />
          <span>24/7 Support</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Smriti Saarthi. All rights reserved.</span>
        <span>Designed with care for older people living with dementia</span>
      </div>
    </footer>
  );
}

export default Footer;
