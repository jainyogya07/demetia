import { Users, Phone, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppNav } from "../AppNavContext";
import { FAMILY_PHOTOS } from "../data/familyPhotos";
import { getCircleStatus, subscribeLive } from "../lib/liveState";

const PHOTO = {
  rina: FAMILY_PHOTOS.rina,
  doom: FAMILY_PHOTOS.garden,
  mina: FAMILY_PHOTOS.latveria,
};

function CareCircle() {
  const { openModule } = useAppNav();
  const [, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const members = getCircleStatus();

  return (
    <div className="care-circle-card">
      <div className="care-circle-header">
        <div className="section-title">
          <div className="title-icon">
            <Users size={20} />
          </div>
          <h2>My Care Circle</h2>
        </div>
      </div>

      <div className="care-members">
        {members.map((member) => (
          <div className="care-member" key={member.id}>
            <div className="member-avatar">
              {PHOTO[member.id] ? <img src={PHOTO[member.id]} alt="" /> : member.name.slice(0, 1)}
            </div>
            <div className="member-info">
              <strong>{member.name}</strong>
              <span>{member.relation}</span>
            </div>
            <div className="member-status">
              <span>{member.status}</span>
              {member.available && <CheckCircle size={16} />}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="view-members-btn"
        onClick={() => openModule("care-circle")}
      >
        <Phone size={16} />
        View All Members
      </button>
    </div>
  );
}

export default CareCircle;
