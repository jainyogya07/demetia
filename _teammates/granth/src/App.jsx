import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Tabs from "./components/Tabs";

import PagePlaceholder from "./components/PagePlaceholder";
import DailyRoutineDashboard from "./components/DailyRoutineDashboard";
import MemoryProgress from "./pages/MemoryProgress";

import VoiceCompanion from "./components/VoiceCompanion";
import DailyRoutine from "./pages/DailyRoutine";
import BrainActivity from "./components/BrainActivity";
import Progress from "./components/Progress";
import SafetyStatus from "./components/SafetyStatus";
import CareCircle from "./components/CareCircle";
import MemoryBook from "./components/MemoryBook";
import BottomStatus from "./components/BottomStatus";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="top-grid">
        <VoiceCompanion />
        <DailyRoutineDashboard />
      </div>

      <div className="middle-grid">
        <BrainActivity />
        <Progress />
      </div>

      <div className="bottom-grid">
        <SafetyStatus />
        <CareCircle />
        <MemoryBook />
      </div>

      <BottomStatus />
    </div>
  );
}

function App() {
  const [openTabs, setOpenTabs] = useState([
    {
      name: "Home",
      path: "/",
    },
  ]);

  return (
    <div className="app">
      <Sidebar
        openTabs={openTabs}
        setOpenTabs={setOpenTabs}
      />

      <main className="main-content">
        <Topbar />

        <Tabs
          openTabs={openTabs}
          setOpenTabs={setOpenTabs}
        />

        {/* NEW: CONTENT + FOOTER */}
        <div className="page-scroll-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/brain-games"
              element={<PagePlaceholder title="Brain Games" />}
            />

            <Route
              path="/talk-to-smriti"
              element={<PagePlaceholder title="Talk to Smriti" />}
            />

            <Route
              path="/daily-routine"
              element={<DailyRoutine />}
            />

            <Route
              path="/medicine-health"
              element={<PagePlaceholder title="Medicine & Health" />}
            />

            <Route
              path="/memory-progress"
              element={<MemoryProgress />}
            />

            <Route
              path="/care-circle"
              element={<PagePlaceholder title="My Care Circle" />}
            />

            <Route
              path="/safety-location"
              element={<PagePlaceholder title="Safety & Location" />}
            />

            <Route
              path="/memory-book"
              element={<PagePlaceholder title="Memory Book" />}
            />

            <Route
              path="/language"
              element={<PagePlaceholder title="Language" />}
            />

            <Route
              path="/help-support"
              element={<PagePlaceholder title="Help & Support" />}
            />

            <Route
              path="/settings"
              element={<PagePlaceholder title="Settings" />}
            />
          </Routes>

          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;