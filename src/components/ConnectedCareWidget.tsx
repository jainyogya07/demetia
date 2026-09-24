import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAppNav } from '../AppNavContext';
import { useI18n } from '../I18nContext';
import './ConnectedCareWidget.css';

function ConnectedCareWidget() {
  const { openModule } = useAppNav();
  const { t } = useI18n();

  return (
    <div className="connected-care-widget">
      <div className="connected-care-header">
        <div className="connected-care-title">{t('connectedCare.title')}</div>
        <div className="connected-care-subtitle">{t('connectedCare.subtitle')}</div>
      </div>

      <div className="connected-care-pipeline">
        <div className="cc-node">
          <div className="cc-avatar patient-avatar">
            <span>{t('connectedCare.you')}</span>
          </div>
          <div className="cc-label">
            <strong>{t('connectedCare.you')}</strong>
            <span>{t('connectedCare.patient')}</span>
          </div>
        </div>

        <div className="cc-line">
          <div className="cc-line-dot"></div>
        </div>

        <div className="cc-node">
          <div className="cc-avatar caregiver-avatar">
            <span>A</span>
          </div>
          <div className="cc-label">
            <strong>Anita</strong>
            <span>{t('connectedCare.caregiver')}</span>
          </div>
        </div>

        <div className="cc-line">
          <div className="cc-line-dot"></div>
        </div>

        <div className="cc-node">
          <div className="cc-avatar doctor-avatar">
            <span>D</span>
          </div>
          <div className="cc-label">
            <strong>Dr. Mehta</strong>
            <span>{t('connectedCare.doctor')}</span>
          </div>
        </div>
      </div>

      <div className="connected-care-action">
        <button
          type="button"
          className="cc-message-btn"
          onClick={() => openModule('care-circle')}
        >
          <MessageSquare size={18} />
          {t('connectedCare.message')}
        </button>
      </div>
    </div>
  );
}

export default ConnectedCareWidget;
