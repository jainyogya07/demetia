import {
  HandHeart,
  FileText,
  Scale,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  ArrowRight,
  Plus,
  CircleHelp,
} from "lucide-react";

function SupportCredits() {
  const services = [
    {
      title: "Document assistance",
      description: "Get help with important documents and applications.",
      icon: FileText,
    },
    {
      title: "Legal-aid coordination",
      description: "Connect with relevant legal support services.",
      icon: Scale,
    },
    {
      title: "Skill training",
      description: "Access learning and skill development opportunities.",
      icon: GraduationCap,
    },
    {
      title: "Job assistance",
      description: "Find employment and work opportunities.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Peer mentoring",
      description: "Connect with people who can guide and support you.",
      icon: Users,
      fullWidth: true,
    },
  ];

  return (
    <div className="support-credits-page">
      {/* PAGE HEADER */}
      <div className="support-credits-header">
        <div>
          <h1>Support Credits</h1>
          <p>
            Use your available credits to access helpful services and support.
          </p>
        </div>

        <button className="how-credits-button">
          <CircleHelp size={20} />
          How credits work
        </button>
      </div>

      {/* CREDIT SUMMARY CARD */}
      <section className="credits-summary-card">
        <div className="credits-summary-left">
          <div className="credits-main-icon">
            <HandHeart size={48} strokeWidth={1.8} />
          </div>

          <div className="credits-summary-text">
            <p className="sponsored-text">Sponsored by NGO Partner</p>

            <div className="credits-number">120</div>

            <p className="credits-available-text">
              Support Credits available
            </p>
          </div>
        </div>

        <div className="credits-summary-divider"></div>

        <div className="credits-progress-section">
          <div className="credits-progress-header">
            <span>Available credits</span>

            <span className="credits-total">
              <strong>120</strong> / 150
            </span>
          </div>

          <div className="credits-progress-bar">
            <div className="credits-progress-fill"></div>
          </div>

          <p className="credits-used-text">80% used</p>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="credits-actions">
        <button className="topup-credits-button">
          <Plus size={23} />
          Top up Credits
        </button>

        <button className="browse-services-button">
          Browse Services
          <ArrowRight size={24} />
        </button>
      </div>

      {/* SERVICES HEADER */}
      <div className="services-section-header">
        <div>
          <p className="services-label">USE CREDITS FOR</p>
          <h2>Support services available to you</h2>
        </div>

        <button className="view-services-button">
          View all services
          <ArrowRight size={21} />
        </button>
      </div>

      {/* SERVICE CARDS */}
      <div className="support-services-grid">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <button
              key={service.title}
              className={`support-service-card ${
                service.fullWidth ? "full-width-service" : ""
              }`}
            >
              <div className="service-icon-box">
                <Icon size={39} strokeWidth={1.7} />
              </div>

              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <ArrowRight
                className="service-arrow"
                size={25}
                strokeWidth={1.7}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SupportCredits;