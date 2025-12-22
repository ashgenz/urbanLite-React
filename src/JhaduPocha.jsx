import React, { useState,useMemo } from "react";
import axios from "axios";
import TimeSlotDropdown from "./TimeSlotDropdown";
import { useNavigate } from "react-router-dom";
import { UNIT_PRICES } from "./priceConfig";
// import Math from "Math"

// Use Vite env if present, otherwise fallback to localhost:5000
const API_BASE = "https://urbanlite-backends.onrender.com";


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
  WhichPlan: "Premium",
  Date: new Date(),
  address: "",
  Months: 1,
  // Initialize numerical fields to 0
  NoOfRooms: 0,
  NoOfKitchen: 0,
  HallSize: 0,
  NoOfToilets: 0,
  AmountOfBartan: 0,
});
// Default is "Custom" so inputs are visible initially (or you can set to "" to force a choice)
  const [selectedFlatType, setSelectedFlatType] = useState("1BHK");
const JhaduPochaActive = true; // always active in this form
const ToiletActive = formData.NoOfToilets > 0;
const BartanActive = formData.AmountOfBartan > 0;


const handleFlatSelection = (type) => {
    setSelectedFlatType(type);

    if (type === "Custom") {
      // Reset to 0 so they can type, or keep previous values? 
      // Let's reset to give a clean slate for custom entry.
      setFormData((prev) => ({ ...prev, NoOfRooms: 0, NoOfKitchen: 0, HallSize: 0 }));
    } else {
      // Auto-fill based on standard BHK definitions
      let rooms = 0;
      if (type === "1BHK") rooms = 1;
      else if (type === "2BHK") rooms = 2;
      else if (type === "3BHK") rooms = 3;
      else if (type === "4BHK") rooms = 4;

      // Assuming 1 Kitchen and 1 Hall for all standard flats
      setFormData((prev) => ({
        ...prev,
        NoOfRooms: rooms,
        NoOfKitchen: 1,
        HallSize: 1,
      }));
    }
  };

// --- NEW: Helper to Auto-Fill Rooms based on BHK ---
  const handlePreset = (type) => {
    if (type === "1BHK") setFormData(prev => ({ ...prev, NoOfRooms: 1, NoOfKitchen: 1, HallSize: 1 }));
    if (type === "2BHK") setFormData(prev => ({ ...prev, NoOfRooms: 2, NoOfKitchen: 1, HallSize: 1 }));
    if (type === "3BHK") setFormData(prev => ({ ...prev, NoOfRooms: 3, NoOfKitchen: 1, HallSize: 1 }));
    if (type === "4BHK") setFormData(prev => ({ ...prev, NoOfRooms: 4, NoOfKitchen: 1, HallSize: 1 }));
  };

// Inside UrbanLite2:
// formData.MonthlyOrOneTime === "Monthly"
// const estimatedPrice = useMemo(() => {
//   // Fix key mismatch for OneTime bookings
//   const bookingTypeKey = formData.MonthlyOrOneTime === "OneTime" ? "OneTime" : "Monthly";
//   const isMonthly = bookingTypeKey === "Monthly";
//   const unit = UNIT_PRICES[bookingTypeKey];

//   const days = isMonthly ? 30 * (formData.Months || 1) : 1;

//   let total = 0;

//   // --- Jhadu Pocha ---
//   if (formData.NoOfRooms || formData.NoOfKitchen || formData.HallSize) {
//     let jhaduFrequency = isMonthly 
//       ? (formData.WhichPlan === "Premium"
//         ? "Daily"
//         : formData.WhichPlan === "Standard"
//         ? "Alternate day"
//         : formData.JhaduFrequency || "Alternate day")
//       : "OneTime"; // Sentinel value for OneTime

