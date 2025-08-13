export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      {/* Header */}
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="mt-4 text-gray-600">
          Have questions, ideas, or feedback for Urbanlite? We’d love to hear from you. 
          Fill out the form below and our team will get back to you soon.
        </p>
      </div>

      {/* Contact Card */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            You can reach us through the form or directly via the details below:
          </p>
          <ul className="space-y-4">
            <li>
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              <a href="mailto:hello@urbanlite.com" className="text-blue-600 hover:underline">
                urbanliteservices@gmail.com
              </a>
            </li>
            {/* <li>
              <span className="font-semibold text-gray-800">Phone:</span>{" "}
              <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                +91 98765 43210
              </a>
            </li> */}
            <li>
              <span className="font-semibold text-gray-800">Address:</span> Urbanlite HQ,
              Jaipur, Rajasthan, India
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              placeholder="Write your message..."
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
