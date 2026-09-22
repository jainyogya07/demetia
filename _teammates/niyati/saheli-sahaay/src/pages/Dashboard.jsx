import WelcomeHeader from "../components/WelcomeHeader";
import VoiceAgentCard from "../components/VoiceAgentCard";
import NextSteps from "../components/NextSteps";
import { user } from "../data/user";
import { dashboardData } from "../data/dashboard";

function Dashboard() {
  return (
    <div className="dashboard">

      <WelcomeHeader name={user.name} />

      <div className="dashboard-grid">

        {/* LEFT SIDE */}
        <div className="dashboard-main">

          {/* EMPTY UPPER AREA - NEW CONTENT WILL COME HERE */}
          <div className="dashboard-empty-space"></div>

          {/* YOUR ACTIONS / NEXT STEPS - MOVED DOWN */}
          <NextSteps
            steps={dashboardData.nextSteps}
          />

        </div>

        {/* RIGHT SIDE */}
        <VoiceAgentCard />

      </div>

    </div>
  );
}

export default Dashboard;