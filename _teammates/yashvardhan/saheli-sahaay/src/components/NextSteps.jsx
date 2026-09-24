import { ChevronRight, CheckCircle } from "lucide-react";

function NextSteps({ steps = [] }) {
  return (
    <div className="next-steps">

      <div className="section-heading">
        <div>
          <p className="section-label">YOUR ACTIONS</p>
          <h3>Next steps</h3>
        </div>

        <button className="view-all-button">
          View all
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="steps-list">
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <div className="step-item" key={index}>

              <div className="step-icon">
                <CheckCircle size={18} />
              </div>

              <div className="step-content">
                <h4>{step.title}</h4>

                <p>{step.description}</p>
              </div>

              {step.status && (
                <div className="step-status">
                  {step.status}
                </div>
              )}

            </div>
          ))
        ) : (
          <p className="no-steps">
            No pending steps right now.
          </p>
        )}
      </div>

    </div>
  );
}

export default NextSteps;