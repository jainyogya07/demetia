import { ShieldCheck, MapPin, Clock } from "lucide-react";

function SafetyStatus() {
  return (
    <div className="safety-status-card">
      <div className="section-title">
        <div className="title-icon">
          <ShieldCheck size={20} />
        </div>
        <h2>Safety Status</h2>
      </div>

      <div className="safety-content">
        <div className="safety-item">
          <MapPin size={18} />
          <div>
            <span className="safety-label">Safe Zone</span>
            <strong>Home</strong>
          </div>
        </div>

        <div className="safety-item">
          <Clock size={18} />
          <div>
            <span className="safety-label">Last Check-in</span>
            <strong>20 min ago</strong>
          </div>
        </div>

        <div className="safety-good">
          <span className="status-dot"></span>
          <span>All Good</span>
        </div>
      </div>
    </div>
  );
}

export default SafetyStatus;