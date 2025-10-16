import React, { useState,useMemo } from "react";
import axios from "axios";
import TimeSlotDropdown from "./TimeSlotDropdown";
import { useNavigate } from "react-router-dom";
import { UNIT_PRICES } from "./priceConfig";
// import Math from "Math"

// Use Vite env if present, otherwise fallback to localhost:6000
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JhaduPocha({LoggedIn, heading }) {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  bookingId: Date.now().toString(),
  IdWorker: "demoWorker",
  TempPhoneCustomer: "9999999999",
  TempPhoneWorker: "8888888888",
  location: { lat: 0, lng: 0 },
  WorkName: "All Rounder Service",
  MonthlyOrOneTime: "Monthly",
  WhichPlan: "Standard",
  Date: new Date(),
  address: "",
  Months: 1,   // 👈 add this
});

const JhaduPochaActive = true; // always active in this form
const ToiletActive = formData.NoOfToilets > 0;
const BartanActive = formData.AmountOfBartan > 0;
// JhaduPocha.jsx

// ... (imports and state)

const estimatedPrice = useMemo(() => {
  const unit = UNIT_PRICES[formData.MonthlyOrOneTime] || UNIT_PRICES.Monthly; // Safely access unit prices
  console.log(formData.MonthlyOrOneTime);
  const days =
    formData.MonthlyOrOneTime === "Monthly" ? 30 * (formData.Months || 1) : 1; // Default Months to 1

  // --- Apply defaults from plan ---
  let jhaduFrequency =
    formData.WhichPlan === "Premium"
      ? "Daily"
      : formData.WhichPlan === "Standard"
      ? "Alternate day"
      : formData.JhaduFrequency; // Use the value from state if 'Custom'

  let toiletFreq =
    formData.WhichPlan === "Custom"
      ? formData.FrequencyPerWeek
      : "Twice a week"; // default for both Standard & Premium

  let bartanFreq =
    formData.WhichPlan === "Premium"
      ? "Twice a day"
      : formData.WhichPlan === "Standard"
      ? "Once a day"
      : formData.FrequencyPerDay; // Use the value from state if 'Custom'

  // ✅ Jhadu factor
  let jhaduFactor = jhaduFrequency === "Alternate day" ? 0.5 : 1;

  // ✅ Toilet factor
  let toiletFactor = 0;
  if (toiletFreq === "Twice a week") toiletFactor = 2 / 7;
  if (toiletFreq === "Thrice a week") toiletFactor = 3 / 7;

  // ✅ Bartan factor
  // Corrected for consistency: using "Twice a day" for 2
  let bartanFactor = bartanFreq === "Twice a day" ? 2 : 1; 

  let total = 0;

  // 1. Jhadu Pocha Calculation
  total += 
    ((formData.NoOfRooms || 0) * unit.room +
     (formData.NoOfKitchen || 0) * unit.kitchen +
     (formData.HallSize || 0) * unit.hall) *
     jhaduFactor *
     days; // 🛑 FIX: Multiply by days before final round

  // 2. Toilet Cleaning Calculation
  total += 
    (formData.NoOfToilets || 0) * unit.toilet * toiletFactor * days; // 🛑 FIX: Multiply by days before final round

  // 3. Bartan Service Calculation
  total += 
    (formData.AmountOfBartan || 0) * unit.bartan * bartanFactor * days; // 🛑 FIX: Multiply by days before final round

  // ✅ Final price calculation: only one Math.round at the end.
  return Math.round(total);
}, [formData]);


// ... (rest of JhaduPocha.jsx)
// NOTE: I also corrected the payload frequency fallback strings for the custom plan in handleSubmit 
// to ensure consistency with the strings used in the calculation logic ("Alternate day", "Twice a week", "Once a day")

// ... (inside handleSubmit)

// ... (before payload creation)