//     // If not monthly, factor is 1 (for a single service visit). Otherwise, calculate based on plan/custom.
//     const jhaduFactor = isMonthly 
//       ? (jhaduFrequency === "Alternate day" ? 0.5 : 1)
//       : 1; 
//     
//     // Ensure numbers are non-negative
//     const rooms = Math.max(0, formData.NoOfRooms || 0);
//     const kitchen = Math.max(0, formData.NoOfKitchen || 0);
//     const hall = Math.max(0, formData.HallSize || 0);

//     total +=
//       (rooms * unit.room +
//         kitchen * unit.kitchen +
//         hall * unit.hall) *
//       jhaduFactor *
//       days;
//   }

//   // --- Toilet Cleaning ---
//   if (formData.NoOfToilets) {
//     let toiletFreq = isMonthly
//       ? (formData.WhichPlan === "Custom"
//         ? formData.FrequencyPerWeek || "Twice a week"
//         : "Twice a week")
//       : "OneTime"; // Sentinel value for OneTime

//     // If not monthly, factor is 1. Otherwise, calculate.
//     let toiletFactor = isMonthly ? 0 : 1;
//     if (isMonthly) {
//       if (toiletFreq === "Twice a week") toiletFactor = 2 / 7;
//       else if (toiletFreq === "Thrice a week") toiletFactor = 3 / 7;
//     }

//     total += Math.max(0, formData.NoOfToilets || 0) * unit.toilet * toiletFactor * days;
//   }

//   // --- Bartan Service ---
//   if (formData.AmountOfBartan) {
//     let bartanFreq = isMonthly 
//       ? (formData.WhichPlan === "Premium"
//         ? "Twice a day"
//         : formData.WhichPlan === "Standard"
//         ? "Once a day"
//         : formData.FrequencyPerDay || "Once a day")
//       : "OneTime"; // Sentinel value for OneTime

//     // If not monthly, factor is 1. Otherwise, calculate based on plan/custom.
//     const bartanFactor = isMonthly 
//       ? (bartanFreq === "Twice a day" ? 2 : 1)
//       : 1; 

//     total += Math.max(0, formData.AmountOfBartan || 0) * unit.bartan * bartanFactor * days;
//   }

