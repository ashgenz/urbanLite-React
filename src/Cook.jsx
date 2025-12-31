import React, { useState,useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UNIT_PRICES } from "./priceConfig.js";
const API_BASE = "https://urbanlite-backends.onrender.com";
// const UNIT_PRICES = {
//   Monthly: {
//     meal: 25,     // ₹ per meal per person
//     naashta: 15,  // ₹ per naashta per person
//     bartan: 1,    // ₹ per utensil
//   },
//   "One Time": {
//     meal: 40,     // higher one-time rate
//     naashta: 20,
//     bartan: 2,
//   },
// };

import { useEffect } from "react";




export default function Cook({LoggedIn, heading }) {
  const navigate = useNavigate();

const [isCustomPeople, setIsCustomPeople] = useState(true);

  const [formData, setFormData] = useState({
    bookingId: `${Date.now().toString()}-${Math.random().toString(36).slice(2,8)}`,
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 },
    WorkName: "Cook Service",
    MonthlyOrOneTime: "Monthly",
    FrequencyPerDay: "Twice",
   AmountOfBartan: 0,  // 👈 default extra utensils
    Months: 1,
    IncludeNaashta: false,
    IncludeBartan: false,
    NoOfPeople: 4,
    TimeSlot1: "",
    TimeSlot2: "",
    Date: new Date(),
    address: "",
    WhichPlan: "Standard",
  });

  useEffect(() => {
  if (formData.MonthlyOrOneTime === "Trial Feast") {
    setFormData((p) => ({
      ...p,
      FrequencyPerDay: "Once",
      IncludeNaashta: false,
      IncludeBartan: false,
      Months: 1,
      WhichPlan: "Trial Feast",
    }));
  }
}, [formData.MonthlyOrOneTime]);

// --- NEW PRICING LOGIC HELPER ---
// --- NEW PRICING LOGIC HELPER ---
  const calculateTieredPrice = (peopleInput, hasNaashta, hasBartan, frequency, extraBartanInput) => {
    const people = Math.max(1, Number(peopleInput) || 1);
    let totalMonthly = 0;

    // 1. Food Cost (Lunch + Dinner)
    const foodTiers = UNIT_PRICES.Cook_Monthly;
    if (people === 1) totalMonthly += foodTiers.p1;
    else if (people === 2) totalMonthly += foodTiers.p2;
    else if (people === 3) totalMonthly += foodTiers.p3;
    else totalMonthly += people * foodTiers.per_head_bulk; 

    // 2. Naashta Cost
    if (hasNaashta) {
      const bfTiers = UNIT_PRICES.Cook_Breakfast;
      if (people === 1) totalMonthly += bfTiers.p1;
      else if (people === 2) totalMonthly += bfTiers.p2;
      else if (people === 3) totalMonthly += bfTiers.p3;
      else if (people === 4) totalMonthly += bfTiers.p4;
      else totalMonthly += people * bfTiers.per_head_bulk;
    }

    // 3. Base Bartan Cost (Meal Utensils Only)
    if (hasBartan) {
      const bTiers = UNIT_PRICES.Cook_Bartan;
      if (people === 1) totalMonthly += bTiers.p1;
      else if (people === 2) totalMonthly += bTiers.p2;
      else if (people === 3) totalMonthly += bTiers.p3;
      else if (people === 4) totalMonthly += bTiers.p4;
      else totalMonthly += people * bTiers.per_head_bulk;
    }

    // 4. Frequency Adjustment (For Service Only)
    // If "Once a day", charge 60% of the service cost
    if (frequency === "Once") {
      totalMonthly = totalMonthly * 0.6;
    }

    // 5. Extra Bartan Cost (Calculated Separately)
    // Logic: Count * Rate (1.5) * 30 Days
    if (hasBartan) {
        const extraCount = Number(extraBartanInput) || 0;
        const extraRate = UNIT_PRICES.Monthly.bartan; // ₹1.5
        const extraCostMonthly = extraCount * extraRate * 30; 
        
        totalMonthly += extraCostMonthly;
    }

    return Math.round(totalMonthly);
  };


  // const estimatedPrice = useMemo(() => {
  //   if (formData.MonthlyOrOneTime === "Trial Feast") {
  //   return 299;
  // }
  //   const unit = UNIT_PRICES[formData.MonthlyOrOneTime];
  //   const days =
  //     formData.MonthlyOrOneTime === "Monthly" ? 30 * formData.Months : 1;

  //   // --- Meals ---
  //   const mealsPerDay = formData.FrequencyPerDay === "Twice" ? 2 : 1;
  //   const mealCost = formData.NoOfPeople * mealsPerDay * unit.meal;

  //   // --- Naashta ---
  //   const naashtaCost = formData.IncludeNaashta
  //     ? formData.NoOfPeople * unit.naashta
  //     : 0;

  //   // --- Bartan ---
  //   let bartanCost = 0;
  //   if (formData.IncludeBartan) {
  //     // ✅ Bartan for meals
  //     const mealBartan = formData.NoOfPeople * mealsPerDay * unit.bartan;

  //     // ✅ Extra bartan entered by user
  //     const extraBartan =
  //       (Number(formData.AmountOfBartan) || 0) * unit.bartan;

  //     bartanCost = mealBartan + extraBartan;
  //   }

  //   // ✅ Final price
  //   return Math.round((mealCost + naashtaCost + bartanCost) * days);
  // }, [formData]);
