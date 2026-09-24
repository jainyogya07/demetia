import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Morning Medication (Donepezil 5mg)", time: "09:00 AM", completed: true },
    { id: 2, title: "Hydration & Afternoon Herbal Tea", time: "02:00 PM", completed: false },
    { id: 3, title: "Evening Memory Card Exercise", time: "06:30 PM", completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Priority 1: Greeting & Quick Safety Action */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Caregiver & Patient Hub
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Welcome Back</h1>
            <p className="text-sm text-slate-500">Cognitive status is stable. No wander/disorientation alerts triggered.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => alert("SOS Alert broadcasted to primary caregiver.")}
              className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-2xl shadow-sm transition active:scale-95"
            >
              🚨 Emergency SOS
            </button>
            <Link
              to="/doctor"
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-2xl shadow-sm text-center transition"
            >
              Consult Doctor
            </Link>
          </div>
        </div>

        {/* Priority 2: 3 Clear Glanceable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase">Daily Routine</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Done
            </p>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase">Geo-Fence Safe Zone</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">Safe Inside Perimeter</p>
            <p className="text-xs text-slate-500 mt-1">Home Zone • GPS Live</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase">Next Doctor Check-In</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">04:30 PM</p>
            <p className="text-xs text-slate-500 mt-1">Tele-MANAS Routine Follow-up</p>
          </div>
        </div>

        {/* Priority 3: Interactive Schedule & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
              <span className="text-xs text-slate-400">Click circle to toggle</span>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    task.completed
                      ? "bg-slate-50 border-slate-200 text-slate-400 line-through"
                      : "bg-white border-slate-200 hover:border-blue-400 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                      }`}
                    >
                      {task.completed ? "✓" : ""}
                    </span>
                    <span className="font-medium text-sm">{task.title}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {task.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-lg">Memory Exercises</h3>
              <p className="text-xs text-blue-100 mt-1">Daily visual recall training session.</p>
              <button
                onClick={() => alert("Launching Memory Training Game...")}
                className="mt-5 bg-white text-blue-700 font-bold px-4 py-2 rounded-xl text-sm shadow-sm"
              >
                Start Routine
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Primary Caregiver</h4>
                <p className="text-xs text-slate-500">24/7 Dedicated Line</p>
              </div>
              <a
                href="tel:108"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Call
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}