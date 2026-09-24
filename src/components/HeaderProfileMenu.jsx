import { useEffect, useRef, useState } from 'react';
import { LogOut, Settings, UserRound, MapPin, Languages, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../I18nContext';
import { useLanguage } from '../context/LanguageContext';
import AvatarSlot from './AvatarSlot';
import './HeaderProfileMenu.css';

/**
 * Round header avatar that opens account / language / region controls.
 * @param {{ name?: string, photoUrl?: string, onOpenSettings?: () => void, onOpenAccount?: () => void }} props
 */
export default function HeaderProfileMenu({
  name = '',
  photoUrl = '',
  onOpenSettings,
  onOpenAccount,
}) {
  const { session, signOut, openAuth } = useAuth();
  const { lang, language, languages, setLang } = useI18n();
  const { detectedRegion, enableAutomaticLanguage, locationLoading, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [regionNote, setRegionNote] = useState('');
  const rootRef = useRef(null);

  const displayName = name || session?.name || 'Guest';

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
      setLangOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setLangOpen(false);
  };

  const handleDetectRegion = async () => {
    setRegionNote('');
    const found = await enableAutomaticLanguage();
    if (found?.lang) {
      setRegionNote(found.region ? `Using ${found.region}` : 'Language updated from your region');
    } else {
      setRegionNote('Could not detect region. Stay on the current language.');
    }
  };

  return (
    <div className={`ss-profile-menu${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="ss-profile-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${displayName} — account menu`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <AvatarSlot name={displayName} photoUrl={photoUrl} size={36} />
      </button>

      {open && (
        <div className="ss-profile-dropdown" role="menu">
          <div className="ss-profile-dropdown-head">
            <AvatarSlot name={displayName} photoUrl={photoUrl} size={40} />
            <div>
              <strong>{displayName}</strong>
              <span>{session?.verified ? 'Signed in' : 'Guest session'}</span>
            </div>
          </div>

          {onOpenSettings && (
            <button
              type="button"
              role="menuitem"
              className="ss-profile-item"
              onClick={() => {
                close();
                onOpenSettings();
              }}
            >
              <Settings size={16} />
              Settings
            </button>
          )}

          {session?.verified ? (
            <button
              type="button"
              role="menuitem"
              className="ss-profile-item"
              onClick={() => {
                close();
                if (onOpenAccount) onOpenAccount();
                else if (onOpenSettings) onOpenSettings();
              }}
            >
              <UserRound size={16} />
              Account
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              className="ss-profile-item"
              onClick={() => {
                close();
                openAuth('signup');
              }}
            >
              <UserRound size={16} />
              Sign in
            </button>
          )}

          <div className="ss-profile-divider" />

          <button
            type="button"
            className="ss-profile-item ss-profile-lang-toggle"
            aria-expanded={langOpen}
            onClick={() => setLangOpen((prev) => !prev)}
          >
            <Languages size={16} />
            <span className="ss-profile-item-grow">
              Language
              <small>{language?.nativeLabel || lang}</small>
            </span>
            <ChevronDown size={14} className={langOpen ? 'is-flip' : ''} />
          </button>

          {langOpen && (
            <ul className="ss-profile-lang-list" role="listbox" aria-label="Language">
              {languages.map((item) => (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.code === lang}
                    className={item.code === lang ? 'is-active' : ''}
                    onClick={() => {
                      // Clears regionExplicit so language scenery applies; keep I18n t() in sync
                      setLanguage(item.code, true);
                      setLang(item.code);
                      setLangOpen(false);
                    }}
                  >
                    <span>{item.nativeLabel}</span>
                    <span>{item.englishName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            role="menuitem"
            className="ss-profile-item"
            disabled={locationLoading}
            onClick={handleDetectRegion}
          >
            <MapPin size={16} />
            <span className="ss-profile-item-grow">
              {locationLoading ? 'Detecting…' : 'Detect / use my region'}
              {(regionNote || detectedRegion) && (
                <small>{regionNote || detectedRegion}</small>
              )}
            </span>
          </button>

          {session?.verified && (
            <>
              <div className="ss-profile-divider" />
              <button
                type="button"
                role="menuitem"
                className="ss-profile-item is-danger"
                onClick={() => {
                  close();
                  signOut();
                }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