const estimatedPrice = useMemo(() => {
    if (formData.MonthlyOrOneTime === "Trial Feast") {
      return 249;
    }

    const monthlyCost = calculateTieredPrice(
      formData.NoOfPeople,
      formData.IncludeNaashta,
      formData.IncludeBartan,
      formData.FrequencyPerDay,
      formData.AmountOfBartan // <--- Added this
    );

    const months = Number(formData.Months) || 1;
    return monthlyCost * months;
  }, [formData]);



  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };
// const calculatePriceForPeople = (people) => {
//   if (formData.MonthlyOrOneTime === "Trial Feast") return 299;

//   const unit = UNIT_PRICES[formData.MonthlyOrOneTime];
//   const days =
//     formData.MonthlyOrOneTime === "Monthly" ? 30 * formData.Months : 1;

//   const mealsPerDay = formData.FrequencyPerDay === "Twice" ? 2 : 1;

//   const mealCost = people * mealsPerDay * unit.meal;

//   const naashtaCost = formData.IncludeNaashta
//     ? people * unit.naashta
//     : 0;

//   let bartanCost = 0;
//   if (formData.IncludeBartan) {
//     const mealBartan = people * mealsPerDay * unit.bartan;
//     const extraBartan =
//       (Number(formData.AmountOfBartan) || 0) * unit.bartan;
//     bartanCost = mealBartan + extraBartan;
//   }

