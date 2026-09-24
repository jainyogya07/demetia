function WelcomeHeader({ name }) {
  return (
    <section className="welcome-header">
      <div>
        <p className="welcome-label">YOUR SUPPORT DASHBOARD</p>

        <h2>
          Good morning, {name} 🌿
        </h2>

        <p className="welcome-description">
          Here is your personalized support overview for today.
        </p>
      </div>
    </section>
  );
}

export default WelcomeHeader;