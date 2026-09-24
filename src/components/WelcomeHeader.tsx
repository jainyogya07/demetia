import { useI18n } from '../I18nContext';

function WelcomeHeader({ name }) {
  const { t } = useI18n();

  return (
    <section className="welcome-header">
      <div>
        <p className="welcome-label">{t('dash.welcomeLabel')}</p>
        <h2>{t('dash.greeting', { name })}</h2>
        <p className="welcome-description">{t('dash.welcomeDesc')}</p>
      </div>
    </section>
  );
}

export default WelcomeHeader;
