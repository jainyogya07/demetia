import React, { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Volume2,
  MapPin,
  Languages,
  Brain,
  Bell,
  ShieldCheck,
  Users,
  BookOpen,
  CalendarDays,
  CheckCircle,
  Heart,
  Home,
  List,
  Plus,
  Rocket,
  X,
} from "lucide-react";

import "./Guide.css";


const pages = [
  {
    id: 1,
    title: "Welcome to Smriti Saarthi",
    subtitle:
      "Your friendly companion for everyday memory support.",
    icon: Heart,
    type: "welcome",
  },

  {
    id: 2,
    title: "Your Home Dashboard",
    subtitle:
      "Everything important is available from one simple place.",
    icon: Home,
    type: "dashboard",
  },

  {
    id: 3,
    title: "Talk to Smriti",
    subtitle:
      "Speak naturally instead of typing.",
    icon: Mic,
    type: "voice",
  },

  {
    id: 4,
    title: "Your Language",
    subtitle:
      "Smriti Saarthi can help you use a familiar regional language.",
    icon: Languages,
    type: "language",
  },

  {
    id: 5,
    title: "Ask for a List",
    subtitle:
      "Just say what you want to see.",
    icon: List,
    type: "list",
  },

  {
    id: 6,
    title: "Add Things by Speaking",
    subtitle:
      "You can add reminders and appointments using your voice.",
    icon: Plus,
    type: "add",
  },

  {
    id: 7,
    title: "Memory Quiz",
    subtitle:
      "Keep your mind active with simple memory activities.",
    icon: Brain,
    type: "quiz",
  },

  {
    id: 8,
    title: "Reminders",
    subtitle:
      "Never miss an important activity.",
    icon: Bell,
    type: "reminders",
  },

  {
    id: 9,
    title: "Safety & Emergency",
    subtitle:
      "Help is always close when you need it.",
    icon: ShieldCheck,
    type: "safety",
  },

  {
    id: 10,
    title: "Care Circle",
    subtitle:
      "Stay connected with your trusted family and caregivers.",
    icon: Users,
    type: "care",
  },

  {
    id: 11,
    title: "Memory Book",
    subtitle:
      "Keep your special people and memories close.",
    icon: BookOpen,
    type: "memory",
  },

  {
    id: 12,
    title: "You're Ready!",
    subtitle:
      "You now know how Smriti Saarthi works.",
    icon: Rocket,
    type: "finish",
  },
];


function Guide({ onClose }) {
  const [currentPage, setCurrentPage] = useState(0);

  const page = pages[currentPage];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const skipGuide = () => {
    localStorage.setItem(
      "smritiGuideCompleted",
      "true"
    );

    if (onClose) {
      onClose();
    }
  };

  const finishGuide = () => {
    localStorage.setItem(
      "smritiGuideCompleted",
      "true"
    );

    if (onClose) {
      onClose();
    }
  };

  const Icon = page.icon;

  return (
    <div className="guide-page">

      {/* TOP BAR */}
      <div className="guide-topbar">

        <div className="guide-brand">

          <div className="guide-logo">
            <Heart
              size={24}
              fill="currentColor"
            />
          </div>

          <div>
            <h3>Smriti Saarthi</h3>
            <span>How to Use Guide</span>
          </div>

        </div>

        <button
          className="guide-close"
          onClick={skipGuide}
          aria-label="Close guide"
        >
          <X size={22} />
        </button>

      </div>


      {/* MAIN CONTENT */}
      <main className="guide-main">

        <div className="guide-card">

          {/* PAGE NUMBER */}
          <div className="guide-page-number">
            {currentPage + 1} / {pages.length}
          </div>


          {/* ICON */}
          <div className="guide-icon">
            <Icon
              size={42}
              strokeWidth={1.8}
            />
          </div>


          {/* TITLE */}
          <h1>{page.title}</h1>

          <p className="guide-subtitle">
            {page.subtitle}
          </p>


          {/* PAGE CONTENT */}
          <div className="guide-content">

            {page.type === "welcome" && (
              <WelcomePage />
            )}

            {page.type === "dashboard" && (
              <DashboardPage />
            )}

            {page.type === "voice" && (
              <VoicePage />
            )}

            {page.type === "language" && (
              <LanguagePage />
            )}

            {page.type === "list" && (
              <ListPage />
            )}

            {page.type === "add" && (
              <AddPage />
            )}

            {page.type === "quiz" && (
              <QuizPage />
            )}

            {page.type === "reminders" && (
              <ReminderPage />
            )}

            {page.type === "safety" && (
              <SafetyPage />
            )}

            {page.type === "care" && (
              <CarePage />
            )}

            {page.type === "memory" && (
              <MemoryPage />
            )}

            {page.type === "finish" && (
              <FinishPage onStart={finishGuide} />
            )}

          </div>


          {/* PROGRESS */}
          <div className="guide-progress">

            {pages.map((_, index) => (
              <span
                key={index}
                className={
                  index === currentPage
                    ? "progress-dot active"
                    : "progress-dot"
                }
              />
            ))}

          </div>


          {/* NAVIGATION */}
          <div className="guide-navigation">

            <button
              className="guide-back"
              onClick={previousPage}
              disabled={currentPage === 0}
            >
              <ArrowLeft size={19} />
              Back
            </button>


            {currentPage !== pages.length - 1 ? (

              <button
                className="guide-next"
                onClick={nextPage}
              >
                Next
                <ArrowRight size={19} />
              </button>

            ) : (

              <button
                className="guide-start"
                onClick={finishGuide}
              >
                <Rocket size={19} />
                Start Using Smriti Saarthi
              </button>

            )}

          </div>


          {/* SKIP */}
          {currentPage !== pages.length - 1 && (
            <button
              className="guide-skip"
              onClick={skipGuide}
            >
              Skip Guide
            </button>
          )}

        </div>

      </main>


      {/* FOOTER */}
      <footer className="guide-footer">

        <span>Smriti Saarthi</span>

        <Heart
          size={15}
          fill="currentColor"
        />

        <span>Always with you</span>

      </footer>

    </div>
  );
}