// Calculate correct frequency strings for the payload
  const finalJhaduFrequency =
    formData.WhichPlan === "Custom"
      ? formData.JhaduFrequency || "Alternate day" // Use full string
      : formData.WhichPlan === "Premium"
      ? "Daily"
      : "Alternate day"; // Standard

  const finalToiletFrequency =
    formData.WhichPlan === "Custom"
      ? formData.FrequencyPerWeek || "Twice a week" // Use full string
      : "Twice a week"; // Standard & Premium

  const finalBartanFrequency =
    formData.WhichPlan === "Custom"
      ? formData.FrequencyPerDay || "Once a day" // Use full string
      : formData.WhichPlan === "Premium"
      ? "Twice a day" // Use full string
      : "Once a day"; // Standard

const payload = {
  bookingId: formData.bookingId,
  IdWorker: formData.IdWorker,
  TempPhoneCustomer: formData.TempPhoneCustomer,
  TempPhoneWorker: formData.TempPhoneWorker,
  address: formData.address,
  WorkName: "Jhadu Pocha",
  MonthlyOrOneTime: formData.MonthlyOrOneTime,
  Months: Number(formData.Months) || 1,
  WhichPlan: formData.WhichPlan,
  Date: new Date(formData.Date).toISOString(),
  services: [
    {
      WorkName: "Jhadu Pocha",
      NoOfRooms: formData.NoOfRooms || 0, // Default to 0
      NoOfKitchen: formData.NoOfKitchen || 0, // Default to 0
      HallSize: formData.HallSize || 0, // Default to 0
      JhaduTimeSlot: formData.TimeSlot,
      // ✅ Use calculated final string
      JhaduFrequency: finalJhaduFrequency,
    },
    formData.NoOfToilets > 0 && {
      WorkName: "Toilet Cleaning",
      NoOfToilets: formData.NoOfToilets || 0, // Default to 0
      // ✅ Use calculated final string
      FrequencyPerWeek: finalToiletFrequency,
    },
    formData.AmountOfBartan > 0 && {
      WorkName: "Bartan Service",
      AmountOfBartan: formData.AmountOfBartan || 0, // Default to 0
      // ✅ Use calculated final string
      FrequencyPerDay: finalBartanFrequency,
    },
  ].filter(Boolean),
};

// ... (rest of handleSubmit)


  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

// JhaduPocha.jsx

// ... (imports and state)

// NOTE: The 'estimatedPrice' useMemo logic remains correct from the last step.

// ... (handleChange function)

const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  if (!token || !LoggedIn) {
    alert("Please log in first!");
    return;
  }

  if (!formData.TimeSlot) {
    alert("Please select a time slot!");
    return;
  }

  // --- Calculate correct frequency strings for the payload ---
  const finalJhaduFrequency =
    formData.WhichPlan === "Custom"
      ? formData.JhaduFrequency || "Alternate day" // Use full string
      : formData.WhichPlan === "Premium"
      ? "Daily"
      : "Alternate day"; // Standard default

  const finalToiletFrequency =
    formData.WhichPlan === "Custom"
      ? formData.FrequencyPerWeek || "Twice a week" // Use full string
      : "Twice a week"; // Standard & Premium default

  const finalBartanFrequency =
    formData.WhichPlan === "Custom"
      ? formData.FrequencyPerDay || "Once a day" // Use full string
      : formData.WhichPlan === "Premium"
      ? "Twice a day" // Use full string
      : "Once a day"; // Standard default


  const payload = {
    bookingId: formData.bookingId,
    IdWorker: formData.IdWorker,
    TempPhoneCustomer: formData.TempPhoneCustomer,
    TempPhoneWorker: formData.TempPhoneWorker,
    address: formData.address,
    WorkName: "Jhadu Pocha",
    MonthlyOrOneTime: formData.MonthlyOrOneTime,
    Months: Number(formData.Months) || 1,
    WhichPlan: formData.WhichPlan,
    Date: new Date(formData.Date).toISOString(),
    services: [
      {
        WorkName: "Jhadu Pocha",
        NoOfRooms: formData.NoOfRooms || 0,
        NoOfKitchen: formData.NoOfKitchen || 0,
        HallSize: formData.HallSize || 0,
        JhaduTimeSlot: formData.TimeSlot,
        // ✅ Use calculated final string
        JhaduFrequency: finalJhaduFrequency,
      },
      formData.NoOfToilets > 0 && {
        WorkName: "Toilet Cleaning",
        NoOfToilets: formData.NoOfToilets || 0,
        // ✅ Use calculated final string
        FrequencyPerWeek: finalToiletFrequency,
      },
      formData.AmountOfBartan > 0 && {
        WorkName: "Bartan Service",
        AmountOfBartan: formData.AmountOfBartan || 0,
        // ✅ Use calculated final string
        FrequencyPerDay: finalBartanFrequency,
      },
    ].filter(Boolean),
  };


  console.log("Submitting payload:", payload); // 👈 debug

  try {
    
    setSubmitting(true);
    const res = await axios.post(`${API_BASE}/api/user/book`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201) {
      alert("Booking created successfully!");
      navigate("/bookings");
    }
  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    alert("Failed to create booking");
  } finally {
    setSubmitting(false);
  }
};

