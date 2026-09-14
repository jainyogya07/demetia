import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Tabs from "./components/Tabs";
import Guide from "./components/Guide";

import PagePlaceholder from "./components/PagePlaceholder";
import DailyRoutineDashboard from "./components/DailyRoutineDashboard";
import MemoryProgress from "./pages/MemoryProgress";
import MemoryQuiz from "./components/MemoryQuiz";

import VoiceCompanion from "./components/VoiceCompanion";
import DailyRoutine from "./pages/DailyRoutine";
import BrainActivity from "./components/BrainActivity";
import Progress from "./components/Progress";
import SafetyStatus from "./components/SafetyStatus";
import CareCircle from "./components/CareCircle";
import MemoryBook from "./components/MemoryBook";
import BottomStatus from "./components/BottomStatus";


/* =========================================
   DASHBOARD
   ========================================= */

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


/* =========================================
   APP
   ========================================= */

function App() {

  /* =========================================
     OPEN TABS
     ========================================= */

  const [openTabs, setOpenTabs] = useState([
    {
      name: "Home",
      path: "/",
    },
  ]);


  /* =========================================
     MEMORY QUIZ STATES
     ========================================= */

  const [showMemoryQuiz, setShowMemoryQuiz] = useState(false);

  const [memoryResult, setMemoryResult] = useState(null);


  /* =========================================
     HOW TO USE GUIDE
     ========================================= */

  const [showGuide, setShowGuide] = useState(() => {
    return (
      localStorage.getItem("smritiGuideCompleted") !== "true"
    );
  });


  /* =========================================
     MEMORY QUIZ - SHOW ONCE PER DAY
     ========================================= */

  useEffect(() => {

    const today = new Date().toDateString();

    const quizDate = localStorage.getItem(
      "smritiSaarthiMemoryQuizDate"
    );

    const savedResult = localStorage.getItem(
      "smritiSaarthiMemoryResult"
    );


    /* -----------------------------------------
       Load previous result
       ----------------------------------------- */

    if (savedResult) {

      try {

        setMemoryResult(
          JSON.parse(savedResult)
        );

      } catch (error) {

        console.error(
          "Could not load memory result:",
          error
        );

      }

    }


    /* -----------------------------------------
       Show quiz only after guide is completed
       ----------------------------------------- */

    if (
      quizDate !== today &&
      localStorage.getItem("smritiGuideCompleted") === "true"
    ) {

      setShowMemoryQuiz(true);

    }

  }, []);


  /* =========================================
     MEMORY QUIZ COMPLETE
     ========================================= */

  const handleMemoryQuizComplete = (result) => {

    setMemoryResult(result);

    setShowMemoryQuiz(false);

  };


  /* =========================================
     GUIDE CLOSE
     ========================================= */

  const handleGuideClose = () => {

    setShowGuide(false);

  };


  /* =========================================
     RETURN
     ========================================= */

  return (
    <>

      {/* =====================================
          HOW TO USE GUIDE
          ===================================== */}

      {showGuide && (
        <Guide
          onClose={handleGuideClose}
        />
      )}


      {/* =====================================
          MAIN APPLICATION
          ===================================== */}

      <div className="app">

        {/* SIDEBAR */}

        <Sidebar
          openTabs={openTabs}
          setOpenTabs={setOpenTabs}
        />


        {/* MAIN CONTENT */}

        <main className="main-content">

          {/* TOPBAR */}

          <Topbar />


          {/* TABS */}

          <Tabs
            openTabs={openTabs}
            setOpenTabs={setOpenTabs}
          />


          {/* CONTENT + FOOTER */}

          <div className="page-scroll-area">

            <Routes>

              {/* HOME */}

              <Route
                path="/"
                element={<Dashboard />}
              />


              {/* BRAIN GAMES */}

              <Route
                path="/brain-games"
                element={
                  <PagePlaceholder
                    title="Brain Games"
                  />
                }
              />


              {/* TALK TO SMRITI */}

              <Route
                path="/talk-to-smriti"
                element={
                  <PagePlaceholder
                    title="Talk to Smriti"
                  />
                }
              />


              {/* DAILY ROUTINE */}

              <Route
                path="/daily-routine"
                element={<DailyRoutine />}
              />


              {/* MEDICINE & HEALTH */}

              <Route
                path="/medicine-health"
                element={
                  <PagePlaceholder
                    title="Medicine & Health"
                  />
                }
              />


              {/* MEMORY PROGRESS */}

              <Route
                path="/memory-progress"
                element={<MemoryProgress />}
              />


              {/* CARE CIRCLE */}

              <Route
                path="/care-circle"
                element={
                  <PagePlaceholder
                    title="My Care Circle"
                  />
                }
              />


              {/* SAFETY & LOCATION */}

              <Route
                path="/safety-location"
                element={
                  <PagePlaceholder
                    title="Safety & Location"
                  />
                }
              />


              {/* MEMORY BOOK */}

              <Route
                path="/memory-book"
                element={
                  <PagePlaceholder
                    title="Memory Book"
                  />
                }
              />


              {/* LANGUAGE */}

              <Route
                path="/language"
                element={
                  <PagePlaceholder
                    title="Language"
                  />
                }
              />


              {/* HELP & SUPPORT */}

              <Route
                path="/help-support"
                element={
                  <PagePlaceholder
                    title="Help & Support"
                  />
                }
              />


              {/* SETTINGS */}

              <Route
                path="/settings"
                element={
                  <PagePlaceholder
                    title="Settings"
                  />
                }
              />

            </Routes>


            {/* FOOTER */}

            <Footer />

          </div>

        </main>

      </div>


      {/* =====================================
          MEMORY QUIZ MODAL
          ===================================== */}

      {showMemoryQuiz && (
        <MemoryQuiz
          onComplete={handleMemoryQuizComplete}
        />
      )}

    </>
  );
}


export default App;