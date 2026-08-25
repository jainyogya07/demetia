import { ChevronRight, CheckCircle } from 'lucide-react';
import { useI18n } from '../I18nContext';

function NextSteps({ steps = [], onViewAll, onStepClick }) {
  const { t } = useI18n();

  return (
    <div className="next-steps">
      <div className="section-heading">
        <div>
          <p className="section-label">{t('dash.actionsLabel')}</p>
          <h3>{t('dash.nextSteps')}</h3>
        </div>

        <button type="button" className="view-all-button" onClick={onViewAll}>
          {t('dash.viewAll')}
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="steps-list">
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <button
              type="button"
              className="step-item"
              key={step.id ?? index}
              onClick={() => onStepClick?.(step)}
            >
              <div className="step-icon">
                <CheckCircle size={18} />
              </div>

              <div className="step-content">
                <h4>{t(step.titleKey)}</h4>
                <p>{t(step.descKey)}</p>
              </div>

              {step.statusKey && (
                <div className="step-status">
                  {t(step.statusKey)}
                </div>
              )}
            </button>
          ))
        ) : (
          <p className="no-steps">
            {t('dash.noSteps')}
          </p>
        )}
      </div>
    </div>
  );
}

export default NextSteps;
