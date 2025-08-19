import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Cook({ heading }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingId: Date.now().toString(),
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 },
    WorkName: "Cook Service",
    MonthlyOrOneTime: "Monthly",
    FrequencyPerDay: "Once", // Once | Twice
    Months: 1,
    IncludeNaashta: false,
    IncludeBartan: false,
    PeopleCount: 1,
    TimeSlot1: "", // First meal
    TimeSlot2: "", // Second meal (only if Twice)
    Date: new Date(),
    address: "",
    WhichPlan: "Standard",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first!");
      return;
    }

    // Validation
    if (formData.FrequencyPerDay === "Once" && !formData.TimeSlot1) {
      alert("Please select a time slot!");
      return;
    }
    if (
      formData.FrequencyPerDay === "Twice" &&
      (!formData.TimeSlot1 || !formData.TimeSlot2)
    ) {
      alert("Please select both time slots!");
      return;
    }

    const payload = {
      ...formData,
      Date: new Date(formData.Date).toISOString(),
      location: {
        lat: Number(formData.location.lat) || 0,
        lng: Number(formData.location.lng) || 0,
      },
    };

    console.log("Submitting payload:", payload);

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE}/api/user/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        alert("Cook booked successfully!");
        navigate("/bookings");
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <img
          src="/cook.png"
          alt="Cook Service"
          className="w-full md:w-1/3 rounded-lg border-2 border-black"
        />
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-lg text-gray-700">Description</p>
          <p className="italic text-gray-500">
            Professional cook service with flexible options
          </p>
        </div>
      </div>

      {/* Monthly / One Time */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
        {["Monthly", "One Time"].map((type) => (
          <button
            key={type}
            type="button"
            className={`px-4 py-1 rounded-3xl ${
              formData.MonthlyOrOneTime === type
                ? "bg-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleChange("MonthlyOrOneTime", type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Frequency per Day */}
      <div className="mb-6">
        <p className="font-semibold">Frequency per Day</p>
        <div className="flex gap-4 mt-2">
          {["Once", "Twice"].map((f) => (
            <button
              key={f}
              type="button"
              className={`px-4 py-1 rounded-lg ${
                formData.FrequencyPerDay === f
                  ? "bg-purple-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                handleChange("FrequencyPerDay", f);
                if (f === "Once") handleChange("TimeSlot2", ""); // reset slot2
              }}
            >
              {f} a day
            </button>
          ))}
        </div>
      </div>

      {/* People count */}
      <div className="mb-6">
        <p className="font-semibold">How many people’s meals?</p>
        <input
          type="number"
          min={1}
          value={formData.PeopleCount}
          onChange={(e) => handleChange("PeopleCount", +e.target.value)}
          className="bg-gray-100 p-2 rounded-md w-32"
        />
      </div>

      {/* Duration (if Monthly) */}
      {formData.MonthlyOrOneTime === "Monthly" && (
        <div className="mb-6">
          <p className="font-semibold">Duration</p>
          <select
            value={formData.Months}
            onChange={(e) => handleChange("Months", +e.target.value)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
          </select>
        </div>
      )}

      {/* Add-ons */}
      <div className="mb-6">
        <p className="font-semibold">Extras</p>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={formData.IncludeNaashta}
            onChange={(e) => handleChange("IncludeNaashta", e.target.checked)}
          />
          Include Naashta (Breakfast) for same amount of people
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={formData.IncludeBartan}
            onChange={(e) => handleChange("IncludeBartan", e.target.checked)}
          />
          Include Bartan Cleaning
        </label>
      </div>

      {/* Time Slot(s) */}
      <div className="mb-6">
        <p className="font-semibold">
          Select Time Slot {formData.FrequencyPerDay === "Twice" ? "for first meal" : ""}
        </p>
        <select
          value={formData.TimeSlot1}
          onChange={(e) => handleChange("TimeSlot1", e.target.value)}
          className="bg-gray-100 p-2 rounded-md"
        >
          <option value="">-- Select --</option>
          <option value="Morning">Morning (9–11 AM)</option>
          <option value="Afternoon">Afternoon (11–1 PM)</option>
          <option value="Afternoon">Afternoon (1–3 PM)</option>
        </select>
      </div>

      {formData.FrequencyPerDay === "Twice" && (
        <div className="mb-6">
          <p className="font-semibold">Select Time Slot for second meal</p>
          <select
            value={formData.TimeSlot2}
            onChange={(e) => handleChange("TimeSlot2", e.target.value)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <option value="">-- Select --</option>
            <option value="Evening">Evening (6–8 PM)</option>
            <option value="Night">Night (8–10 PM)</option>
          </select>
        </div>
      )}

      {/* Prebook */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Start Date</p>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={new Date(formData.Date).toISOString().split("T")[0]}
          onChange={(e) => handleChange("Date", new Date(e.target.value))}
          className="bg-gray-100 p-2 rounded-md"
        />
      </div>

      {/* Location */}
      <div className="mt-6">
        <p className="font-semibold">Confirm Location</p>
        <input
          type="text"
          placeholder="Enter address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="bg-gray-100 p-2 rounded-md w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-4 py-2 rounded-lg text-white ${
            submitting
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-600"
          }`}
        >
          {submitting ? "Booking..." : "Book"}
        </button>
        <button
          type="button"
          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