/* =========================================
   PAGE 1 - WELCOME
   ========================================= */

function WelcomePage() {
  return (
    <div className="content-box welcome-box">

      <div className="welcome-illustration">

        <div className="robot-face">

          <div className="robot-eyes">
            <span></span>
            <span></span>
          </div>

          <div className="robot-smile">
            😊
          </div>

        </div>

        <Heart
          className="floating-heart"
          size={28}
          fill="currentColor"
        />

      </div>


      <h2>Hello! 👋</h2>

      <p>
        Smriti Saarthi is designed to make everyday life
        easier, safer and more comfortable.
      </p>


      <div className="info-highlight">

        <CheckCircle size={21} />

        <span>
          Let's learn how to use it in a few simple steps.
        </span>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 2 - DASHBOARD
   ========================================= */

function DashboardPage() {
  return (
    <div className="dashboard-demo">

      <p className="demo-description">
        Your home screen gives you quick access to the
        most important parts of Smriti Saarthi.
      </p>


      <div className="dashboard-grid">

        {/* TODAY'S ROUTINE */}
        <div className="dashboard-item routine">

          <CalendarDays size={27} />

          <strong>
            Today's Routine
          </strong>

          <span>
            See your tasks
          </span>

        </div>


        {/* BRAIN ACTIVITY */}
        <div className="dashboard-item brain">

          <Brain size={27} />

          <strong>
            Brain Activity
          </strong>

          <span>
            Keep your mind active
          </span>

        </div>


        {/* MEMORY PROGRESS */}
        <div className="dashboard-item progress">

          <CheckCircle size={27} />

          <strong>
            Memory Progress
          </strong>

          <span>
            Track your growth
          </span>

        </div>


        {/* SAFETY */}
        <div className="dashboard-item safety">

          <ShieldCheck size={27} />

          <strong>
            Safety Status
          </strong>

          <span>
            Stay safe
          </span>

        </div>


        {/* CARE CIRCLE */}
        <div className="dashboard-item care">

          <Users size={27} />

          <strong>
            Care Circle
          </strong>

          <span>
            Family & caregivers
          </span>

        </div>


        {/* MEMORY BOOK */}
        <div className="dashboard-item memory">

          <BookOpen size={27} />

          <strong>
            Memory Book
          </strong>

          <span>
            Your special moments
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 3 - TALK TO SMRITI
   ========================================= */

function VoicePage() {
  return (
    <div className="voice-demo">


      {/* VOICE FLOW */}
      <div className="voice-flow">


        {/* TAP */}
        <div className="voice-step">

          <div className="voice-circle">

            <Mic size={35} />

          </div>

          <strong>
            Tap
          </strong>

        </div>


        <ArrowRight className="flow-arrow" />


        {/* SPEAK */}
        <div className="voice-step">

          <div className="voice-circle">

            <span className="speech-symbol">
              🗣️
            </span>

          </div>

          <strong>
            Speak
          </strong>

        </div>


        <ArrowRight className="flow-arrow" />


        {/* RESPONSE */}
        <div className="voice-step">

          <div className="voice-circle robot">
            🤖
          </div>

          <strong>
            Smriti responds
          </strong>

        </div>

      </div>


      {/* CONVERSATION */}
      <div className="conversation">


        {/* USER */}
        <div className="user-message">

          <span>
            👤
          </span>

          <div>
            What do I have to do today?
          </div>

        </div>


        {/* SMRITI */}
        <div className="smriti-message">

          <span>
            🤖
          </span>

          <div>
            You have a doctor appointment at 5 PM.
          </div>

        </div>


      </div>


      {/* VOICE TIP */}
      <div className="voice-tip">

        <Volume2 size={21} />

        <span>
          You can speak naturally. You don't need to use
          complicated commands.
        </span>

      </div>

    </div>
  );
}

/* =========================================
   PAGE 4 - YOUR LANGUAGE
   ========================================= */

function LanguagePage() {
  return (
    <div className="language-demo">

      <div className="language-intro">
        <Languages size={32} />
        <div>
          <strong>Use a language you're comfortable with</strong>
          <p>
            Smriti Saarthi can support English, Hindi and
            regional languages.
          </p>
        </div>
      </div>

      <div className="language-example">

        <div className="language-option selected">
          <span className="language-icon">🇮🇳</span>

          <div className="language-text">
            <strong>Hindi</strong>
            <span>हिन्दी</span>
          </div>

          <CheckCircle size={22} />
        </div>

        <div className="language-option">
          <span className="language-icon">🌐</span>

          <div className="language-text">
            <strong>English</strong>
            <span>English</span>
          </div>
        </div>

        <div className="language-option">
          <span className="language-icon">🌿</span>

          <div className="language-text">
            <strong>Regional Language</strong>
            <span>Based on your location</span>
          </div>
        </div>

      </div>

      <div className="language-tip">
        <MapPin size={21} />

        <span>
          Your location can help suggest a suitable regional
          language automatically. You can still change it manually.
        </span>
      </div>

    </div>
  );
}


/* =========================================
   PAGE 5 - ASK FOR A LIST
   ========================================= */

function ListPage() {
  return (
    <div className="list-demo">

      <p className="demo-description">
        You can ask Smriti Saarthi to show information
        without searching through menus.
      </p>

      <div className="list-flow">

        <div className="list-card user-list">

          <div className="list-card-icon">
            <Mic size={27} />
          </div>

          <div>
            <span className="list-label">You say</span>

            <strong>
              "Show my medicine list"
            </strong>
          </div>

        </div>

        <ArrowRight className="flow-arrow" />

        <div className="list-card result-list">

          <div className="list-card-icon">
            <List size={27} />
          </div>

          <div>
            <span className="list-label">Smriti shows</span>

            <strong>
              Your Medicine List
            </strong>

            <div className="mini-list">

              <span>💊 Morning Medicine</span>
              <span>💊 Afternoon Medicine</span>
              <span>💊 Night Medicine</span>

            </div>
          </div>

        </div>

      </div>

      <div className="info-highlight">

        <CheckCircle size={21} />

        <span>
          Just ask naturally. Smriti Saarthi understands
          what you want and shows the relevant information.
        </span>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 6 - ADD THINGS BY SPEAKING
   ========================================= */

function AddPage() {
  return (
    <div className="add-demo">

      <p className="demo-description">
        You can also add reminders, appointments and
        important tasks using your voice.
      </p>

      <div className="add-example">

        <div className="add-user-card">

          <div className="add-mic">
            <Mic size={30} />
          </div>

          <div>
            <span>You say</span>

            <strong>
              "Remind me to take my medicine at 8 PM."
            </strong>
          </div>

        </div>

        <ArrowRight className="flow-arrow" />

        <div className="add-result-card">

          <div className="add-check">
            <CheckCircle size={30} />
          </div>

          <div>
            <span>Reminder added</span>

            <strong>
              💊 Take medicine
            </strong>

            <small>
              Today • 8:00 PM
            </small>
          </div>

        </div>

      </div>

      <div className="add-examples">

        <div className="small-action">
          <CalendarDays size={22} />
          <span>
            "Add my doctor appointment tomorrow."
          </span>
        </div>

        <div className="small-action">
          <Bell size={22} />
          <span>
            "Remind me to call my daughter."
          </span>
        </div>

        <div className="small-action">
          <Plus size={22} />
          <span>
            "Add this to my routine."
          </span>
        </div>

      </div>

      <div className="voice-tip">

        <Volume2 size={21} />

        <span>
          You can speak in simple sentences. Smriti Saarthi
          will help turn your request into an action.
        </span>

      </div>

    </div>
  );
}

/* =========================================
   PAGE 7 - MEMORY QUIZ
   ========================================= */

function QuizPage() {
  return (
    <div className="quiz-demo">

      <p className="demo-description">
        Memory Quiz gives you simple and enjoyable activities
        to keep your mind active.
      </p>

      <div className="quiz-card">

        <div className="quiz-header">
          <div className="quiz-icon">
            <Brain size={30} />
          </div>

          <div>
            <span>Memory Quiz</span>
            <strong>Let's remember together!</strong>
          </div>
        </div>

        <div className="quiz-question">
          <span>Question</span>

          <h3>
            Which fruit did you see earlier?
          </h3>
        </div>

        <div className="quiz-options">

          <div className="quiz-option">
            🍎 Apple
          </div>

          <div className="quiz-option correct">
            🍌 Banana
            <CheckCircle size={19} />
          </div>

          <div className="quiz-option">
            🍊 Orange
          </div>

        </div>

      </div>

      <div className="quiz-tip">

        <Heart size={21} />

        <span>
          Don't worry about mistakes. The quiz is designed
          to be friendly, simple and encouraging.
        </span>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 8 - REMINDERS
   ========================================= */

function ReminderPage() {
  return (
    <div className="reminder-demo">

      <p className="demo-description">
        Smriti Saarthi can help you remember medicines,
        appointments and everyday activities.
      </p>

      <div className="reminder-list">

        <div className="reminder-item medicine">

          <div className="reminder-icon">
            <Bell size={25} />
          </div>

          <div className="reminder-details">
            <strong>Take Medicine</strong>
            <span>💊 Blood pressure medicine</span>
          </div>

          <div className="reminder-time">
            <strong>8:00 AM</strong>
            <span>Today</span>
          </div>

        </div>


        <div className="reminder-item appointment">

          <div className="reminder-icon">
            <CalendarDays size={25} />
          </div>

          <div className="reminder-details">
            <strong>Doctor Appointment</strong>
            <span>🏥 Dr. Sharma</span>
          </div>

          <div className="reminder-time">
            <strong>5:00 PM</strong>
            <span>Today</span>
          </div>

        </div>


        <div className="reminder-item family">

          <div className="reminder-icon">
            <Heart size={25} />
          </div>

          <div className="reminder-details">
            <strong>Call Family</strong>
            <span>📞 Call your daughter</span>
          </div>

          <div className="reminder-time">
            <strong>7:00 PM</strong>
            <span>Today</span>
          </div>

        </div>

      </div>

      <div className="info-highlight">

        <CheckCircle size={21} />

        <span>
          You can add reminders by speaking to Smriti
          or using the reminder section.
        </span>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 9 - SAFETY & EMERGENCY
   ========================================= */

function SafetyPage() {
  return (
    <div className="safety-demo">

      <p className="demo-description">
        Your safety is important. Smriti Saarthi keeps
        emergency help easy to access.
      </p>

      <div className="safety-main-card">

        <div className="safety-shield">
          <ShieldCheck size={42} />
        </div>

        <div className="safety-main-text">
          <strong>Safety Status</strong>

          <span>
            You are currently safe
          </span>

          <div className="safe-status">
            <CheckCircle size={17} />
            Safety monitoring active
          </div>
        </div>

      </div>


      <div className="emergency-demo">

        <div className="emergency-header">

          <div className="emergency-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <strong>Emergency Help</strong>
            <span>Help is only one tap away</span>
          </div>

        </div>


        <div className="emergency-actions">

          <div className="emergency-action">
            <span>📞</span>
            <strong>Emergency Call</strong>
          </div>

          <div className="emergency-action">
            <span>👨‍👩‍👧</span>
            <strong>Contact Care Circle</strong>
          </div>

        </div>

      </div>


      <div className="safety-tip">

        <ShieldCheck size={21} />

        <span>
          In an emergency, use the emergency option in
          Smriti Saarthi to quickly reach your trusted contacts
          or available emergency services.
        </span>

      </div>

    </div>
  );
}

/* =========================================
   PAGE 10 - CARE CIRCLE
   ========================================= */

function CarePage() {
  return (
    <div className="care-demo">

      <p className="demo-description">
        Your Care Circle connects you with trusted family
        members and caregivers.
      </p>

      <div className="care-circle-main">

        <div className="care-center">
          <div className="care-center-icon">
            <Heart size={30} fill="currentColor" />
          </div>

          <strong>You</strong>
          <span>Smriti Saarthi</span>
        </div>

        <div className="care-member member-one">
          <div className="member-avatar">👩</div>
          <strong>Daughter</strong>
          <span>Family</span>
        </div>

        <div className="care-member member-two">
          <div className="member-avatar">👨</div>
          <strong>Son</strong>
          <span>Family</span>
        </div>

        <div className="care-member member-three">
          <div className="member-avatar">👩‍⚕️</div>
          <strong>Caregiver</strong>
          <span>Trusted contact</span>
        </div>

      </div>

      <div className="care-features">

        <div className="care-feature">
          <Users size={22} />
          <span>Stay connected</span>
        </div>

        <div className="care-feature">
          <Bell size={22} />
          <span>Share important updates</span>
        </div>

        <div className="care-feature">
          <ShieldCheck size={22} />
          <span>Get help when needed</span>
        </div>

      </div>

      <div className="info-highlight">

        <Heart size={21} />

        <span>
          Your trusted people can help you stay safe and
          connected in everyday life.
        </span>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 11 - MEMORY BOOK
   ========================================= */

function MemoryPage() {
  return (
    <div className="memory-demo">

      <p className="demo-description">
        Memory Book helps you keep special people,
        places and moments close to you.
      </p>

      <div className="memory-book">

        <div className="memory-book-header">

          <div className="memory-book-icon">
            <BookOpen size={28} />
          </div>

          <div>
            <strong>My Memory Book</strong>
            <span>My special memories</span>
          </div>

        </div>


        <div className="memory-cards">

          <div className="memory-card">

            <div className="memory-picture">
              👨‍👩‍👧‍👦
            </div>

            <div className="memory-card-text">
              <strong>My Family</strong>
              <span>
                People who are special to me
              </span>
            </div>

          </div>


          <div className="memory-card">

            <div className="memory-picture">
              🏡
            </div>

            <div className="memory-card-text">
              <strong>My Home</strong>
              <span>
                A place full of memories
              </span>
            </div>

          </div>


          <div className="memory-card">

            <div className="memory-picture">
              🎉
            </div>

            <div className="memory-card-text">
              <strong>Special Moments</strong>
              <span>
                Moments I want to remember
              </span>
            </div>

          </div>

        </div>

      </div>


      <div className="memory-tip">

        <BookOpen size={21} />

        <span>
          Add photos, names and meaningful memories to
          make your Memory Book personal.
        </span>

      </div>

    </div>
  );
}


/* =========================================
   PAGE 12 - YOU'RE READY
   ========================================= */

function FinishPage({ onStart }) {
  return (
    <div className="finish-demo">

      <div className="finish-illustration">

        <div className="finish-circle">
          <CheckCircle size={58} />
        </div>

        <div className="finish-stars">
          <span>✨</span>
          <span>⭐</span>
          <span>✨</span>
        </div>

      </div>


      <h2>You're Ready! 🎉</h2>

      <p className="finish-description">
        You now know the basics of Smriti Saarthi.
        Your friendly companion is ready to help you
        every day.
      </p>


      <div className="finish-features">

        <div className="finish-feature">
          <Mic size={23} />
          <span>Talk to Smriti</span>
        </div>

        <div className="finish-feature">
          <Bell size={23} />
          <span>Manage reminders</span>
        </div>

        <div className="finish-feature">
          <Brain size={23} />
          <span>Play memory games</span>
        </div>

        <div className="finish-feature">
          <ShieldCheck size={23} />
          <span>Stay safe</span>
        </div>

      </div>


      <div className="finish-message">

        <Heart size={22} fill="currentColor" />

        <span>
          Remember: you can always open this guide again
          from the sidebar.
        </span>

      </div>


      <button
        className="finish-main-button"
        onClick={onStart}
      >
        <Rocket size={20} />
        Start Using Smriti Saarthi
      </button>

    </div>
  );
}


/* =========================================
   EXPORT GUIDE
   ========================================= */

export default Guide;