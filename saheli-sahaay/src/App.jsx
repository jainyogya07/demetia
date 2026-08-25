import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import AICompanion from "./pages/AICompanion";
import Services from "./pages/Services";
import Cases from "./pages/Cases";
import Documents from "./pages/Documents";
import Community from "./pages/Community";
import Work from "./pages/Work";
import Tickets from "./pages/Tickets";
import Orders from "./pages/Orders";
import VoiceAssistant from "./pages/VoiceAssistant";
import ChatAssistant from "./pages/ChatAssistant";
import SupportCredits from "./components/SupportCredits";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<Dashboard />} />

          <Route
            path="/ai-companion"
            element={<AICompanion />}
          />

          <Route
            path="/voice-assistant"
            element={<VoiceAssistant />}
          />

          <Route
            path="/chat-assistant"
            element={<ChatAssistant />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/cases"
            element={<Cases />}
          />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/community"
            element={<Community />}
          />

          <Route
            path="/work"
            element={<Work />}
          />

          <Route
            path="/tickets"
            element={<Tickets />}
          />


          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/support-credits"
            element={<SupportCredits />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;