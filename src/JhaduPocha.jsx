import TimeSlotDropdown from "./TimeSlotDropdown";

export default function JhaduPocha({ heading }) {
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
        <button className="bg-white px-4 py-1 rounded-3xl">Monthly</button>
        <button className="px-4 py-1 rounded-3xl hover:bg-gray-200">One Time</button>
      </div>

      {/* Room, Kitchen, Hall */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <p>Number of Rooms</p>
          <input
            type="number"
            className="bg-gray-100 w-full p-2 rounded-md"
          />
        </div>
        <div>
          <p>Number of Kitchens</p>
          <input
            type="number"
            className="bg-gray-100 w-full p-2 rounded-md"
          />
        </div>
        <div>
          <p>Hall Size</p>
          <input
            type="number"
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
              <input type="checkbox" className="w-4 h-4" />
              Toilet Cleaning
            </label>
            <p className="mt-1">Number of Toilets</p>
            <input
              type="number"
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Bartan Cleaning
            </label>
            <p className="mt-1">Amount of Bartan</p>
            <input
              type="number"
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>
        </div>
      </div>

      {/* Time Slot */}
      <TimeSlotDropdown />

      {/* Prebook */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Selection</p>
        <label className="block mt-2">Select Date:</label>
        <input
          type="date"
          className="bg-gray-100 p-2 rounded-md"
        />
      </div>

      {/* Location */}
      <div className="mt-6">
        <p className="font-semibold">Confirm Location of Work</p>
        <input
          type="text"
          className="bg-gray-100 p-2 rounded-md w-full"
        />
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <button className="bg-gray-100 p-4 rounded-lg text-left hover:bg-gray-200">
          <h1 className="font-bold mb-2">Standard Plan</h1>
          <ul className="list-disc list-inside">
            <li>Jadhu pocha: Alternate day</li>
            <li>Toilet: Twice a week</li>
            <li>Bartan: Daily once</li>
          </ul>
        </button>
        <button className="bg-gray-100 p-4 rounded-lg text-left hover:bg-gray-200">
          <h1 className="font-bold mb-2">Premium Plan</h1>
          <ul className="list-disc list-inside">
            <li>Jadhu pocha: Daily</li>
            <li>Toilet: Twice a week</li>
            <li>Bartan: Daily twice</li>
          </ul>
        </button>
        <button className="bg-gray-100 p-4 rounded-lg text-left hover:bg-gray-200">
          <h1 className="font-bold mb-2">Custom Plan</h1>
          <ul className="list-disc list-inside">
            <li>Jadhu pocha: Flexible</li>
            <li>Toilet: Flexible</li>
            <li>Bartan: Flexible</li>
          </ul>
        </button>
      </div>

      {/* Extra Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Estimated duration: </p>
        <p>No. of workers: </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
          Book
        </button>
        <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
          Pay
        </button>
      </div>
    </div>
  );
}
