import { Heart, ShieldCheck, Phone, BookOpen, CalendarDays, Settings, FileText } from 'lucide-react';
import logoMark from '../assets/smriti-saarthi-logo.png';
import { useAppNav } from '../AppNavContext';
import './Footer.css';

function Footer() {
  const { openModule, openEmergency } = useAppNav();

  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logoMark} alt="" className="footer-brand-logo" />
          <div>
            <p className="footer-brand-en">Smriti Saarthi</p>
            <h3 className="footer-brand-hi">स्मृति सारथी</h3>
            <p className="footer-brand-lead">Your caring companion for memory, health, safety and everyday support.</p>
          </div>
        </div>

        <div className="footer-links">
          <p className="footer-col-title">In the app</p>
          <button type="button" onClick={() => openModule('routine')}>Daily routine</button>
          <button type="button" onClick={() => openModule('memory-book')}>Memory Book</button>
          <button type="button" onClick={() => openModule('documents')}>Documents</button>
          <button type="button" onClick={() => openModule('settings')}>Settings</button>
        </div>

        <div className="footer-links">
          <p className="footer-col-title">Help</p>
          <button type="button" onClick={() => openModule('settings')}>Privacy &amp; Safety</button>
          <button type="button" onClick={() => openModule('help')}>Help &amp; Support</button>
          <button type="button" onClick={() => openEmergency()}>Emergency Information</button>
          <a className="footer-tel" href="tel:112">Call 112</a>
        </div>

        <div className="footer-support">
          <span><ShieldCheck size={18} /> Safe &amp; Secure</span>
          <span><Heart size={18} /> Made with care</span>
          <span><Phone size={18} /> 24/7 Support</span>
          <span><BookOpen size={18} /> Memory first</span>
          <span><CalendarDays size={18} /> Daily rhythm</span>
          <span><Settings size={18} /> Simple controls</span>
          <span><FileText size={18} /> Papers nearby</span>
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
