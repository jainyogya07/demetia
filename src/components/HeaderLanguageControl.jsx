import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Globe, MapPin } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { useLanguage } from '../context/LanguageContext';
import { markLangManual } from '../i18n';

/**
 * Visible header language control with nearby region detect.
 */
export default function HeaderLanguageControl() {
  const { lang, language, languages, setLang, t } = useI18n();
  const { detectedRegion, enableAutomaticLanguage, locationLoading } = useLanguage();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 16 });
  const [regionNote, setRegionNote] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (event.target.closest?.('.ss-header-lang-menu')) return;
      setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !rootRef.current) return undefined;
    const place = () => {
      const rect = rootRef.current.getBoundingClientRect();
      setMenuPos({
        top: Math.min(rect.bottom + 8, window.innerHeight - 120),
        right: Math.max(8, window.innerWidth - rect.right),
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  const handleDetectRegion = async () => {
    setRegionNote('');
    const found = await enableAutomaticLanguage();
    if (found?.lang) {
      setRegionNote(found.region ? `Using ${found.region}` : 'Language updated from your region');
    } else {
      setRegionNote('Could not detect region. Stay on the current language.');
    }
  };

  const menu = open
    ? createPortal(
      <ul
        className="lang-switcher-menu lang-switcher-menu-portal ss-header-lang-menu"
        role="listbox"
        aria-label={t('chrome.language')}
        style={{ top: menuPos.top, right: menuPos.right, zIndex: 10050, position: 'fixed' }}
      >
        {languages.map((item) => (
          <li key={item.code}>
            <button
              type="button"
              role="option"
              aria-selected={item.code === lang}
              className={item.code === lang ? 'active' : ''}
              onClick={() => {
                markLangManual();
                setLang(item.code);
                setOpen(false);
              }}
            >
              <span className="lang-native">{item.nativeLabel}</span>
              <span className="lang-en">{item.englishName}</span>
            </button>
          </li>
        ))}
      </ul>,
      document.body,
    )
    : null;

  return (
    <div className="ss-header-lang" ref={rootRef}>
      <button
        type="button"
        className="ss-header-lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('chrome.language')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Globe size={16} />
        <span className="ss-header-lang-label">{language?.nativeLabel || lang}</span>
        <ChevronDown size={14} />
      </button>
      <button
        type="button"
        className="ss-header-region-btn"
        disabled={locationLoading}
        title={regionNote || detectedRegion || t('chrome.detectRegion')}
        aria-label={t('chrome.detectRegion')}
        onClick={handleDetectRegion}
      >
        <MapPin size={15} />
        <span className="ss-header-region-label">
          {locationLoading ? t('chrome.detectingRegion') : t('chrome.detectRegion')}
        </span>
      </button>
      {menu}
    </div>
  );
}
