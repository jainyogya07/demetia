import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Filter, Star, ShoppingCart, Eye,
  Heart, HandCoins, Landmark, Scale, GraduationCap, Briefcase,
  FileText, Home as HomeIcon, Baby, Stethoscope, Wallet, Clock, Tag, ExternalLink,
  Brain, Phone, Ear, Users,
} from 'lucide-react';
import './ServicesCredits.css';
import { useAppNav } from './AppNavContext';
import { useI18n } from './I18nContext';
import { translate } from './i18n';
import { SCHEMES, SERVICE_CATEGORIES } from './data/schemes';
import { translateScheme } from './i18n/schemeCopy';

const CATEGORY_ICONS = {
  Tag,
  Landmark,
  Scale,
  Home: HomeIcon,
  GraduationCap,
  Briefcase,
  Stethoscope,
  Baby,
  Heart,
  Brain,
  Phone,
  Ear,
  Users,
};

const CAT_LABEL_KEY = {
  all: 'services.catAll',
  pension: 'services.catPension',
  legal: 'services.catLegal',
  housing: 'services.catHousing',
  education: 'services.catEducation',
  employment: 'services.catEmployment',
  health: 'services.catHealth',
  childcare: 'services.catChildcare',
  family: 'services.catFamily',
  mental: 'services.catMental',
  elderly: 'services.catElderly',
  assistive: 'services.catAssistive',
  telehealth: 'services.catTelehealth',
  caregiver: 'services.catCaregiver',
};

const StarRating = ({ rating, unratedLabel }) => {
  if (rating == null) {
    return <span className="sc-rating-text">{unratedLabel}</span>;
  }
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="sc-star-rating">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < full ? '#F0B429' : (i === full && hasHalf ? '#F0B429' : 'none')}
          color={i < full || (i === full && hasHalf) ? '#F0B429' : '#D1D5DB'}
          strokeWidth={1.5}
        />
      ))}
      <span className="sc-rating-text">{rating}</span>
    </div>
  );
};

