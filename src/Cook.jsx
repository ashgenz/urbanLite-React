import React, { useState,useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const UNIT_PRICES = {
  Monthly: {
    meal: 25,     // ₹ per meal per person
    naashta: 15,  // ₹ per naashta per person
    bartan: 2,    // ₹ per utensil
  },
  "One Time": {
    meal: 40,     // higher one-time rate
    naashta: 20,
    bartan: 5,
  },
};
export default function Cook({LoggedIn, heading }) {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    bookingId: `${Date.now().toString()}-${Math.random().toString(36).slice(2,8)}`,
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 },
    WorkName: "Cook Service",
    MonthlyOrOneTime: "Monthly",
    FrequencyPerDay: "Once",
   AmountOfBartan: 0,  // 👈 default extra utensils
    Months: 1,
    IncludeNaashta: false,
    IncludeBartan: false,
    NoOfPeople: 1,
    TimeSlot1: "",
    TimeSlot2: "",
    Date: new Date(),
    address: "",
    WhichPlan: "Standard",
  });
const estimatedPrice = useMemo(() => {
  const unit = UNIT_PRICES[formData.MonthlyOrOneTime];
  const days =
    formData.MonthlyOrOneTime === "Monthly" ? 30 * formData.Months : 1;

  // --- Meals ---
  const mealsPerDay = formData.FrequencyPerDay === "Twice" ? 2 : 1;
  const mealCost = formData.NoOfPeople * mealsPerDay * unit.meal;

  // --- Naashta ---
  const naashtaCost = formData.IncludeNaashta
    ? formData.NoOfPeople * unit.naashta
    : 0;

  // --- Bartan ---
  let bartanCost = 0;
  if (formData.IncludeBartan) {
    // ✅ Bartan for meals
    const mealBartan = formData.NoOfPeople * mealsPerDay * unit.bartan;

    // ✅ Extra bartan entered by user
    const extraBartan =
      (Number(formData.AmountOfBartan) || 0) * unit.bartan;

    bartanCost = mealBartan + extraBartan;
  }

  // ✅ Final price
  return Math.round((mealCost + naashtaCost + bartanCost) * days);
}, [formData]);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !LoggedIn) {
      alert("Please log in first!");
      return;
    }

    if (formData.FrequencyPerDay === "Once" && !formData.TimeSlot1) {
      alert("Please select a time slot!");
      return;
    }
    if (formData.FrequencyPerDay === "Twice" && (!formData.TimeSlot1 || !formData.TimeSlot2)) {
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
  WorkName: "Cook Service", // 👈 Cook treated as AllRounder with one service
services: [
  {
    WorkName: "Cook Service",
    FrequencyPerDay: formData.FrequencyPerDay,
    TimeSlot1: formData.TimeSlot1 || "",
    TimeSlot2: formData.FrequencyPerDay === "Twice" ? formData.TimeSlot2 || "" : "",
    NoOfPeople: Number(formData.NoOfPeople) || 1,
    IncludeNaashta: !!formData.IncludeNaashta,
    Bartan: formData.IncludeBartan
      ? {
          mealBartan: formData.NoOfPeople * (formData.FrequencyPerDay === "Twice" ? 2 : 1),
          extraBartan: Number(formData.AmountOfBartan) || 0,
        }
      : null,
  },
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
      if (res.status === 201 || res.status === 200) {
        alert("Cook booked successfully!");
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
          <p className="text-lg text-gray-700">Professional cook service with flexible options</p>
          <p className="italic text-gray-500">Select options below</p>
        </div>
      </div>

      {/* Plan */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
        {["Monthly", "One Time"].map((type) => (
          <button
            key={type}
            type="button"
            className={`px-4 py-1 rounded-3xl ${formData.MonthlyOrOneTime === type ? "bg-white" : "hover:bg-gray-200"}`}
            onClick={() => handleChange("MonthlyOrOneTime", type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Frequency */}
      <div className="mb-6">
        <p className="font-semibold">Frequency per Day</p>
        <div className="flex gap-4 mt-2">
          {["Once", "Twice"].map((f) => (
            <button
              key={f}
              type="button"
              className={`px-4 py-1 rounded-lg ${formData.FrequencyPerDay === f ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => handleChange("FrequencyPerDay", f)}
            >
              {f} a day
            </button>
          ))}
        </div>
      </div>

      {/* People */}
      <div className="mb-6">
        <p className="font-semibold">How many people’s meals?</p>
        <input
          type="number"
          min={1}
          value={formData.NoOfPeople}
          onChange={(e) => handleChange("NoOfPeople", +e.target.value)}
          className="bg-gray-100 p-2 rounded-md w-32"
        />
      </div>

      {/* Duration */}
      {formData.MonthlyOrOneTime === "Monthly" && (
        <div className="mb-6">
          <p className="font-semibold">Duration</p>
          <select value={formData.Months} onChange={(e) => handleChange("Months", +e.target.value)} className="bg-gray-100 p-2 rounded-md">
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
          </select>
        </div>
      )}

      {/* Add-ons */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={formData.IncludeNaashta} onChange={(e) => handleChange("IncludeNaashta", e.target.checked)} />
          <span>Include Naashta (Breakfast)</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={formData.IncludeBartan} onChange={(e) => handleChange("IncludeBartan", e.target.checked)} />
          <span>Include Bartan Cleaning</span>
        </div>
      </div>
      

{formData.IncludeBartan && (
  <div className="ml-6 mt-2">
    <label className="block mb-1">How many extra utensils (apart from meals)?</label>
    <input
      type="number"
      min={0}
      value={formData.AmountOfBartan}
      onChange={(e) => handleChange("AmountOfBartan", +e.target.value)}
      className="bg-gray-100 p-2 rounded-md w-32"
    />
  </div>
)}



      {/* Time slots */}
      <div className="mb-6">
        <p className="font-semibold">Select Time Slot for first meal</p>
        <select value={formData.TimeSlot1} onChange={(e) => handleChange("TimeSlot1", e.target.value)} className="bg-gray-100 p-2 rounded-md w-full">
          <option value="">-- Select --</option>
          <option value="09:00-11:00">Morning (9–11 AM)</option>
          <option value="11:00-13:00">Afternoon (11–1 PM)</option>
          <option value="13:00-15:00">Afternoon (1–3 PM)</option>
          <option value="18:00-20:00">Evening (6–8 PM)</option>
          <option value="20:00-22:00">Night (8–10 PM)</option>
        </select>
      </div>

      {formData.FrequencyPerDay === "Twice" && (
        <div className="mb-6">
          <p className="font-semibold">Select Time Slot for second meal</p>
          <select value={formData.TimeSlot2} onChange={(e) => handleChange("TimeSlot2", e.target.value)} className="bg-gray-100 p-2 rounded-md w-full">
            <option value="">-- Select --</option>
            <option value="09:00-11:00">Morning (9–11 AM)</option>
            <option value="11:00-13:00">Afternoon (11–1 PM)</option>
            <option value="13:00-15:00">Afternoon (1–3 PM)</option>
            <option value="18:00-20:00">Evening (6–8 PM)</option>
            <option value="20:00-22:00">Night (8–10 PM)</option>
          </select>
        </div>
      )}

      {/* Prebook */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Start Date</p>
        <input type="date" value={new Date(formData.Date).toISOString().split("T")[0]} onChange={(e) => handleChange("Date", new Date(e.target.value))} className="bg-gray-100 p-2 rounded-md" />
      </div>

      {/* Location */}
      <div className="mt-6">
        <p className="font-semibold">Confirm Location</p>
        <input type="text" placeholder="Enter address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className="bg-gray-100 p-2 rounded-md w-full" />
      </div>
<p className="mt-4 font-semibold text-purple-700">
  Estimated Price: ₹{estimatedPrice}
</p>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleSubmit} disabled={submitting} className={`px-4 py-2 rounded-lg text-white ${submitting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"}`}>{submitting ? "Booking..." : "Book"}</button>
        <button type="button" className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Pay</button>
      </div>
    </div>
  );
}
