import { useMemo, useState } from 'react';
import { Landmark, Phone, ExternalLink, UserRound, MapPin } from 'lucide-react';
import { SCHEMES } from '../data/schemes';
import { useI18n } from '../I18nContext';
import './Schemes.css';

export default function SchemesPage() {
  const { t } = useI18n();
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SCHEMES;
    return SCHEMES.filter((row) => {
      const blob = [row.name, row.forWhom, row.benefit, row.state, row.helpline, row.applyHow]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return blob.includes(needle);
    });
  }, [q]);

  return (
    <div className="ss-schemes-page">
      <header className="ss-schemes-head">
        <p className="ss-schemes-kicker"><Landmark size={16} /> {t('nav.schemes')}</p>
        <h1>Government help for elders</h1>
        <p>
          These are public Indian schemes and helplines for elderly people and dementia care.
          Amounts and rules change — confirm on the official page or at the local office. This app does not file claims.
        </p>
        <label className="ss-schemes-search">
          <span>Find a scheme</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ayushman, pension, Elderline…"
            autoComplete="off"
          />
        </label>
      </header>

      <div className="ss-schemes-grid">
        {list.map((scheme) => (
          <article key={scheme.id} id={`service-${scheme.id}`} className="ss-scheme-card">
            <p className="ss-scheme-state">{scheme.state}</p>
            <h2>{scheme.name}</h2>
            <p className="ss-scheme-benefit">{scheme.benefit}</p>
            <dl>
              <div>
                <dt><UserRound size={14} /> Who it is for</dt>
                <dd>{scheme.forWhom || scheme.eligibility}</dd>
              </div>
              <div>
                <dt><MapPin size={14} /> How to apply</dt>
                <dd>{scheme.applyHow}</dd>
              </div>
              {scheme.helpline ? (
                <div>
                  <dt><Phone size={14} /> Helpline</dt>
                  <dd>
                    <a href={`tel:${String(scheme.helpline).replace(/[^\d]/g, '').slice(0, 11)}`}>{scheme.helpline}</a>
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="ss-scheme-actions">
              {scheme.link ? (
                <a className="ss-scheme-link" href={scheme.link} target="_blank" rel="noreferrer">
                  Official page <ExternalLink size={14} />
                </a>
              ) : null}
              {(scheme.extraLinks || []).map((row: { label: string; href: string }) => (
                <a key={row.href} className="ss-scheme-link is-quiet" href={row.href} target="_blank" rel="noreferrer">
                  {row.label} <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
      {list.length === 0 ? <p className="ss-schemes-empty">No scheme matches that search. Try “pension” or “Ayushman”.</p> : null}
      <p className="ss-schemes-foot">Source: official portals listed on each card. Daily medicines stay on My Day — this page is only government help.</p>
    </div>
  );
}
