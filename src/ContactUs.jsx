import { useState } from "react";
import axios from "axios";

export default function ContactUs({ LoggedIn, userName }) { // optionally pass name
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.post(
        "https://urbanlite-backends-vrv6.onrender.com/api/user/contact",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("✅ Message sent successfully!");
      setMessage("");
    } catch (err) {
      console.error("Message send error:", err);
      setError(err.response?.data?.message || err.message || "Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!LoggedIn)
    return <p className="text-red-500 text-center mt-20">Please log in first to contact us.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <p className="mt-4 text-gray-600">
          Have questions, ideas, or feedback for Urbanlite? We’d love to hear from you.
          Fill out the form below and our team will get back to you soon.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            You can reach us through the form and our team will respond to your account.
          </p>
          <ul className="space-y-4">
            <li>
              <span className="font-semibold text-gray-800">Address:</span> Urbanlite HQ, Jaipur, Rajasthan, India
            </li>
          </ul>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={userName || ""}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Message: <i>detailed Issue/bugs</i>
            </label>
            <textarea
              placeholder="Write your message..."
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            ></textarea>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
