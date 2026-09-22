import { Users, Phone, CheckCircle } from "lucide-react";

function CareCircle() {
  const members = [
    {
      name: "ABC",
      relation: "Daughter",
      status: "Available",
      initials: "R",
    },
    {
      name: "XYZ",
      relation: "Son",
      status: "Last seen 2h ago",
      initials: "A",
    },
    {
      name: "ASHA Worker",
      relation: "Community Health Worker",
      status: "Visit tomorrow",
      initials: "AW",
    },
  ];

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
          <div className="care-member" key={member.name}>
            <div className="member-avatar">
              {member.initials}
            </div>

            <div className="member-info">
              <strong>{member.name}</strong>
              <span>{member.relation}</span>
            </div>

            <div className="member-status">
              <span>{member.status}</span>
              {member.status === "Available" && (
                <CheckCircle size={16} />
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="view-members-btn">
        <Phone size={16} />
        View All Members
      </button>
    </div>
  );
}

export default CareCircle;