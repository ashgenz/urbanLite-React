export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      {/* Header */}
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Terms & Conditions</h1>
        <p className="mt-4 text-gray-600">
          Welcome to Urbanlite. By booking or using our services, you agree to the terms outlined below.
          Please read them carefully.
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 space-y-6 text-gray-700 leading-relaxed">
        
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Scope of Services</h2>
          <p>
            Urbanlite offers gig worker and blue-collar job services in multiple fields, 
            starting with home services. We currently operate only within Jaipur, Rajasthan. 
            Services are provided by independent gig workers connected via our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Eligibility</h2>
          <p>
            Customers must be at least 12 years of age to book or use Urbanlite services. 
            By booking, you confirm that you meet this requirement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Customer Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Provide accurate booking details, including service type, address, and preferred time.</li>
            <li>Ensure that the service location is safe and accessible for the gig worker.</li>
            <li>Be available at the booked time to receive the worker and facilitate the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Worker Arrival</h2>
          <p>
            Urbanlite will provide an estimated arrival time for each booking. Delays may occur due to traffic, 
            weather, or unforeseen circumstances. Gig workers reserve the right to refuse service 
            if the location is unsafe, inaccessible, or unsuitable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Payments</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Payments can be made via UPI or cash.</li>
            <li>Full payment is due after the service is completed.</li>
            <li>Advance payment is only required for reserving a booking for a future date.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Service Quality</h2>
          <p>
            We aim to deliver the best possible customer experience. However, as Urbanlite is in its early stages,
            service quality may vary. We appreciate your understanding and feedback as we improve.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Liability</h2>
          <p>
            Urbanlite is not liable for any damages, losses, or accidents that may occur during or after 
            the service. However, we are open to assisting customers in resolving such issues 
            through support channels.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Account Suspension</h2>
          <p>
            Urbanlite reserves the right to suspend or ban any user account in cases of misuse, 
            harasmdent, fraudulent activity, or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Changes to Terms</h2>
          <p>
            Urbanlite may update or modify these Terms & Conditions at any time. Changes will be 
            effective immediately upon posting on our platform. Continued use of our services 
            after changes means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">10. Contact Us</h2>
          <p>
            For questions about these Terms & Conditions, please contact us at{" "}
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
