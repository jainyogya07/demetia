import "./Footer.css";
import { Heart, ShieldCheck, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h3>Smriti Saarthi</h3>
          <p>
            Your caring companion for memory, health,
            safety and everyday support.
          </p>
        </div>

        <div className="footer-links">
          <button>Privacy & Safety</button>
          <button>Help & Support</button>
          <button>Emergency Information</button>
        </div>

        <div className="footer-support">
          <ShieldCheck size={18} />
          <span>Safe & Secure</span>

          <Heart size={18} />
          <span>Made with care</span>

          <Phone size={18} />
          <span>24/7 Support</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Smriti Saarthi. All rights reserved.</span>

        <span>
          Designed with care for elderly dementia patients
        </span>
      </div>
    </footer>
  );
}

export default Footer;