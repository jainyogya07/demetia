import { useEffect, useRef, useState } from 'react';
import { cancelFieldIds, enqueueFieldType, focusField, whenTypeQueueIdle } from '../lib/fieldTypeQueue';
import { pickSpokenField } from '../lib/sarthiAssist';
import {
  User, Accessibility, Bell, ShieldCheck, Lock, Globe, Phone, Database,
  Download, Trash2, ShieldAlert, Camera,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import VoiceToggle from '../components/VoiceToggle';
import { useI18n } from '../I18nContext';
import { usePrefs } from '../PrefsContext';
import { LANG_STORAGE_KEY } from '../i18n';
import { useAppNav } from '../AppNavContext';
import { useAuth } from '../context/AuthContext';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? 'on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

function Settings() {
  const { t, lang, languages, setLang } = useI18n();
  const { prefs, updatePrefs, resetPrefs } = usePrefs();
  const { openEmergency } = useAppNav();
  const { session, signOut, openAuth } = useAuth();
  const [profileDraft, setProfileDraft] = useState(prefs.profile);
  const [dataNote, setDataNote] = useState('');
  const photoInputRef = useRef(null);

  const [assistFill, setAssistFill] = useState(false);
  const profileDraftRef = useRef(profileDraft);
  profileDraftRef.current = profileDraft;

  const saveProfile = () => {
    updatePrefs({ profile: profileDraft });
  };

  const applySettingsFields = (fields = {}, ask) => {
    const keys = ['name', 'phone', 'state', 'district'];
    setAssistFill(true);
    let queued = 0;
    keys.forEach((key) => {
      const raw = fields[key];
      if (!raw || raw === '—') return;
      const value = pickSpokenField(raw, key);
      if (!value) return;
      if (String(profileDraftRef.current[key] || '') === String(value)) return;
      queued += 1;
      enqueueFieldType(`settings-${key}`, String(value), {
        onTick: (slice) => {
          setProfileDraft((prev) => ({ ...prev, [key]: slice }));
        },
      });
    });
    const focusId = `settings-${ask || fields._ask || 'name'}`;
    window.setTimeout(() => {
      document.getElementById('settings-profile')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!queued) focusField(focusId);
    }, 80);
    if (queued) whenTypeQueueIdle(() => focusField(focusId));
  };

  useEffect(() => () => cancelFieldIds(['settings-name', 'settings-phone', 'settings-state', 'settings-district']), []);

  useEffect(() => {
    const onControl = (event) => {
      const action = event.detail?.action;
      const fields = event.detail?.fields || event.detail?.profile || {};
      if (action === 'fill-profile' || action === 'fill' || action === 'start') {
        const clearKeys = event.detail?.clear || [];
        if (clearKeys.length) {
          cancelFieldIds(clearKeys.map((key) => `settings-${key}`));
          setProfileDraft((prev) => {
            const next = { ...prev };
            clearKeys.forEach((key) => {
              if (key === 'photo' || key === 'photoDataUrl') next.photoDataUrl = '';
              else next[key] = '';
            });
            return next;
          });
        }
        applySettingsFields(fields, event.detail?.ask);
        if (action === 'fill-profile') updatePrefs({ profile: fields });
        return;
      }
      if (action === 'save') {
        applySettingsFields(fields);
        whenTypeQueueIdle(() => {
          updatePrefs({
            profile: {
              name: fields.name === '—' ? '' : (fields.name || ''),
              phone: fields.phone === '—' ? '' : (fields.phone || ''),
              state: fields.state === '—' ? '' : (fields.state || ''),
              district: fields.district === '—' ? '' : (fields.district || ''),
            },
          });
          setAssistFill(false);
        });
      }
    };
    window.addEventListener('sarthi:settings-control', onControl);
    return () => window.removeEventListener('sarthi:settings-control', onControl);
  }, [updatePrefs]);

  const onPickPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        setProfileDraft((prev) => {
          const photoDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          updatePrefs({ profile: { photoDataUrl } });
          return { ...prev, photoDataUrl };
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const exportPrefs = () => {
    const payload = {
      language: lang,
      ...prefs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saheli-preferences.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLocal = () => {
    resetPrefs();
    try {
      localStorage.removeItem(LANG_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setLang('en');
    setProfileDraft({ name: '', phone: '', state: '', district: '', photoDataUrl: '' });
    setDataNote(t('settingsPage.deleted'));
  };

  return (
    <div className="granth-page settings-page">
      <p className="section-label">{t('settingsPage.label')}</p>
      <h2>{t('settingsPage.title')}</h2>
      <p className="granth-page-lead">{t('settingsPage.lead')}</p>
      <p className="settings-saved-hint">{t('settingsPage.savedDevice')}</p>

      <section className="settings-section">
        <div className="settings-section-head">
          <Lock size={18} />
          <div>
            <h3>Account</h3>
            <p>Optional. Sign in with name and mobile, then a 6-digit code. You can keep using the app as a guest.</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <div>
              <h4>{session?.verified ? session.name : 'Not signed in'}</h4>
              <p>{session?.verified ? `${session.phone}${session.email ? ` · ${session.email}` : ''}` : 'Create an account only if you want the profile saved.'}</p>
            </div>
            {session?.verified ? (
              <button type="button" className="ss-text-btn" onClick={signOut}>Sign out</button>
            ) : (
              <button type="button" className="ss-text-btn" onClick={() => openAuth('signup')}>Sign in</button>
            )}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <User size={18} />
          <div>
            <h3>{t('settingsPage.profileTitle')}</h3>
            <p>{t('settingsPage.profileLead')}</p>
          </div>
        </div>
        <div id="settings-profile" className={`granth-page-card settings-card${assistFill ? ' is-assist-fill' : ''}`}>
          {assistFill && <p className="mb-assist-hint">Sarthi Assist is filling this. Say name, phone, state, district.</p>}
          <div className="settings-photo-row">
            <div className="settings-photo-preview" aria-hidden="true">
              <img src={profileDraft.photoDataUrl || '/photos/default-avatar.png'} alt="" />
            </div>
            <div className="settings-photo-actions">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onPickPhoto}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => photoInputRef.current?.click()}
              >
                <Camera size={14} /> {t('settingsPage.changePhoto')}
              </button>
              {profileDraft.photoDataUrl ? (
                <button
                  type="button"
                  className="btn btn-secondary settings-photo-remove"
                  onClick={() => {
                    setProfileDraft({ ...profileDraft, photoDataUrl: '' });
                    updatePrefs({ profile: { photoDataUrl: '' } });
                  }}
                >
                  {t('settingsPage.removePhoto')}
                </button>
              ) : null}
              <p className="settings-photo-hint">{t('settingsPage.photoHint')}</p>
            </div>
          </div>
          <div className="settings-profile-grid">
          <label className="settings-field">
            <span>{t('settingsPage.name')}</span>
            <input
              id="settings-name"
              value={profileDraft.name}
              onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
            />
          </label>
          <label className="settings-field">
            <span>{t('settingsPage.phone')}</span>
            <input
              id="settings-phone"
              value={profileDraft.phone}
              onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
              inputMode="tel"
            />
          </label>
          <label className="settings-field">
            <span>{t('settingsPage.state')}</span>
            <input
              id="settings-state"
              value={profileDraft.state}
              onChange={(e) => setProfileDraft({ ...profileDraft, state: e.target.value })}
            />
          </label>
          <label className="settings-field">
            <span>{t('settingsPage.district')}</span>
            <input
              id="settings-district"
              value={profileDraft.district}
              onChange={(e) => setProfileDraft({ ...profileDraft, district: e.target.value })}
            />
          </label>
          </div>
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.preferredLang')}</h4>
              <p>{languages.find((item) => item.code === lang)?.nativeLabel}</p>
            </div>
            <LanguageSwitcher />
          </div>
          <div className="settings-row">
            <button type="button" className="btn btn-primary" onClick={saveProfile}>
              {t('settingsPage.saveProfile')}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Accessibility size={18} />
          <div>
            <h3>{t('settingsPage.accessTitle')}</h3>
            <p>{t('settingsPage.accessLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <h4>{t('settingsPage.fontSize')}</h4>
            <div className="settings-seg">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={prefs.accessibility.fontSize === size ? 'active' : ''}
                  onClick={() => updatePrefs({ accessibility: { fontSize: size } })}
                >
                  {t(`settingsPage.font${size[0].toUpperCase()}${size.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.contrast')}</h4>
              <p>{prefs.accessibility.highContrast ? t('settingsPage.contrastOn') : t('settingsPage.contrastOff')}</p>
            </div>
            <Toggle
              checked={prefs.accessibility.highContrast}
              label={t('settingsPage.contrast')}
              onChange={(highContrast) => updatePrefs({ accessibility: { highContrast } })}
            />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Globe size={18} />
          <div>
            <h3>Care Agent voice</h3>
            <p>Female or male. Switch reconnects the live call.</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <h4>Voice</h4>
            <VoiceToggle />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Bell size={18} />
          <div>
            <h3>{t('settingsPage.notifTitle')}</h3>
            <p>{t('settingsPage.notifLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          {[
            ['schemes', 'notifSchemes'],
            ['tickets', 'notifTickets'],
            ['community', 'notifCommunity'],
          ].map(([key, labelKey]) => (
            <div className="settings-row" key={key}>
              <h4>{t(`settingsPage.${labelKey}`)}</h4>
              <Toggle
                checked={prefs.notifications[key]}
                label={t(`settingsPage.${labelKey}`)}
                onChange={(value) => updatePrefs({ notifications: { [key]: value } })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <ShieldCheck size={18} />
          <div>
            <h3>{t('settingsPage.privacyTitle')}</h3>
            <p>{t('settingsPage.privacyLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          {[
            ['dataSharing', 'dataShare'],
            ['aiTranscripts', 'transcripts'],
            ['captions', 'captions'],
          ].map(([key, labelKey]) => (
            <div className="settings-row" key={key}>
              <h4>{t(`settingsPage.${labelKey}`)}</h4>
              <Toggle
                checked={prefs.privacy[key]}
                label={t(`settingsPage.${labelKey}`)}
                onChange={(value) => updatePrefs({ privacy: { [key]: value } })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Lock size={18} />
          <div>
            <h3>{t('settingsPage.securityTitle')}</h3>
            <p>{t('settingsPage.securityLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          {[
            ['password', 'password'],
            ['pin', 'pin'],
            ['twofa', 'twofa'],
          ].map(([key, labelKey]) => (
            <div className="settings-row" key={key}>
              <div>
                <h4>{t(`settingsPage.${labelKey}`)}</h4>
                <p>{t('settingsPage.comingAuth')}</p>
              </div>
              <span className="settings-row-meta">{t('settingsPage.comingAuth')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Globe size={18} />
          <div>
            <h3>{t('settingsPage.languageTitle')}</h3>
            <p>{t('settingsPage.languageLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-lang-grid">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`settings-lang-chip ${item.code === lang ? 'active' : ''}`}
                onClick={() => setLang(item.code)}
              >
                <strong>{item.nativeLabel}</strong>
                <span>{item.englishName}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Phone size={18} />
          <div>
            <h3>{t('settingsPage.helplinesTitle')}</h3>
            <p>{t('settingsPage.helplinesLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <button type="button" className="btn btn-primary" onClick={() => openEmergency?.()}>
              <ShieldAlert size={14} />
              {t('settingsPage.openHelplines')}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-head">
          <Database size={18} />
          <div>
            <h3>{t('settingsPage.dataTitle')}</h3>
            <p>{t('settingsPage.dataLead')}</p>
          </div>
        </div>
        <div className="granth-page-card settings-card">
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.exportBtn')}</h4>
              <p>{t('settingsPage.exportHint')}</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={exportPrefs}>
              <Download size={14} />
              {t('settingsPage.exportBtn')}
            </button>
          </div>
          <div className="settings-row">
            <div>
              <h4>{t('settingsPage.deleteBtn')}</h4>
              <p>{t('settingsPage.deleteHint')}</p>
            </div>
            <button type="button" className="btn btn-danger-ghost" onClick={deleteLocal}>
              <Trash2 size={14} />
              {t('settingsPage.deleteBtn')}
            </button>
          </div>
          {dataNote && <p className="settings-data-note">{dataNote}</p>}
        </div>
      </section>
    </div>
  );
}

export default Settings;
