import VoiceAgentCard from '../components/VoiceAgentCard';
import DailyRoutineDashboard from '../components/DailyRoutineDashboard';
import BrainActivity from '../components/BrainActivity';
import Progress from '../components/Progress';
import SafetyStatus from '../components/SafetyStatus';
import CareCircleWidget from '../components/CareCircle';
import MemoryBook from '../components/MemoryBook';
import BottomStatus from '../components/BottomStatus';
import HomeChat from '../components/HomeChat';

function UserDashboard() {
  return (
    <div className="granth-home">
      <div className="dashboard">
        <div className="top-grid">
          <VoiceAgentCard />
          <DailyRoutineDashboard />
        </div>

        <div className="middle-grid">
          <BrainActivity />
          <Progress />
        </div>

        <div className="bottom-grid">
          <SafetyStatus />
          <CareCircleWidget />
          <MemoryBook />
        </div>

        <BottomStatus />
        <HomeChat />
      </div>
    </div>
  );
}

export default UserDashboard;
