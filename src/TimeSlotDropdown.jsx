import React, { useState } from 'react';

function TimeSlotDropdown() {
  const [selectedTime, setSelectedTime] = useState('');

  // Convert a number like 540 (minutes) to "09:00 AM"
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${String(displayHrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
  };

  const generateTimeSlots = (start, end, step) => {
    const slots = [];
    for (let minutes = start; minutes + step <= end; minutes += step) {
      const from = formatTime(minutes);
      slots.push({ value: `${minutes}`, label: `${from}`});
    }
    return slots;
  };

  const slots = generateTimeSlots(7 * 60, 19 * 60, 30); // 9:00 AM to 6:00 PM, 30 min slots

  return (
    <div className="p-4">
      <label htmlFor="timeSlot" className="absolute top-[40vw] left-[30vw] block mb-2 font-medium">Select a Time Slot:</label>
      <select
        id="timeSlot"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="absolute top-[42vw] left-[30vw] h-[2.8vw] w-[15vw] rounded-md bg-[#f0f0f0]"
      >
        <option value="">-- Choose a slot --</option>
        {slots.map((slot, index) => (
          <option key={index} value={slot.value}>
            {slot.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeSlotDropdown;
