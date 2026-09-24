import {
  HandHeart,
  CircleHelp,
  Plus,
  ArrowRight,
  FileText,
  Scale,
  GraduationCap,
  BriefcaseBusiness,
  Users,
} from "lucide-react";

function SupportCredits({ credits = 120 }) {
  const totalCredits = 150;
  const percentage = Math.round((credits / totalCredits) * 100);

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
      <div className="support-page-header">
        <div>
          <h1>Support Credits</h1>
          <p>
            Use your available credits to access helpful services and support.
          </p>
        </div>

        <button className="how-credits-work">
          <CircleHelp size={19} />
          How credits work
        </button>
      </div>

      {/* CREDIT OVERVIEW CARD */}
      <div className="credits-overview-card">

        {/* LEFT SIDE */}
        <div className="credits-summary">
          <div className="credits-main-icon">
            <HandHeart size={48} />
          </div>

          <div className="credits-text">
            <p className="sponsor-text">Sponsored by NGO Partner</p>

            <div className="credits-number">
              {credits}
            </div>

            <p className="credits-label">
              Support credits available
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="credits-progress-section">

          <div className="credits-progress-top">
            <span>Available credits</span>

            <strong>
              <span className="available-number">{credits}</span>
              {" / "}
              {totalCredits}
            </strong>
          </div>

          <div className="credit-progress">
            <div
              className="credit-progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p className="usage-text">
            {percentage}% used
          </p>

        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="credits-actions">

        <button className="credit-topup-button">
          <Plus size={20} />
          Top up Credits
        </button>

        <button className="credit-services-button">
          <span>Browse Services</span>
          <ArrowRight size={21} />
        </button>

      </div>

      {/* SERVICES HEADER */}
      <div className="services-section-header">

        <div>
          <p className="section-label">USE CREDITS FOR</p>
          <h2>Support services available to you</h2>
        </div>

        <button className="view-services-button">
          View all services
          <ArrowRight size={20} />
        </button>

      </div>

      {/* SERVICES GRID */}
      <div className="services-grid">

        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <button
              className={`service-card ${
                service.fullWidth ? "full-width-service" : ""
              }`}
              key={index}
            >

              <div className="service-card-left">

                <div className="service-icon">
                  <Icon size={34} />
                </div>

                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

              </div>

              <ArrowRight className="service-arrow" size={24} />

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default SupportCredits;