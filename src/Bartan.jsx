import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Bartan({ heading }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingId: Date.now().toString(),
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 },
    WorkName: "Bartan Cleaning",
    MonthlyOrOneTime: "Monthly", // fixed to Monthly
    FrequencyPerDay: "Once",
    Months: 1,
    TimeSlotMorning: "",
    TimeSlotEvening: "",
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
    if (formData.FrequencyPerDay === "Once" && !formData.TimeSlotMorning) {
      alert("Please select a time slot!");
      return;
    }
    if (
      formData.FrequencyPerDay === "Twice" &&
      (!formData.TimeSlotMorning || !formData.TimeSlotEvening)
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
        alert("Bartan service booked successfully!");
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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <img
          src="/bartan.jpg"
          alt="Bartan Service"
          className="w-full md:w-1/3 rounded-lg border-2 border-black"
        />
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-lg text-gray-700">Utensil Cleaning Service</p>
          <p className="italic text-gray-500">
            Daily bartan cleaning with flexible frequency and slots
          </p>
        </div>
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
              onClick={() => handleChange("FrequencyPerDay", f)}
            >
              {f} a day
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
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

      {/* Time Slots */}
      {formData.FrequencyPerDay === "Once" && (
        <div className="mb-6">
          <p className="font-semibold">Select Time Slot</p>
          <select
            value={formData.TimeSlotMorning}
            onChange={(e) => handleChange("TimeSlotMorning", e.target.value)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <option value="">-- Select --</option>
            <option value="Morning">Morning (7–8 AM)</option>
            <option value="Evening">Morning (8–9 AM)</option>
            <option value="Evening">Morning (9–10 AM)</option>
            <option value="Evening">Morning (10–11 AM)</option>
            <option value="Evening">Morning (11–12 AM)</option>
            <option value="Evening">Afternoon (12–1 PM)</option>
            <option value="Evening">Afternoon (1–2 PM)</option>
            <option value="Evening">Afternoon (2–3 PM)</option>
            <option value="Evening">Afternoon (3–4 PM)</option>
            <option value="Evening">Night (8–9 PM)</option>
            <option value="Evening">Night (9–10 PM)</option>
            <option value="Evening">Night (10–11 PM)</option>
          </select>
        </div>
      )}

      {formData.FrequencyPerDay === "Twice" && (
        <>
          <div className="mb-6">
            <p className="font-semibold">Morning Slot</p>
            <select
              value={formData.TimeSlotMorning}
              onChange={(e) => handleChange("TimeSlotMorning", e.target.value)}
              className="bg-gray-100 p-2 rounded-md"
            >
              <option value="">-- Select --</option>
            <option value="Morning">Morning (7–8 AM)</option>
            <option value="Evening">Morning (8–9 AM)</option>
            <option value="Evening">Morning (9–10 AM)</option>
            <option value="Evening">Morning (10–11 AM)</option>
            <option value="Evening">Morning (11–12 AM)</option>
            <option value="Evening">Afternoon (12–1 PM)</option>
            <option value="Evening">Afternoon (1–2 PM)</option>
            <option value="Evening">Afternoon (2–3 PM)</option>
            <option value="Evening">Afternoon (3–4 PM)</option>
            </select>
          </div>
          <div className="mb-6">
            <p className="font-semibold">Evening Slot</p>
            <select
              value={formData.TimeSlotEvening}
              onChange={(e) => handleChange("TimeSlotEvening", e.target.value)}
              className="bg-gray-100 p-2 rounded-md"
            >
            <option value="">-- Select --</option>
            <option value="Evening">Night (8–9 PM)</option>
            <option value="Evening">Night (9–10 PM)</option>
            <option value="Evening">Night (10–11 PM)</option>
            </select>
          </div>
        </>
      )}

      {/* Prebook */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Start Date</p>
        <input
          type="date"
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
