import {
  Wifi,
  Cloud,
  Mic,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAppNav } from "../AppNavContext";
import { useLanguage } from "../context/LanguageContext";

function BottomStatus() {
  const { openModule, openEmergency } = useAppNav();
  const { t } = useLanguage();

  return (
    <div className="bottom-status">
      <div className="status-group">

        <div className="bottom-status-item">
          <Wifi size={16} />
          <div>
            <span>{t("connection")}</span>
            <strong>{t("online")}</strong>
          </div>
        </div>

        <div className="bottom-status-item">
          <Cloud size={16} />
          <div>
            <span>{t("dataLabel")}</span>
            <strong>{t("savedSecurely")}</strong>
          </div>
        </div>

        <div className="bottom-status-item">
          <RefreshCw size={16} />
          <div>
            <span>{t("lastSync")}</span>
            <strong>{t("justNow")}</strong>
          </div>
        </div>

      </div>

      <div className="status-group status-right">

        <button type="button" className="bottom-status-item" onClick={() => openModule("ai")}>
          <Mic size={16} />
          <div>
            <span>{t("talkToSmriti")}</span>
            <strong>{t("readyToListen")}</strong>
          </div>
        </button>

        <button type="button" className="bottom-status-item emergency-status" onClick={openEmergency}>
          <ShieldCheck size={16} />
          <strong>{t("emergencyAvailable")}</strong>
        </button>

      </div>
    </div>
  );
}

export default BottomStatus;