//   return Math.round((mealCost + naashtaCost + bartanCost) * days);
// };
const calculatePriceForPeople = (people) => {
    if (formData.MonthlyOrOneTime === "Trial Feast") return 299;

    const monthlyCost = calculateTieredPrice(
      people,
      formData.IncludeNaashta,
      formData.IncludeBartan,
      formData.FrequencyPerDay,
      formData.AmountOfBartan // <--- Added this
    );

    return monthlyCost * (Number(formData.Months) || 1);
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
  WhichPlan:
  formData.MonthlyOrOneTime === "Trial Feast"
    ? "Trial Feast"
    : formData.WhichPlan,
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
    console.log("Submitted data:", payload);
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
          <p className="italic text-gray-500">Description</p>
          <p className="italic text-gray-500">Our trained home cooks prepare fresh, hygienic, and delicious meals suited to your taste. From daily meals to special recipes, they handle everything—from chopping to cooking—so you enjoy homely food without the effort.</p>
        </div>
      </div>

      {/* Plan */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
{["Monthly", "Trial Feast"].map((type) => {
  const isTrial = type === "Trial Feast";
  const isActive = formData.MonthlyOrOneTime === type;

  return (
    <button
      key={type}
      type="button"
      onClick={() => handleChange("MonthlyOrOneTime", type)}
      className={`
        relative px-4 py-1 rounded-3xl transition-all duration-300
        ${isActive ? "bg-white" : "hover:bg-gray-200"}

        
      `}
    >
      {type}

      {/* 🔥 Small badge */}
      {isTrial  && (
        <span className="absolute -top-2 -right-2 text-[10px] bg-yellow-400 text-black px-2 py-[1px] rounded-full font-semibold">
          TRY
        </span>
      )}
    </button>
  );
})}


      </div>
{/* ✅ ADD THIS BLOCK: Polished Trial Info */}
      {formData.MonthlyOrOneTime === "Trial Feast" && (
        <div className="mb-6 bg-yellow-50 border border-yellow-400 p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-yellow-900 text-sm mb-3 flex items-center gap-2">
             ✨ 2-Day Trial Pack (₹249)
          </h3>
          
          <ul className="text-sm text-gray-800 space-y-2">
            <li className="flex items-start gap-2">
               <span className="text-yellow-600 mt-0.8">●</span>
               <span><strong>2 Consecutive Dinners:</strong> Cook visits today & tomorrow (Evening).</span>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-yellow-600 mt-1">●</span>
               <span><strong>Ingredients:</strong> You provide Atta, Veggies & Oil.</span>
            </li>
          </ul>

          
        </div>
      )}
      {/* Frequency */}
{formData.MonthlyOrOneTime !== "Trial Feast" && (
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
)}


      {/* People */}
{/* People Selection – Horizontal Pills */}
{formData.MonthlyOrOneTime === "Monthly" && (
  <div className="mb-6">
    <p className="font-semibold mb-3">How many people’s meals?</p>

    <div className="flex gap-3 bg-gray-100 p-2 rounded-3xl w-fit">
      {[1, 2, 3].map((count) => {
        const isActive = formData.NoOfPeople === count;

        return (
          <button
            key={count}
            type="button"
            onClick={() => {handleChange("NoOfPeople", count)
               setIsCustomPeople(false);
            }}
            className={`
              relative px-4 py-2 rounded-3xl transition-all duration-300
              ${isActive ? "bg-white shadow" : "hover:bg-gray-200"}
            `}
          >
            <div className="text-sm font-medium">{count} Person</div>
            <div className="text-xs text-purple-700 font-semibold">
              ₹{calculatePriceForPeople(count)}
            </div>
          </button>
        );
      })}

      {/* 4+ */}
<button
  type="button"
  onClick={() => {
    setIsCustomPeople(true);
    handleChange("NoOfPeople", 4);
  }}
  className={`
    relative px-4 py-2 rounded-3xl transition-all duration-300
    ${isCustomPeople ? "bg-white shadow" : "hover:bg-gray-200"}
  `}
>
  <div className="text-sm font-medium">4 or more</div>
  <div className="text-xs text-purple-700 font-semibold">
    ₹{calculatePriceForPeople(Math.max(formData.NoOfPeople || 4, 4))}
  </div>
</button>

    </div>
          <i>(1400 per person - for 4 or more people)</i>

    {/* Input only when 4+ */}
{isCustomPeople && (
  <div className="mt-3">
    <label className="block mb-1 text-sm text-gray-600">
      Enter exact number
    </label>
    <input
      type="number"
      min={4}
      value={formData.NoOfPeople === "" ? "" : formData.NoOfPeople}
      onChange={(e) => {
        const val = e.target.value;

        // allow empty while typing
        if (val === "") {
          handleChange("NoOfPeople", "");
          return;
        }

        handleChange("NoOfPeople", Math.max(4, Number(val)));
      }}
      className="bg-gray-100 p-2 rounded-md w-32"
    />
  </div>
)}

  </div>
)}



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
{formData.MonthlyOrOneTime !== "Trial Feast" && (
  <div className="mb-6">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={formData.IncludeNaashta}
        onChange={(e) =>
          handleChange("IncludeNaashta", e.target.checked)
        }
      />
      <span>Include Naashta (Breakfast)</span>
    </div>

    <div className="flex items-center gap-2 mt-2">
      <input
        type="checkbox"
        checked={formData.IncludeBartan}
        onChange={(e) =>
          handleChange("IncludeBartan", e.target.checked)
        }
      />
      <span>Include Bartan Cleaning</span>
    </div>
  </div>
)}

      

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
  <p className="font-semibold">
    {formData.MonthlyOrOneTime === "Trial Feast"
      ? "Date"
      : "Prebook Start Date"}
  </p>

  <input
    type="date"
    min={new Date().toISOString().split("T")[0]} // Restricts past dates
    value={new Date(formData.Date).toISOString().split("T")[0]}
    onChange={(e) =>
      handleChange("Date", new Date(e.target.value))
    }
    className="bg-gray-100 p-2 rounded-md"
  />
</div>


      {/* Location */}
      <div className="mt-6">
        <p className="font-semibold">Confirm Location</p>
        <input type="text" placeholder="Enter address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className="bg-gray-100 p-2 rounded-md w-full" />
      </div>
<p className="mt-4 font-semibold text-purple-700">
  Price: ₹{estimatedPrice}
</p>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleSubmit} disabled={submitting} className={`px-4 py-2 rounded-lg text-white ${submitting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"}`}>{submitting ? "Booking..." : "Book"}</button>
        {/* <button type="button" className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Pay</button> */}
        
      </div>
      {/* Money Back Highlight */}
      {formData.MonthlyOrOneTime === "Trial Feast" && 
          <div className="mt-3 bg-white border border-dashed p-2 rounded-lg flex items-center gap-2">
             <span className="text-lg">💰</span>
             
<p className="text-xs font-bold leading-tight text-amber-900">
  100% ADJUSTABLE: <span className="font-normal text-gray-700">This fee is adjustable, the 2 meals will be adjusted to yo monthly bill, if you upgrade to Monthly.</span>
</p>

             
            
          </div>}
    </div>
  );
}
