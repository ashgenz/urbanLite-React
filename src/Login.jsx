import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { openCloseLogin } from "./Nav";
import { openCloseSignin } from "./Nav";

export default function Login({ LoggedIn, setLoggedIn }) {
  const [mode, setMode] = useState("login"); // login | forgot
  const [step, setStep] = useState(1); // forgot: 1=send OTP, 2=verify, 3=reset
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sessionId, setSessionId] = useState("");
  const API_KEY = import.meta.env.VITE_API;

  // --------------- LOGIN HANDLER -----------------
  const handleLogin = async () => {
    if (!phone || !password) return alert("Enter phone & password");
    try {
      const res = await axios.post("https://urbanlite-backends-vrv6.onrender.com/api/user/login/", {
        Phone: phone.trim(),
        Password: password.trim(),
      });
      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);
      alert("✅ Logged in successfully!");
      openCloseLogin();
    } catch (err) {
      alert("❌ Invalid credentials or user not found");
    }
  };

  // --------------- FORGOT PASSWORD FLOW -----------------
const sendOtp = async () => {
  if (!phone) return alert("Enter mobile number");

  try {
    // 1️⃣ Check if user exists first before sending OTP
    const exists = await axios.post("https://urbanlite-backends-vrv6.onrender.com/api/user/check-phone", {
      phone: phone.trim(),
    });

    if (!exists.data.exists) {
      alert("❌ This mobile number is not registered!");
      return;
    }

    // 2️⃣ If user exists, then send OTP
    const res = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`
    );
    setSessionId(res.data.Details);
    setStep(2);
    alert("OTP sent!");
  } catch (err) {
    console.error(err);
    alert("Error sending OTP");
  }
};

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const res = await axios.get(
        `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );
      if (res.data.Details === "OTP Matched") {
        alert("OTP Verified!");
        setStep(3);
      } else alert("Invalid OTP");
    } catch {
      alert("OTP verification failed");
    }
  };

  const resetPassword = async () => {
    if (!password || password.length < 6)
      return alert("Password must be ≥ 6 characters");
    if (password !== confirm)
      return alert("Passwords do not match!");

    try {
      await axios.post("https://urbanlite-backends-vrv6.onrender.com/api/user/forgot-password/reset-password", {
        phone: phone.trim(),
        newPassword: password.trim(),
      });
      alert("✅ Password reset successful! Please log in.");
      setMode("login");
      setStep(1);
      setPassword("");
      setConfirm("");
      setOtp("");
    } catch {
      alert("Error resetting password.");
    }
  };

  // --------------- UI -----------------
  const transition = { duration: 0.3, ease: "easeInOut" };

  return (
    <div className="relative w-[90%] mx-auto mt-4 md:w-[26vw] md:ml-[2.3vw] md:mt-[2.3vw]">
      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <motion.div
            key="login"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={transition}
          >
            <label>Mobile Number</label> <br />
            <input
              type="text"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#efefef] w-full md:w-[18vw] h-10 md:h-[2vw] px-3 rounded-md mt-2 text-base"
            />
            <br />
            <label>Password</label> <br />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#efefef] w-full md:w-[18vw] h-10 md:h-[2vw] px-3 rounded-md mt-2 text-base"
            />
            
            <div
              className="text-xs text-[#8956FF] hover:underline cursor-pointer mt-[0.5vw]"
              onClick={() => {
                setMode("forgot");
                setStep(1);
              }}
            >
              Forgot Password?
            </div>
            <button
              onClick={handleLogin}
              className="bg-[#8956FF] rounded-lg mt-4 px-4 py-2 text-white text-base w-full md:w-auto"

            >
              Login
            </button>
            <button
            onClick={() => {  openCloseLogin(); openCloseSignin(); }}
            className="mt-[15px] bg-[#eaeaea]"
            >don't have an account?</button>
          </motion.div>
        ) : (
          <motion.div
            key="forgot"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={transition}
          >
            <label>
              {step === 1
                ? "Mobile Number"
                : step === 2
                ? "Enter OTP"
                : "Enter New Password"}
            </label>
            <br />
            {step === 1 && (
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#efefef] w-full md:w-[18vw] h-10 md:h-[2vw] px-3 rounded-md mt-2 text-base"
              />
            )}
            {step === 2 && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#efefef] w-full md:w-[18vw] h-10 md:h-[2vw] px-3 rounded-md mt-2 text-base"
              />
            )}
            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#efefef] w-full md:w-[18vw] h-10 md:h-[2vw] px-3 rounded-md mt-2 text-base"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="bg-[#efefef] w-full md:w-[18vw] h-10 md:h-[2vw] px-3 rounded-md mt-2 text-base"
                />
              </>
            )}

            <div className="flex gap-2 mt-[1vw]">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="border px-4 py-2 rounded-lg text-base w-full md:w-auto"


                >
                  Back
                </button>
              )}
              <button
                onClick={
                  step === 1 ? sendOtp : step === 2 ? verifyOtp : resetPassword
                }
                className="border px-4 py-2 rounded-lg text-base w-full md:w-auto"


              >
                {step === 1
                  ? "Send OTP"
                  : step === 2
                  ? "Verify OTP"
                  : "Reset Password"}
              </button>
            </div>

            <div
              className="text-xs text-[#8956FF] mt-[1vw] hover:underline cursor-pointer"
              onClick={() => setMode("login")}
            >
              Back to Login
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span
        className="material-symbols-outlined absolute -top-4 right-2 text-3xl md:text-xl"

        onClick={openCloseLogin}
      >
        close
      </span>
    </div>
  );
}