//   return Math.round(total);
// }, [formData]);
const estimatedPrice = useMemo(() => {
    // Standard setup
    const bookingTypeKey = formData.MonthlyOrOneTime === "OneTime" ? "OneTime" : "Monthly";
    const isMonthly = bookingTypeKey === "Monthly";
    const unit = UNIT_PRICES.Monthly; // Access unit prices for add-ons
    const packageRates = UNIT_PRICES.Cleaning_Monthly; // Access Flat Package rates

    const days = isMonthly ? 30 * (formData.Months || 1) : 1;
    let total = 0;

    // --- 1. Jhadu Pocha Calculation ---
    // This allows calculation if a Flat Type is selected OR if rooms are entered
if (selectedFlatType !== "Custom" || formData.NoOfRooms || formData.NoOfKitchen || formData.HallSize) {
      
      // A. Determine Base Daily Price
      let dailyPrice = 0;
      if (selectedFlatType === "1BHK") dailyPrice = packageRates.bhk1;
      else if (selectedFlatType === "2BHK") dailyPrice = packageRates.bhk2;
      else if (selectedFlatType === "3BHK") dailyPrice = packageRates.bhk3;
      else if (selectedFlatType === "4BHK") dailyPrice = packageRates.bhk4;
      else {
         // Fallback for Custom: Default to 2BHK rate 
         dailyPrice = packageRates.bhk2; 
      }

      // B. Determine Factor (Daily vs Alternate)
      let jhaduFactor = 1.0; 
      
      const freq = formData.WhichPlan === "Standard" ? "Alternate day" : 
                   formData.WhichPlan === "Premium" ? "Daily" : 
                   formData.JhaduFrequency;

      if (isMonthly) {
          // CHANGE 0.85 TO 0.75 HERE
          if (freq === "Alternate day") jhaduFactor = 0.75; 
          
          // Daily stays 1.0
      }

      // C. Apply Price
      if (selectedFlatType !== "Custom") {
          total += dailyPrice * jhaduFactor;
      } else {
          // Custom Calculation (Granular)
          // We assume the unit.room/kitchen prices are for Daily, so we apply factor
          const rooms = Math.max(0, formData.NoOfRooms || 0);
          const kitchen = Math.max(0, formData.NoOfKitchen || 0);
          const hall = Math.max(0, formData.HallSize || 0);
          // Note: UNIT_PRICES.Monthly values (13, 15, 15) * 30 days ≈ Daily Package
          total += (rooms * unit.room + kitchen * unit.kitchen + hall * unit.hall) * days * jhaduFactor;
      }
    }

    // --- 2. Toilet Cleaning (Twice / Thrice a week) ---
    if (formData.NoOfToilets) {
      let toiletVisitsPerMonth = 0;
      
      // Determine Frequency
      const tFreq = isMonthly 
        ? (formData.WhichPlan === "Custom" ? formData.FrequencyPerWeek : "Twice a week")
        : "OneTime";

      if (isMonthly) {
          if (tFreq === "Twice a week") toiletVisitsPerMonth = 8;  // 4 weeks * 2
          if (tFreq === "Thrice a week") toiletVisitsPerMonth = 12; // 4 weeks * 3
      } else {
          toiletVisitsPerMonth = 1; // One time
      }

      // Calculation: Count * PricePerVisit * Visits
      total += Math.max(0, formData.NoOfToilets || 0) * unit.toilet * toiletVisitsPerMonth;
    }

    // --- 3. Bartan Service (Once / Twice a day) ---
    if (formData.AmountOfBartan) {
      let bartanVisitsPerMonth = 0;

      const bFreq = isMonthly 
        ? (formData.WhichPlan === "Premium" ? "Twice a day" : 
           formData.WhichPlan === "Standard" ? "Once a day" : 
           formData.FrequencyPerDay || "Once a day")
        : "OneTime";

      if (isMonthly) {
          if (bFreq === "Once a day") bartanVisitsPerMonth = 30;
          if (bFreq === "Twice a day") bartanVisitsPerMonth = 60;
      } else {
          bartanVisitsPerMonth = 1;
      }

      // Calculation: Count * PricePerUtensil * Visits
      // (Using unit.bartan which is ~1.5)
      total += Math.max(0, formData.AmountOfBartan || 0) * unit.bartan * bartanVisitsPerMonth;
    }

    // Final Month Multiplier
    // If we used flat package (total), we multiply by months. 
    // If we used custom (days), days already included 30*months.
    // To be safe: Calculate monthly total first, then multiply by months.
    // The logic above calculates ONE MONTH price (mostly). 
    
    // Let's normalize:
    // If Custom was used, 'days' was 30*Months. 
    // If Package was used, we added 'dailyPrice * factor' (which is 1 month).
    
    const months = Number(formData.Months) || 1;
    
    // If Custom, total is already full duration. If Package, total is 1 month.
    // Fix:
    if (selectedFlatType !== "Custom") {
        return Math.round(total * months);
    } else {
        return Math.round(total); // 'days' already had months factor
    }

  }, [formData, selectedFlatType]);

  const [submitting, setSubmitting] = useState(false);

  // CORE FRONTEND FIX: Prevent negative numbers
  const handleChange = (field, value) => {
    let finalValue = value;
    
    // If the field is one of the number fields, ensure it's non-negative
    if (["NoOfRooms", "NoOfKitchen", "HallSize", "NoOfToilets", "AmountOfBartan", "Months"].includes(field)) {
        // Use Math.max(0, ...) to force non-negative, and convert value to a number
        finalValue = Math.max(0, Number(value));
        
        // Handle case where input field is cleared (resulting in NaN). Set to 0.
        if (isNaN(finalValue)) {
            finalValue = 0;
        }
    }

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };


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
        // Ensure non-negative values are passed in the payload as well
      {
        WorkName: "Jhadu Pocha",
        NoOfRooms: Math.max(0, formData.NoOfRooms || 0),
        NoOfKitchen: Math.max(0, formData.NoOfKitchen || 0),
        HallSize: Math.max(0, formData.HallSize || 0),
        JhaduTimeSlot: formData.TimeSlot,
        JhaduFrequency: finalJhaduFrequency,
      },
      formData.NoOfToilets > 0 && {
        WorkName: "Toilet Cleaning",
        NoOfToilets: Math.max(0, formData.NoOfToilets || 0),
        FrequencyPerWeek: finalToiletFrequency,
      },
      formData.AmountOfBartan > 0 && {
        WorkName: "Bartan Service",
        AmountOfBartan: Math.max(0, formData.AmountOfBartan || 0),
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
                sweeping and mopping done with care and precision. A clean home, without the hassle.
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
            {/* <button
            type="button"
            className={`px-4 py-1 rounded-3xl ${
                formData.MonthlyOrOneTime === "OneTime"
                ? "bg-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleChange("MonthlyOrOneTime", "OneTime")}
            >
            One Time
            </button> */}
        </div>
        {/* Duration */}
        {formData.MonthlyOrOneTime === "Monthly" && (
            <div className="mb-6">
                <p className="font-semibold">Duration</p>
                <select
                value={formData.Months}
                onChange={(e) => handleChange("Months", e.target.value)}
                className="bg-gray-100 p-2 rounded-md"
                >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                </select>
            </div>
        )}

{/* --- NEW: Flat Type Selector --- */}
      {formData.MonthlyOrOneTime === "Monthly" && (
        <div className="mb-6">
          <p className="font-semibold mb-3">Select Flat Type</p>
          <div className="flex flex-wrap gap-3">
            {/* Custom Button */}
            <button
              type="button"
              onClick={() => handleFlatSelection("Custom")}
              className={`px-5 py-2 rounded-xl font-bold border transition-all ${
                selectedFlatType === "Custom"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Custom
            </button>

            {/* BHK Buttons */}
            {["1BHK", "2BHK", "3BHK", "4BHK"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleFlatSelection(type)}
                className={`px-5 py-2 rounded-xl font-bold border transition-all ${
                  selectedFlatType === type
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- CONDITIONAL INPUTS: Only show if "Custom" is selected --- */}
      {selectedFlatType === "Custom" && (
        <div className="grid md:grid-cols-3 gap-6 mb-6 animate-fade-in-down">
          <div>
            <p>Number of Rooms</p>
            <input
              type="number"
              min="0"
              value={formData.NoOfRooms}
              onChange={(e) => handleChange("NoOfRooms", e.target.value)}
              className="bg-gray-100 w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <p>Number of Kitchens</p>
            <input
              type="number"
              min="0"
              value={formData.NoOfKitchen}
              onChange={(e) => handleChange("NoOfKitchen", e.target.value)}
              className="bg-gray-100 w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <p>Number of Halls</p>
            <input
              type="number"
              min="0"
              value={formData.HallSize}
              onChange={(e) => handleChange("HallSize", e.target.value)}
              className="bg-gray-100 w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      )}
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
             min="0"
              value={formData.NoOfToilets}
              onChange={(e) => handleChange("NoOfToilets", e.target.value)}
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
             min="0"
              value={formData.AmountOfBartan}
              onChange={(e) => handleChange("AmountOfBartan", e.target.value)}
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
{formData.MonthlyOrOneTime === "Monthly" &&
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
}


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

        {/* 🛑 WRAP FINAL ELEMENTS IN A FRAGMENT */}
        <>
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
                {/* <button
                    type="button"
                    className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                    Pay
                </button> */}
            </div>
        </>
    </div>
  );
} 