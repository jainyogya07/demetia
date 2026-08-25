function Cases() {
  const cases = [
    {
      id: "CASE-1024",
      title: "Pension assistance",
      category: "Government Support",
      date: "18 Aug 2026",
      status: "In Progress",
    },
    {
      id: "CASE-1018",
      title: "Document verification",
      category: "Documents",
      date: "12 Aug 2026",
      status: "Resolved",
    },
    {
      id: "CASE-1009",
      title: "Service payment issue",
      category: "Payments",
      date: "05 Aug 2026",
      status: "Under Review",
    },
  ];

  return (
    <div className="cases-page">

      <div className="cases-header">
        <div>
          <span className="section-label">
            SUPPORT
          </span>

          <h2>Cases & Disputes</h2>

          <p>
            Track your support cases, raise concerns,
            and get help resolving disputes.
          </p>
        </div>

        <button className="new-case-button">
          + Open a New Case
        </button>
      </div>

      {/* SUMMARY */}
      <div className="cases-summary">

        <div className="case-summary-card">
          <span>ACTIVE CASES</span>
          <strong>2</strong>
        </div>

        <div className="case-summary-card">
          <span>RESOLVED</span>
          <strong>1</strong>
        </div>

        <div className="case-summary-card">
          <span>TOTAL CASES</span>
          <strong>3</strong>
        </div>

      </div>

      {/* CASE LIST */}
      <div className="cases-card">

        <div className="cases-card-header">
          <h3>Your Cases</h3>

          <button className="filter-button">
            Filter ▾
          </button>
        </div>

        <div className="case-list">

          {cases.map((caseItem) => (
            <div
              className="case-row"
              key={caseItem.id}
            >

              <div className="case-main">

                <div className="case-icon">
                  ⚖
                </div>

                <div>
                  <h4>{caseItem.title}</h4>

                  <p>
                    {caseItem.id} · {caseItem.category}
                  </p>
                </div>

              </div>

              <div className="case-date">
                {caseItem.date}
              </div>

              <div
                className={`case-status ${
                  caseItem.status === "Resolved"
                    ? "resolved"
                    : ""
                }`}
              >
                {caseItem.status}
              </div>

              <button className="case-view-button">
                View →
              </button>

            </div>
          ))}

        </div>

      </div>

      {/* HELP */}
      <div className="cases-help-card">

        <div className="cases-help-icon">
          ?
        </div>

        <div>
          <h3>Need help with a dispute?</h3>

          <p>
            Saheli can help you understand your options
            and guide you through the next steps.
          </p>
        </div>

        <button>
          Talk to Saheli →
        </button>

      </div>

    </div>
  );
}

export default Cases;