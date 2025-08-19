// src/AllRounder.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base (Vite env fallback)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AllRounder({ heading }) {
  const navigate = useNavigate();

  // which services are selected (multi-select)
  const [services, setServices] = useState({
    cook: false,
    bartan: false,
    jhaduPocha: false,
    toilet: false,
  });

  // common fields shared among services
  const [common, setCommon] = useState({
    bookingIdBase: Date.now().toString(),
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 }, // optional, kept for backend compatibility
    MonthlyOrOneTime: "Monthly",
    Months: 1,
    Date: new Date(),
    address: "",
    WhichPlan: "Standard",
  });

  // Cook-specific (mirrors Cook.jsx)
  const [cook, setCook] = useState({
    FrequencyPerDay: "Once", // Once | Twice
    Months: 1,
    IncludeNaashta: false,
    IncludeBartan: false,
    PeopleCount: 1,
    TimeSlot1: "",
    TimeSlot2: "",
  });

  // Bartan-specific
  const [bartan, setBartan] = useState({
    FrequencyPerDay: "Once", // Once | Twice
    Months: 1,
    TimeSlot1: "",
    TimeSlot2: "",
  });

  // JhaduPocha-specific (mirrors JhaduPocha.jsx)
  const [jhadu, setJhadu] = useState({
    MonthlyOrOneTime: "Monthly",
    NoOfRooms: 0,
    NoOfKitchen: 0,
    HallSize: 0,
    NoOfToilets: 0,
    AmountOfBartan: 0,
    TimeSlot: "",
  });

  // Toilet-specific (simple)
  const [toilet, setToilet] = useState({
    FrequencyPerDay: "Once",
    Months: 1,
    TimeSlot: "",
    NoOfToilets: 1,
  });

  const [submitting, setSubmitting] = useState(false);

  const toggleService = (s) => {
    setServices((prev) => ({ ...prev, [s]: !prev[s] }));
  };

  // helpers for common UI behaviour
  const minDateISO = new Date().toISOString().split("T")[0];

  // Validate service-level required fields
  function validateBeforeSubmit() {
    if (!services.cook && !services.bartan && !services.jhaduPocha && !services.toilet) {
      alert("Select at least one service.");
      return false;
    }
    // Cook
    if (services.cook) {
      if (cook.FrequencyPerDay === "Once" && !cook.TimeSlot1) {
        alert("Select time slot for Cook (first meal).");
        return false;
      }
      if (cook.FrequencyPerDay === "Twice" && (!cook.TimeSlot1 || !cook.TimeSlot2)) {
        alert("Select both time slots for Cook.");
        return false;
      }
    }
    // Bartan
    if (services.bartan) {
      if (bartan.FrequencyPerDay === "Once" && !bartan.TimeSlot1) {
        alert("Select time slot for Bartan.");
        return false;
      }
      if (bartan.FrequencyPerDay === "Twice" && (!bartan.TimeSlot1 || !bartan.TimeSlot2)) {
        alert("Select both time slots for Bartan.");
        return false;
      }
    }
    // JhaduPocha
    if (services.jhaduPocha) {
      if (!jhadu.TimeSlot) {
        alert("Select time slot for Jhadu Pocha.");
        return false;
      }
    }
    // Toilet
    if (services.toilet) {
      if (!toilet.TimeSlot) {
        alert("Select time slot for Toilet cleaning.");
        return false;
      }
    }

    // location required
    if (!common.address || common.address.trim() === "") {
      alert("Please confirm location (address).");
      return false;
    }

    // prebook date should be >= today
    if (new Date(common.Date).toISOString().split("T")[0] < minDateISO) {
      alert("Prebook date cannot be in the past.");
      return false;
    }

    return true;
  }

  // Build payloads and submit each selected service to /api/user/book
  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }

    // Create array of payloads, one per selected service
    const payloads = [];

    if (services.cook) {
      payloads.push({
        bookingId: `${common.bookingIdBase}-cook`,
        IdWorker: common.IdWorker,
        TempPhoneCustomer: common.TempPhoneCustomer,
        TempPhoneWorker: common.TempPhoneWorker,
        location: common.location,
        WorkName: "Cook Service",
        MonthlyOrOneTime: common.MonthlyOrOneTime,
        FrequencyPerDay: cook.FrequencyPerDay,
        NoOfRooms: 0,
        NoOfKitchen: 0,
        HallSize: 0,
        NoOfToilets: 0,
        AmountOfBartan: cook.IncludeBartan ? 1 : 0,
        NoOfPeople: cook.PeopleCount,
        TimeSlot1: cook.TimeSlot1,
        TimeSlot2: cook.TimeSlot2,
        Date: new Date(common.Date).toISOString(),
        WhichPlan: common.WhichPlan,
        Months: common.Months,
        address: common.address,
      });
    }

    if (services.bartan) {
      payloads.push({
        bookingId: `${common.bookingIdBase}-bartan`,
        IdWorker: common.IdWorker,
        TempPhoneCustomer: common.TempPhoneCustomer,
        TempPhoneWorker: common.TempPhoneWorker,
        location: common.location,
        WorkName: "Bartan Service",
        MonthlyOrOneTime: common.MonthlyOrOneTime,
        FrequencyPerDay: bartan.FrequencyPerDay,
        TimeSlot1: bartan.TimeSlot1,
        TimeSlot2: bartan.TimeSlot2,
        Date: new Date(common.Date).toISOString(),
        WhichPlan: common.WhichPlan,
        Months: bartan.Months || common.Months,
        address: common.address,
      });
    }

    if (services.jhaduPocha) {
      payloads.push({
        bookingId: `${common.bookingIdBase}-jhadu`,
        IdWorker: common.IdWorker,
        TempPhoneCustomer: common.TempPhoneCustomer,
        TempPhoneWorker: common.TempPhoneWorker,
        location: common.location,
        WorkName: "Jhadu Pocha",
        MonthlyOrOneTime: jhadu.MonthlyOrOneTime || common.MonthlyOrOneTime,
        NoOfRooms: jhadu.NoOfRooms,
        NoOfKitchen: jhadu.NoOfKitchen,
        HallSize: jhadu.HallSize,
        NoOfToilets: jhadu.NoOfToilets,
        AmountOfBartan: jhadu.AmountOfBartan,
        TimeSlot: jhadu.TimeSlot,
        Date: new Date(common.Date).toISOString(),
        WhichPlan: common.WhichPlan,
        Months: jhadu.MonthlyOrOneTime === "Monthly" ? common.Months : 0,
        address: common.address,
      });
    }

    if (services.toilet) {
      payloads.push({
        bookingId: `${common.bookingIdBase}-toilet`,
        IdWorker: common.IdWorker,
        TempPhoneCustomer: common.TempPhoneCustomer,
        TempPhoneWorker: common.TempPhoneWorker,
        location: common.location,
        WorkName: "Toilet Cleaning",
        MonthlyOrOneTime: "Monthly",
        FrequencyPerDay: toilet.FrequencyPerDay,
        NoOfToilets: toilet.NoOfToilets,
        TimeSlot: toilet.TimeSlot,
        Date: new Date(common.Date).toISOString(),
        WhichPlan: common.WhichPlan,
        Months: toilet.Months || common.Months,
        address: common.address,
      });
    }

    if (payloads.length === 0) {
      alert("No services selected.");
      return;
    }

    try {
      setSubmitting(true);
      for (let p of payloads) {
        console.log("Sending payload:", p);
        // sequential posting (keeps it simple & easy to debug)
        await axios.post(`${API_BASE}/api/user/book`, p, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      alert("All selected services booked successfully!");
      navigate("/bookings");
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert("Failed to create bookings. See console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <img
          src="/allRounder.jpg"
          alt="All Rounder"
          className="w-full md:w-1/3 rounded-lg border-2 border-black"
        />
        <div>
          <h1 className="text-2xl font-bold">{heading || "All Rounder Services"}</h1>
          <p className="text-lg text-gray-700">Combine multiple services into one booking</p>
          <p className="italic text-gray-500">Choose services below and fill required options</p>
        </div>
      </div>

      {/* Monthly / One Time */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
        {["Monthly", "One Time"].map((type) => (
          <button
            key={type}
            type="button"
            className={`px-4 py-1 rounded-3xl ${common.MonthlyOrOneTime === type ? "bg-white" : "hover:bg-gray-200"}`}
            onClick={() => setCommon({ ...common, MonthlyOrOneTime: type })}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Services checkboxes */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
          <input type="checkbox" checked={services.cook} onChange={() => toggleService("cook")} />
          <span>Cook</span>
        </label>

        <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
          <input type="checkbox" checked={services.bartan} onChange={() => toggleService("bartan")} />
          <span>Bartan</span>
        </label>

        <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
          <input type="checkbox" checked={services.jhaduPocha} onChange={() => toggleService("jhaduPocha")} />
          <span>Jhadu Pocha</span>
        </label>

        <label className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
          <input type="checkbox" checked={services.toilet} onChange={() => toggleService("toilet")} />
          <span>Toilet Clean</span>
        </label>
      </div>

      {/* COOK Section (replicates Cook.jsx UI & logic) */}
      {services.cook && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Cook Options</h2>

          <div className="mb-4">
            <p className="font-semibold mb-2">Frequency per Day</p>
            <div className="flex gap-3">
              {["Once", "Twice"].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`px-4 py-1 rounded-lg ${cook.FrequencyPerDay === f ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"}`}
                  onClick={() => setCook({ ...cook, FrequencyPerDay: f, TimeSlot2: f === "Once" ? "" : cook.TimeSlot2 })}
                >
                  {f} a day
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">How many people’s meals?</label>
            <input
              type="number"
              min={1}
              value={cook.PeopleCount}
              onChange={(e) => setCook({ ...cook, PeopleCount: +e.target.value })}
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>

          {common.MonthlyOrOneTime === "Monthly" && (
            <div className="mb-4">
              <label className="block mb-1">Duration</label>
              <select value={common.Months} onChange={(e) => setCommon({ ...common, Months: +e.target.value })} className="bg-gray-100 p-2 rounded-md">
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={cook.IncludeNaashta} onChange={(e) => setCook({ ...cook, IncludeNaashta: e.target.checked })} />
              <span>Include Naashta (Breakfast) for same amount of people</span>
            </label>
          </div>


          <div className="mb-4">
            <label className="block mb-1">Select Time Slot for first meal</label>
            <select value={cook.TimeSlot1} onChange={(e) => setCook({ ...cook, TimeSlot1: e.target.value })} className="bg-gray-100 p-2 rounded-md w-full">
              <option value="">-- Select --</option>
              <option value="Morning">Morning (9–11 AM)</option>
              <option value="Afternoon">Afternoon (11–1 PM)</option>
              <option value="Afternoon2">Afternoon (1–3 PM)</option>
            </select>
          </div>

          {cook.FrequencyPerDay === "Twice" && (
            <div className="mb-4">
              <label className="block mb-1">Select Time Slot for second meal</label>
              <select value={cook.TimeSlot2} onChange={(e) => setCook({ ...cook, TimeSlot2: e.target.value })} className="bg-gray-100 p-2 rounded-md w-full">
                <option value="">-- Select --</option>
                <option value="Evening">Evening (6–8 PM)</option>
                <option value="Night">Night (8–10 PM)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* BARTAN Section (like Bartan.jsx) */}
      {services.bartan && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Bartan Options</h2>

          <div className="mb-4">
            <p className="font-semibold mb-2">Frequency per Day</p>
            <div className="flex gap-3">
              {["Once", "Twice"].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`px-4 py-1 rounded-lg ${bartan.FrequencyPerDay === f ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"}`}
                  onClick={() => setBartan({ ...bartan, FrequencyPerDay: f, TimeSlot2: f === "Once" ? "" : bartan.TimeSlot2 })}
                >
                  {f} a day
                </button>
              ))}
            </div>
          </div>

          {common.MonthlyOrOneTime === "Monthly" && (
            <div className="mb-4">
              <label className="block mb-1">Duration</label>
              <select value={bartan.Months} onChange={(e) => setBartan({ ...bartan, Months: +e.target.value })} className="bg-gray-100 p-2 rounded-md">
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1">Time Slot</label>
            <select value={bartan.TimeSlot1} onChange={(e) => setBartan({ ...bartan, TimeSlot1: e.target.value })} className="bg-gray-100 p-2 rounded-md w-full">
              <option value="">-- Select --</option>
              <option value="Morning">Morning (9–11 AM)</option>
              <option value="Evening">Evening (6–8 PM)</option>
            </select>
          </div>

          {bartan.FrequencyPerDay === "Twice" && (
            <div className="mb-4">
              <label className="block mb-1">Evening Slot</label>
              <select value={bartan.TimeSlot2} onChange={(e) => setBartan({ ...bartan, TimeSlot2: e.target.value })} className="bg-gray-100 p-2 rounded-md w-full">
                <option value="">-- Select --</option>
                <option value="Evening">Evening (6–8 PM)</option>
                <option value="Night">Night (8–10 PM)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* JHADU POCHA Section (like JhaduPocha.jsx) */}
      {services.jhaduPocha && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Jhadu Pocha Options</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Number of Rooms</label>
              <input type="number" value={jhadu.NoOfRooms} onChange={(e) => setJhadu({ ...jhadu, NoOfRooms: +e.target.value })} className="bg-gray-100 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Number of Kitchens</label>
              <input type="number" value={jhadu.NoOfKitchen} onChange={(e) => setJhadu({ ...jhadu, NoOfKitchen: +e.target.value })} className="bg-gray-100 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Hall Size</label>
              <input type="number" value={jhadu.HallSize} onChange={(e) => setJhadu({ ...jhadu, HallSize: +e.target.value })} className="bg-gray-100 p-2 rounded-md w-full" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Add-ons</label>
            <div className="flex items-center gap-3 mb-2">
              <input type="checkbox" checked={jhadu.NoOfToilets > 0} onChange={(e) => setJhadu({ ...jhadu, NoOfToilets: e.target.checked ? 1 : 0 })} />
              <span>Toilet Cleaning (check to enable)</span>
            </div>

          </div>

          <div className="mb-4">
            <label className="block mb-1">Time Slot</label>
            <select value={jhadu.TimeSlot} onChange={(e) => setJhadu({ ...jhadu, TimeSlot: e.target.value })} className="bg-gray-100 p-2 rounded-md w-full">
              <option value="">-- Select --</option>
              <option value="Morning">Morning (9–11 AM)</option>
              <option value="Afternoon">Afternoon (12–2 PM)</option>
              <option value="Evening">Evening (6–8 PM)</option>
            </select>
          </div>
        </div>
      )}



      {/* Prebook date + common location */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Start Date</p>
        <input
          type="date"
          min={minDateISO}
          value={new Date(common.Date).toISOString().split("T")[0]}
          onChange={(e) => setCommon({ ...common, Date: new Date(e.target.value) })}
          className="bg-gray-100 p-2 rounded-md"
        />
      </div>

      <div className="mt-6">
        <p className="font-semibold">Confirm Location</p>
        <input
          type="text"
          placeholder="Enter address (required)"
          value={common.address}
          onChange={(e) => setCommon({ ...common, address: e.target.value })}
          className="bg-gray-100 p-2 rounded-md w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-4 py-2 rounded-lg text-white ${submitting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"}`}
        >
          {submitting ? "Booking..." : "Book"}
        </button>
        <button type="button" className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
          Pay
        </button>
      </div>
    </div>
  );
}
