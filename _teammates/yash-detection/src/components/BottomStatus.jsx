import {
  Wifi,
  Cloud,
  Mic,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAppNav } from "../AppNavContext";

function BottomStatus() {
  const { openModule, openEmergency } = useAppNav();

  return (
    <div className="bottom-status">
      <div className="status-group">

        <div className="bottom-status-item">
          <Wifi size={16} />
          <div>
            <span>Connection</span>
            <strong>Online</strong>
          </div>
        </div>

        <div className="bottom-status-item">
          <Cloud size={16} />
          <div>
            <span>Data</span>
            <strong>Saved securely</strong>
          </div>
        </div>

        <div className="bottom-status-item">
          <RefreshCw size={16} />
          <div>
            <span>Last Sync</span>
            <strong>Just now</strong>
          </div>
        </div>

      </div>

      <div className="status-group status-right">

        <button type="button" className="bottom-status-item" onClick={() => openModule("ai")}>
          <Mic size={16} />
          <div>
            <span>Care Agent</span>
            <strong>Ready to listen</strong>
          </div>
        </button>

        <button type="button" className="bottom-status-item emergency-status" onClick={openEmergency}>
          <ShieldCheck size={16} />
          <strong>Emergency Help Available</strong>
        </button>

      </div>
    </div>
  );
}

export default BottomStatus;