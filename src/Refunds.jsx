export default function Refunds() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      {/* Header */}
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Refund & Cancellation Policy</h1>
        <p className="mt-4 text-gray-600">
          At Urbanlite, we aim to provide the best possible service experience. 
          Please read our refund and cancellation terms carefully before booking.
        </p>
      </div>

      {/* Policy */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 space-y-6 text-gray-700 leading-relaxed">
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Cancellation Terms</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>You may cancel any booked service from the “Current Bookings” section before the assigned gig worker arrives at your location.</li>
            <li>If a gig worker has already been allocated at the time of cancellation, a <b>₹50 cancellation fee</b> will be deducted from your refund.</li>
            <li>If you cancel after the gig worker has reached your location, <b>an additional commute charge</b> will apply along with the ₹50 cancellation fee.</li>
            <li>No cancellations are allowed once the service is in progress or completed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Refund Terms</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Refunds will be processed to the same payment account used for booking.</li>
            <li>Refunds are initiated within <strong>4-7 working days</strong> from the date of approval.</li>
            <li>If Urbanlite is unable to meet the agreed service requirements from our end, you will receive a full refund within the same 4-7 working days timeframe.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Non-Refundable Cases</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Service already in progress or completed.</li>
            <li>No-show from the customer’s side after the gig worker’s arrival.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Contact Support</h2>
          <p>
            For any queries related to cancellations or refunds, please reach out to us at{" "}
            <a href="mailto:urbanliteservices@gmail.com" className="text-blue-600 hover:underline">
              urbanliteservices@gmail.com
            </a>{" "}
            {/* or call{" "}
            <a href="tel:+919876543210" className="text-blue-600 hover:underline">
              +91 98765 43210
            </a>. */}
          </p>
        </section>
      </div>
    </div>
  );
}
