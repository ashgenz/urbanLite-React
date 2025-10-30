import React, { useState,useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UNIT_PRICES } from "./priceConfig";
const API_BASE = "https://urbanlite-backends.onrender.com";


export default function Bartan({LoggedIn, heading }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookingId: `${Date.now().toString()}-${Math.random().toString(36).slice(2,8)}`,
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 },
    WorkName: "Bartan Service",
    MonthlyOrOneTime: "Monthly",
    FrequencyPerDay: "Once",
      AmountOfBartan: 1,   // 👈 new field
    Months: 1,
    TimeSlot1: "",
    TimeSlot2: "",
    Date: new Date(),
    address: "",
    WhichPlan: "Standard",
  });
const estimatedPrice = useMemo(() => {
  const unit = UNIT_PRICES[formData.MonthlyOrOneTime];
  const days = formData.MonthlyOrOneTime === "Monthly" ? 30 * formData.Months : 1;

  // --- Bartan count per day ---
  const perDayBartan = Number(formData.AmountOfBartan) || 1;
  const frequencyFactor = formData.FrequencyPerDay === "Twice" ? 2 : 1;

  // Total utensils per day = entered utensils × frequency
  const dailyUtensils = perDayBartan * frequencyFactor;

  // ✅ Final price
  return Math.round(dailyUtensils * unit.bartan * days);
}, [formData]);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !LoggedIn) {
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
    if (!formData.address || formData.address.trim() === "") {
      alert("Please enter address");
      return;
    }

const payload = {
  bookingId: formData.bookingId,
  IdWorker: formData.IdWorker,
  TempPhoneCustomer: formData.TempPhoneCustomer,
  TempPhoneWorker: formData.TempPhoneWorker,
  location: {
    lat: Number(formData.location.lat) || 0,
    lng: Number(formData.location.lng) || 0,
  },
  WorkName: "Bartan Service", // 👈 top-level WorkName should be generic
services: [
  {
    WorkName: "Bartan Service",
    FrequencyPerDay: formData.FrequencyPerDay,
    TimeSlot1: formData.TimeSlot1 || "",
    TimeSlot2: formData.FrequencyPerDay === "Twice" ? formData.TimeSlot2 || "" : "",
    AmountOfBartan: Number(formData.AmountOfBartan) || 1,
  }
],


  MonthlyOrOneTime: formData.MonthlyOrOneTime,
  Months: Number(formData.Months) || 1,
  WhichPlan: formData.WhichPlan,
  Date: new Date(formData.Date).toISOString(),
  address: formData.address,
};

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE}/api/user/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // backend returns results array when posting arrays; for single object it returns created booking.
      if (res.status === 201 || res.status === 200) {
        alert("Bartan service booked successfully!");
        navigate("/bookings");
      } else {
        alert("Booking response: " + (res.data?.message || res.status));
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
{/* Utensils Input */}
<div className="mb-6">
  <p className="font-semibold">How many extra utensils per session?</p>
  <input
    type="number"
    min={1}
    value={formData.AmountOfBartan}
    onChange={(e) => handleChange("AmountOfBartan", +e.target.value)}
    className="bg-gray-100 p-2 rounded-md w-32"
  />
</div>

      {/* Time Slots */}
      {formData.FrequencyPerDay === "Once" && (
        <div className="mb-6">
          <p className="font-semibold">Select Time Slot</p>
          <select
            value={formData.TimeSlot1}
            onChange={(e) => handleChange("TimeSlot1", e.target.value)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <option value="">-- Select --</option>
            <option value="07:00-08:00">Morning (7–8 AM)</option>
            <option value="08:00-09:00">Morning (8–9 AM)</option>
            <option value="09:00-10:00">Morning (9–10 AM)</option>
            <option value="10:00-11:00">Morning (10–11 AM)</option>
            <option value="11:00-12:00">Morning (11–12 PM)</option>
            <option value="12:00-13:00">Afternoon (12–1 PM)</option>
            <option value="13:00-14:00">Afternoon (1–2 PM)</option>
            <option value="14:00-15:00">Afternoon (2–3 PM)</option>
            <option value="15:00-16:00">Afternoon (3–4 PM)</option>
            <option value="20:00-21:00">Night (8–9 PM)</option>
            <option value="21:00-22:00">Night (9–10 PM)</option>
            <option value="22:00-23:00">Night (10–11 PM)</option>
          </select>
        </div>
      )}

      {formData.FrequencyPerDay === "Twice" && (
        <>
          <div className="mb-6">
            <p className="font-semibold">Morning Slot</p>
            <select
              value={formData.TimeSlot1}
              onChange={(e) => handleChange("TimeSlot1", e.target.value)}
              className="bg-gray-100 p-2 rounded-md"
            >
              <option value="">-- Select --</option>
              <option value="07:00-08:00">Morning (7–8 AM)</option>
              <option value="08:00-09:00">Morning (8–9 AM)</option>
              <option value="09:00-10:00">Morning (9–10 AM)</option>
              <option value="10:00-11:00">Morning (10–11 AM)</option>
              <option value="11:00-12:00">Morning (11–12 PM)</option>
              <option value="12:00-13:00">Afternoon (12–1 PM)</option>
              <option value="13:00-14:00">Afternoon (1–2 PM)</option>
              <option value="14:00-15:00">Afternoon (2–3 PM)</option>
              <option value="15:00-16:00">Afternoon (3–4 PM)</option>
            </select>
          </div>
          <div className="mb-6">
            <p className="font-semibold">Evening Slot</p>
            <select
              value={formData.TimeSlot2}
              onChange={(e) => handleChange("TimeSlot2", e.target.value)}
              className="bg-gray-100 p-2 rounded-md"
            >
              <option value="">-- Select --</option>
              <option value="20:00-21:00">Night (8–9 PM)</option>
              <option value="21:00-22:00">Night (9–10 PM)</option>
              <option value="22:00-23:00">Night (10–11 PM)</option>
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
<p className="mt-4 font-semibold text-purple-700">
  Estimated Price: ₹{estimatedPrice}
</p>

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