const ServicesCredits = () => {
  const { serviceFocus } = useAppNav();
  const { lang } = useI18n();
  // Chrome must follow selected language exactly — English dict when lang=en (never Hindi leftovers).
  const tc = (key, vars) => translate(lang === 'en' ? 'en' : lang, key, vars);
  const unratedLabel = translate('en', 'services.unrated');
  const creditAmount = (n) => (n === 0 ? tc('services.free') : translate('en', 'services.creditShort', { n }));
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [expandedService, setExpandedService] = useState(null);
  const [focusedServiceId, setFocusedServiceId] = useState(null);
  const catalogueRef = useRef(null);

  const categoryCounts = useMemo(() => {
    const counts = { all: SCHEMES.length };
    for (const scheme of SCHEMES) {
      counts[scheme.category] = (counts[scheme.category] || 0) + 1;
    }
    return counts;
  }, []);

  const categories = useMemo(() => (
    SERVICE_CATEGORIES.map((cat) => ({
      ...cat,
      icon: CATEGORY_ICONS[cat.icon] || Tag,
      label: tc(CAT_LABEL_KEY[cat.id] || 'services.catAll'),
      count: categoryCounts[cat.id] || (cat.id === 'all' ? SCHEMES.length : 0),
    }))
  ), [lang, categoryCounts]);

  useEffect(() => {
    if (!serviceFocus?.ts) return;

    const serviceId = serviceFocus.serviceId;
    if (serviceId) {
      const service = SCHEMES.find((s) => s.id === serviceId);
      if (service) {
        setActiveCategory('all');
        setSearchQuery('');
        setExpandedService(service.id);
        setFocusedServiceId(service.id);
      } else {
        setFocusedServiceId(null);
      }
    } else {
      setFocusedServiceId(null);
    }

    const timer = window.setTimeout(() => {
      const targetId = serviceId || null;
      const node = targetId
        ? document.getElementById(`service-${targetId}`)
        : catalogueRef.current;
      if (!node) return;
      const scroller = node.closest('.dashboard-scroll');
      if (!scroller) return;
      const nodeRect = node.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const nextTop =
        scroller.scrollTop +
        (nodeRect.top - scrollerRect.top) -
        scroller.clientHeight / 2 +
        nodeRect.height / 2;
      scroller.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [serviceFocus]);

  const filteredServices = SCHEMES.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const view = translateScheme(s, lang, tc);
    const q = searchQuery.toLowerCase();
    const hay = [s.name, s.description, s.subcategory, s.state, s.eligibility, view.name, view.description, view.subcategory, view.eligibility]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    if (sortBy === 'credits-low') return a.credits - b.credits;
    if (sortBy === 'credits-high') return b.credits - a.credits;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const totalCredits = 120;
  const activeLabel = categories.find((c) => c.id === activeCategory)?.label;

  return (
    <div className="sc-page">
      <div className="sc-credits-bar">
        <div className="sc-credits-bar-left">
          <div className="sc-credits-bar-icon">
            <Wallet size={20} />
          </div>
          <div className="sc-credits-bar-info">
            <span className="sc-credits-bar-label">{tc('services.balance')}</span>
            <span className="sc-credits-bar-amount">{tc('services.creditsAmount', { n: totalCredits })}</span>
          </div>
        </div>
        <div className="sc-credits-bar-right">
          <button type="button" className="btn btn-secondary btn-compact">
            <Clock size={14} /> {tc('services.history')}
          </button>
          <button type="button" className="btn btn-primary btn-compact">
            <HandCoins size={14} /> {tc('services.topUp')}
          </button>
        </div>
      </div>

      <div className="sc-layout">
        <div className="sc-category-panel">
          <h3 className="sc-panel-title">{tc('services.categories')}</h3>
          <div className="sc-category-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`sc-category-item ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon size={16} className="sc-cat-icon" />
                <span className="sc-cat-label">{cat.label}</span>
                <span className="sc-cat-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sc-catalogue" ref={catalogueRef}>
          <div className="sc-toolbar">
            <div className="sc-search-box">
              <Search size={16} className="sc-search-icon" />
              <input
                type="text"
                placeholder={tc('services.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sc-search-input"
              />
            </div>
            <div className="sc-sort-group">
              <Filter size={14} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sc-sort-select"
              >
                <option value="popular">{tc('services.sortPopular')}</option>
                <option value="credits-low">{tc('services.sortCreditsLow')}</option>
                <option value="credits-high">{tc('services.sortCreditsHigh')}</option>
                <option value="rating">{tc('services.sortRating')}</option>
              </select>
            </div>
          </div>

          <div className="sc-results-count">
            {tc('services.showing', { n: filteredServices.length })}
            {activeCategory !== 'all' && (
              <span> {tc('services.inCategory', { label: activeLabel })}</span>
            )}
          </div>

          <div className="sc-table">
            <div className="sc-table-header">
              <div className="sc-th sc-th-id">{tc('services.colId')}</div>
              <div className="sc-th sc-th-service">{tc('services.colScheme')}</div>
              <div className="sc-th sc-th-time">{tc('services.colProcessing')}</div>
              <div className="sc-th sc-th-rating">{tc('services.colRating')}</div>
              <div className="sc-th sc-th-eligibility">{tc('services.colEligibility')}</div>
              <div className="sc-th sc-th-credits">{tc('services.colCredits')}</div>
              <div className="sc-th sc-th-actions" />
            </div>

            {filteredServices.map((service) => {
              const view = translateScheme(service, lang, tc);
              return (
              <React.Fragment key={service.id}>
                <div
                  id={`service-${service.id}`}
                  className={`sc-table-row ${expandedService === service.id ? 'expanded' : ''} ${focusedServiceId === service.id ? 'focused' : ''}`}
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                >
                  <div className="sc-td sc-td-id">
                    <span className="sc-id-text">{service.id}</span>
                  </div>
                  <div className="sc-td sc-td-service">
                    <div className="sc-service-sub">{view.subcategory}{view.state ? ` · ${view.state}` : ''}</div>
                    <div className="sc-service-name">
                      {view.name}
                      {service.popular && <span className="sc-popular-badge">{tc('services.popular')}</span>}
                    </div>
                  </div>
                  <div className="sc-td sc-td-time">
                    <Clock size={13} className="sc-time-icon" />
                    {view.processingTime}
                  </div>
                  <div className="sc-td sc-td-rating">
                    <StarRating rating={service.rating} unratedLabel={unratedLabel} />
                    {service.reviews > 0 && (
                      <span className="sc-review-count">({service.reviews})</span>
                    )}
                  </div>
                  <div className="sc-td sc-td-eligibility">
                    <span className="sc-eligibility-text">{view.eligibility}</span>
                  </div>
                  <div className="sc-td sc-td-credits">
                    <span className={`sc-credit-amount ${service.credits === 0 ? 'free' : ''}`}>
                      {creditAmount(service.credits)}
                    </span>
                  </div>
                  <div className="sc-td sc-td-actions">
                    <button
                      type="button"
                      className="sc-action-btn sc-view-btn"
                      onClick={(e) => { e.stopPropagation(); setExpandedService(service.id); }}
                      title={tc('services.viewDetails')}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className={`sc-action-btn sc-apply-btn ${service.credits > totalCredits ? 'disabled' : ''}`}
                      onClick={(e) => { e.stopPropagation(); }}
                      title={service.credits === 0 ? tc('services.applyFreeTitle') : tc('services.applyTitle')}
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>

                {expandedService === service.id && (
                  <div className="sc-expanded-detail">
                    <div className="sc-detail-grid">
                      <div className="sc-detail-section">
                        <h4>{tc('services.description')}</h4>
                        <p>{view.description}</p>
                      </div>
                      <div className="sc-detail-section">
                        <h4>{tc('services.benefit')}</h4>
                        <p className="sc-benefit-text">{view.benefit}</p>
                      </div>
                      <div className="sc-detail-section">
                        <h4>{tc('services.documents')}</h4>
                        <ul className="sc-doc-list">
                          {(view.documents || []).map((doc, i) => (
                            <li key={i}>
                              <FileText size={13} /> {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="sc-detail-section">
                        <h4>{tc('services.stateScope')}</h4>
                        <p>{view.state}</p>
                        {service.link && (
                          <a
                            className="sc-official-link"
                            href={service.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={13} /> {tc('services.officialLink')}
                          </a>
                        )}
                      </div>
                      <div className="sc-detail-section sc-detail-actions">
                        <button type="button" className="btn btn-primary">
                          <ShoppingCart size={14} />
                          {service.credits === 0
                            ? tc('services.applyFree')
                            : tc('services.applyCredits', { n: service.credits })}
                        </button>
                        <button type="button" className="btn btn-secondary">
                          <Eye size={14} /> {tc('services.checkEligibility')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="sc-empty-state">
              <Search size={48} className="sc-empty-icon" />
              <h3>{tc('services.emptyTitle')}</h3>
              <p>{tc('services.emptyHint')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesCredits;
