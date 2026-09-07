import React, { useState } from "react";
import { doctorsData } from "../data/doctordata";

export default function Doctor() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const specialties = ["All", "Neurologist", "Geriatric", "Neuropsychologist"];

  const filteredDoctors = doctorsData.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialization.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleOpenBooking = (doctor) => {
    setActiveDoctor(doctor);
    setSelectedDay("Today");
    setSelectedSlot(doctor.slots["Today"]?.[0] || doctor.slots["Tomorrow"]?.[0] || "");
    setBookingConfirmed(false);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    setBookingConfirmed(true);
    setTimeout(() => {
      setActiveDoctor(null);
      setBookingConfirmed(false);
      alert(`Appointment confirmed with ${activeDoctor.name} for ${selectedDay} at ${selectedSlot}!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Medical Directory & Consultations</h1>
            <p className="text-sm text-slate-500 mt-1">Verified neurologists and memory care specialists available for immediate consult</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live On-Call Support
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  selectedSpecialty === spec
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="flex gap-4 items-center md:items-start">
                <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover border" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                    <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">Verified</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{doc.specialization}</p>
                  <p className="text-xs text-slate-400">{doc.hospital} • {doc.experienceYears} Years Experience</p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="text-amber-500 font-bold">★ {doc.rating} <span className="text-slate-400 font-normal">({doc.reviewCount})</span></span>
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">{doc.availability}</span>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Consultation Fee</span>
                  <span className="text-lg font-bold text-slate-900">{doc.fee}</span>
                </div>
                <button
                  onClick={() => handleOpenBooking(doc)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {activeDoctor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-slate-900">Schedule Consultation</h2>
              <button onClick={() => setActiveDoctor(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <img src={activeDoctor.image} alt={activeDoctor.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{activeDoctor.name}</h4>
                <p className="text-xs text-slate-500">{activeDoctor.specialization}</p>
              </div>
            </div>

            {/* Day Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Day</label>
              <div className="grid grid-cols-2 gap-2">
                {["Today", "Tomorrow"].map((day) => (
                  <button
                    key={day}
                    onClick={() => { setSelectedDay(day); setSelectedSlot(activeDoctor.slots[day]?.[0] || ""); }}
                    className={`py-2 rounded-xl border text-sm font-medium transition ${
                      selectedDay === day ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Slot Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Slots</label>
              <div className="grid grid-cols-3 gap-2">
                {activeDoctor.slots[selectedDay]?.length > 0 ? (
                  activeDoctor.slots[selectedDay].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium border transition ${
                        selectedSlot === slot ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 col-span-3 py-2 text-center">No open slots on this day.</span>
                )}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedSlot || bookingConfirmed}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                bookingConfirmed ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {bookingConfirmed ? "✓ Booking Slot..." : `Confirm for ${selectedSlot || "Select Slot"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}