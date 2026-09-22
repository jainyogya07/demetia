import {
  Users,
  UserPlus,
  Phone,
  MessageCircle,
  ShieldCheck,
  Heart,
  MapPin,
  Clock3,
  MoreVertical,
  CheckCircle2,
  Bell,
  Stethoscope,
} from "lucide-react";

import "./CareCircle.css";

const CareCircle = () => {
  const members = [
    {
      name: "Anita Sharma",
      relation: "Daughter",
      role: "Primary Caregiver",
      status: "Online",
      location: "Guwahati",
      initials: "AS",
      type: "primary",
    },
    {
      name: "Rajesh Sharma",
      relation: "Son",
      role: "Family Member",
      status: "Available",
      location: "Shillong",
      initials: "RS",
      type: "family",
    },
    {
      name: "Maya Devi",
      relation: "Community Health Worker",
      role: "Health Support",
      status: "Available",
      location: "Local Health Centre",
      initials: "MD",
      type: "health",
    },
  ];

  const updates = [
    {
      title: "Morning medicine completed",
      person: "Anita Sharma",
      time: "Today, 7:42 AM",
      icon: <CheckCircle2 size={18} />,
    },
    {
      title: "Memory activity completed",
      person: "Anita Sharma",
      time: "Today, 11:18 AM",
      icon: <Heart size={18} />,
    },
    {
      title: "Caregiver checked today's routine",
      person: "Rajesh Sharma",
      time: "Today, 12:05 PM",
      icon: <Users size={18} />,
    },
  ];

  return (
    <div className="care-circle-page">

      {/* HEADER */}
      <div className="care-circle-header">
        <div>
          <div className="care-circle-label">
            <Users size={15} />
            FAMILY & CARE SUPPORT
          </div>

          <h1>My Care Circle</h1>

          <p>
            Stay connected with the people who support your everyday wellbeing.
          </p>
        </div>

        <button className="add-member-btn">
          <UserPlus size={17} />
          Add Member
        </button>
      </div>


      {/* OVERVIEW */}
      <div className="care-overview">

        <div className="care-overview-card">
          <div className="care-overview-icon">
            <Users size={22} />
          </div>

          <div>
            <p>Care Circle</p>
            <h2>3 Members</h2>
            <span>People connected to your care</span>
          </div>
        </div>

        <div className="care-overview-card">
          <div className="care-overview-icon online">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Available Now</p>
            <h2>3 Members</h2>
            <span>Ready to provide support</span>
          </div>
        </div>

        <div className="care-overview-card">
          <div className="care-overview-icon purple">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p>Safety Contact</p>
            <h2>Primary Caregiver</h2>
            <span>Emergency notifications enabled</span>
          </div>
        </div>

      </div>


      {/* MAIN GRID */}
      <div className="care-circle-grid">

        {/* LEFT */}
        <div className="care-main-column">

          {/* MEMBERS */}
          <div className="care-card members-card">

            <div className="care-card-heading">
              <div>
                <h2>People in Your Care Circle</h2>
                <p>
                  Family members and trusted health-support contacts
                </p>
              </div>

              <button className="heading-more-btn">
                <MoreVertical size={20} />
              </button>
            </div>


            <div className="members-list">

              {members.map((member, index) => (
                <div className="member-row" key={index}>

                  <div className={`member-avatar ${member.type}`}>
                    {member.initials}
                  </div>

                  <div className="member-information">

                    <div className="member-name-line">
                      <h3>{member.name}</h3>

                      {member.type === "primary" && (
                        <span className="primary-badge">
                          Primary
                        </span>
                      )}
                    </div>

                    <p>{member.relation}</p>

                    <div className="member-location">
                      <MapPin size={12} />
                      {member.location}
                    </div>

                  </div>

                  <div className="member-status">
                    <span className="status-dot"></span>
                    {member.status}
                  </div>

                  <div className="member-actions">

                    <button title="Call">
                      <Phone size={17} />
                    </button>

                    <button title="Message">
                      <MessageCircle size={17} />
                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* RECENT UPDATES */}
          <div className="care-card updates-card">

            <div className="care-card-heading">
              <div>
                <h2>Recent Care Updates</h2>
                <p>Recent activity shared with your care circle</p>
              </div>
            </div>


            <div className="updates-list">

              {updates.map((update, index) => (
                <div className="update-row" key={index}>

                  <div className="update-icon">
                    {update.icon}
                  </div>

                  <div className="update-information">
                    <h3>{update.title}</h3>

                    <p>
                      By {update.person}
                    </p>
                  </div>

                  <span className="update-time">
                    {update.time}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>


        {/* RIGHT */}
        <div className="care-side-column">

          {/* PRIMARY CAREGIVER */}
          <div className="primary-care-card">

            <div className="primary-care-top">
              <div className="primary-care-icon">
                <Heart size={22} />
              </div>

              <span>PRIMARY CAREGIVER</span>
            </div>

            <h2>Anita Sharma</h2>

            <p>
              Daughter · Your main support contact
            </p>

            <div className="primary-status">
              <span></span>
              Online now
            </div>

            <div className="primary-actions">

              <button>
                <Phone size={16} />
                Call
              </button>

              <button>
                <MessageCircle size={16} />
                Message
              </button>

            </div>

          </div>


          {/* HEALTH SUPPORT */}
          <div className="care-card health-support-card">

            <div className="care-card-heading">
              <div>
                <h2>Health Support</h2>
                <p>Trusted local support</p>
              </div>
            </div>

            <div className="health-contact">

              <div className="health-icon">
                <Stethoscope size={20} />
              </div>

              <div>
                <h3>Maya Devi</h3>
                <p>Community Health Worker</p>
              </div>

            </div>

            <div className="health-location">
              <MapPin size={14} />
              Local Health Centre
            </div>

            <button className="contact-health-btn">
              <Phone size={16} />
              Contact Health Worker
            </button>

          </div>


          {/* SHARED INFORMATION */}
          <div className="shared-card">

            <div className="shared-icon">
              <ShieldCheck size={21} />
            </div>

            <p className="shared-label">
              CARE SHARING
            </p>

            <h2>Your care circle is connected</h2>

            <p className="shared-text">
              Your selected caregivers can see important routine,
              activity and safety updates that you choose to share.
            </p>

            <div className="sharing-status">
              <CheckCircle2 size={16} />
              Activity sharing enabled
            </div>

          </div>


          {/* EMERGENCY */}
          <div className="care-emergency-card">

            <div className="emergency-icon">
              <Bell size={20} />
            </div>

            <div>
              <h3>Emergency Support</h3>

              <p>
                Your primary caregiver will be notified when an
                emergency alert is triggered.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CareCircle;