// ... (rest of JhaduPocha.jsx including the JSX return)


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <img
          src="/JhaduPocha.jpg"
          alt="JhaduPocha"
          className="w-full md:w-1/3 rounded-lg border-2 border-black"
        />
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-lg text-gray-700">Description</p>
          <p className="italic text-gray-500">
            Professional brooming and mopping service
          </p>
        </div>
      </div>

      {/* Monthly / One Time */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
        <button
          type="button"
          className={`px-4 py-1 rounded-3xl ${
            formData.MonthlyOrOneTime === "Monthly"
              ? "bg-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handleChange("MonthlyOrOneTime", "Monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          className={`px-4 py-1 rounded-3xl ${
            formData.MonthlyOrOneTime === "OneTime"
              ? "bg-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handleChange("MonthlyOrOneTime", "OneTime")}
        >
          One Time
        </button>
      </div>
{/* Duration */}
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

      {/* Room, Kitchen, Hall */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <p>Number of Rooms</p>
          <input
            type="number"
            value={formData.NoOfRooms}
            onChange={(e) => handleChange("NoOfRooms", +e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-md"
          />
        </div>
        <div>
          <p>Number of Kitchens</p>
          <input
            type="number"
            value={formData.NoOfKitchen}
            onChange={(e) => handleChange("NoOfKitchen", +e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-md"
          />
        </div>
        <div>
          <p>Hall Size</p>
          <input
            type="number"
            value={formData.HallSize}
            onChange={(e) => handleChange("HallSize", +e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-md"
          />
          <p className="text-xs italic text-gray-500">
            (If more than one hall, give combined size)
          </p>
        </div>
      </div>

      {/* Add-ons */}
      <div className="mb-6">
        <p className="font-semibold">Add-ons:</p>
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={formData.NoOfToilets > 0}
                onChange={(e) =>
                  handleChange("NoOfToilets", e.target.checked ? 1 : 0)
                }
              />
              Toilet Cleaning
            </label>
            <p className="mt-1">Number of Toilets</p>
            <input
              type="number"
              value={formData.NoOfToilets}
              onChange={(e) => handleChange("NoOfToilets", +e.target.value)}
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={formData.AmountOfBartan > 0}
                onChange={(e) =>
                  handleChange("AmountOfBartan", e.target.checked ? 1 : 0)
                }
              />
              Bartan Cleaning
            </label>
            <p className="mt-1">Amount of Bartan</p>
            <input
              type="number"
              value={formData.AmountOfBartan}
              onChange={(e) => handleChange("AmountOfBartan", +e.target.value)}
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>
        </div>
      </div>

      {/* Time Slot */}
      <TimeSlotDropdown
        value={formData.TimeSlot}
        onChange={(slot) => handleChange("TimeSlot", slot)}
      />

      {/* Prebook */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Selection</p>
        <label className="block mt-2">Select Date:</label>
        <input
          type="date"
          value={new Date(formData.Date).toISOString().split("T")[0]}
          onChange={(e) => handleChange("Date", new Date(e.target.value))}
          className="bg-gray-100 p-2 rounded-md"
        />
      </div>

      {/* Location */}
      <div className="mt-6">
        <p className="font-semibold">Confirm Location of Work (address)</p>
        <input
          type="text"
          placeholder="Enter address (optional)"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="bg-gray-100 p-2 rounded-md w-full"
        />
      </div>

      {/* Plans */}
<div className="grid md:grid-cols-3 gap-4 mt-8">
  {[
    {
      name: "Standard",
      details: [
        "Jhadu pocha: Alternate day",
        ToiletActive && "Toilet: Twice a week",
        BartanActive && "Bartan: Daily once",
      ].filter(Boolean), // remove false entries
    },
    {
      name: "Premium",
      details: [
        "Jhadu pocha: Daily",
        ToiletActive && "Toilet: Twice a week",
        BartanActive && "Bartan: Daily twice",
      ].filter(Boolean),
    },
    {
      name: "Custom",
      details: [
        "Jhadu pocha: Flexible",
        ToiletActive && "Toilet: Flexible",
        BartanActive && "Bartan: Flexible",
      ].filter(Boolean),
    },
  ].map((plan) => (
    <button
      key={plan.name}
      type="button"
      className={`p-4 rounded-lg text-left ${
        formData.WhichPlan === plan.name
          ? "bg-purple-200"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
      onClick={() => handleChange("WhichPlan", plan.name)}
    >
      <h1 className="font-bold mb-2">{plan.name} Plan</h1>
      <ul className="list-disc list-inside">
        {plan.details.map((d, idx) => (
          <li key={idx}>{d}</li>
        ))}
      </ul>
    </button>
  ))}
</div>

{/* Custom quick controls: shown only when Monthly + Custom */}
{formData.MonthlyOrOneTime === "Monthly" && formData.WhichPlan === "Custom" && (
  <div className="border rounded-lg p-4 mb-6 bg-gray-50">
    <p className="font-semibold mb-3">Customize Frequencies</p>

    {/* Jhadu quick row */}
    {JhaduPochaActive && (
      <div className="flex items-center justify-between gap-3 py-2">
        <div className="font-medium">Jhadu Pocha</div>
        <div className="flex gap-2">
          {["Daily", "Alternate day"].map((val) => (
            <button
              key={val}
              type="button"
              className={`px-3 py-1 rounded-lg ${
                formData.JhaduFrequency === val
                  ? "bg-purple-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleChange("JhaduFrequency", val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Toilet quick row */}
    {ToiletActive && (
      <div className="flex items-center justify-between gap-3 py-2 border-t">
        <div className="font-medium">Toilet Cleaning</div>
        <div className="flex gap-2">
          {["Twice a week", "Thrice a week"].map((val) => (
            <button
              key={val}
              type="button"
              className={`px-3 py-1 rounded-lg ${
                formData.FrequencyPerWeek === val
                  ? "bg-purple-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleChange("FrequencyPerWeek", val)}
            >
              {val} 
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Bartan quick row */}
    {BartanActive && (
      <div className="flex items-center justify-between gap-3 py-2 border-t">
        <div className="font-medium">Bartan Cleaning</div>
        <div className="flex gap-2">
          {["Once a day", "Twice a day"].map((val) => (
            <button
              key={val}
              type="button"
              className={`px-3 py-1 rounded-lg ${
                formData.FrequencyPerDay === val
                  ? "bg-purple-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() =>
                handleChange("FrequencyPerDay", val)
              }
            >
              {val} 
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
)}

{/* Show Estimated Price */}
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
