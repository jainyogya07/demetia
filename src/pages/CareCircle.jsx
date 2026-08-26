import { useEffect, useMemo, useState } from "react";
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
import { FAMILY_PHOTOS } from "../data/familyPhotos";
import { getCircleStatus, loadCheckIns, subscribeLive } from "../lib/liveState";
import "./CareCircle.css";

const PHOTO = {
  rina: FAMILY_PHOTOS.rina,
  doom: FAMILY_PHOTOS.garden,
  mina: FAMILY_PHOTOS.latveria,
};

const CareCircle = () => {
  const [, setTick] = useState(0);
  useEffect(() => subscribeLive(() => setTick((n) => n + 1)), []);
  const members = getCircleStatus();
  const lastCheck = loadCheckIns()[0];
  const available = members.filter((m) => m.available).length;
  const primary = members[0];

  const updates = useMemo(() => {
    const rows = [];
    if (lastCheck) {
      rows.push({
        title: `Check-in: ${lastCheck.place}`,
        person: "Latveria",
        time: new Date(lastCheck.at).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit" }),
        icon: <CheckCircle2 size={18} />,
      });
    }
    rows.push(
      {
        title: primary.status,
        person: primary.name,
        time: "Now",
        icon: <Heart size={18} />,
      },
      {
        title: members[1].status,
        person: members[1].name,
        time: "Today",
        icon: <Users size={18} />,
      },
    );
    return rows.slice(0, 4);
  }, [lastCheck, members, primary]);

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
            <h2>{members.length} Members</h2>
            <span>People connected to your care</span>
          </div>
        </div>

        <div className="care-overview-card">
          <div className="care-overview-icon online">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Available Now</p>
            <h2>{available} now</h2>
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
                    {PHOTO[member.id] ? (
                      <img src={PHOTO[member.id]} alt="" />
                    ) : (
                      member.name.slice(0, 2)
                    )}
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

                    <button type="button" title="Call" onClick={() => { window.location.href = `tel:${member.phone}`; }}>
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

            <h2>{primary.name}</h2>

            <p>
              {primary.relation} · Your main support contact
            </p>

            <div className="primary-status">
              <span></span>
              {primary.status}
            </div>

            <div className="primary-actions">

              <a href={`tel:${primary.phone}`}>
                <Phone size={16} />
                Call
              </a>

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
                <h3>Mina</h3>
                <p>Community Health Worker</p>
              </div>

            </div>

            <div className="health-location">
              <MapPin size={14} />
              Local Health Centre
            </div>

            <a className="contact-health-btn" href="tel:9876500002">
              <Phone size={16} />
              Contact Health Worker
            </a>

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