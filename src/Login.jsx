import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { openCloseLogin } from "./Nav";

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
      const res = await axios.post("http://localhost:4000/api/user/login/", {
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

    //handle submit
      const handleSubmit = async () => {
        if (!Phone) return alert("✍️ Please enter phone Number");
        if (!Password) return alert("✍️ Please create a Password");
    
      try {
        const response = await axios.post("https://urbanlite-backends-vrv6.onrender.com:4000/api/user/login/", {
          Phone: Phone.trim(),
          Password:Password.trim()
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
      await axios.post("http://localhost:4000/api/user/forgot-password/reset-password", {
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
    <div className="relative w-[26vw] ml-[2.3vw] mt-[2.3vw]">
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
              className="bg-[#efefef] w-[60vw] md:w-[18vw] h-[2vw] mt-[0.5vw]"
            />
            <br />
            <label>Password</label> <br />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#efefef] w-[60vw] md:w-[18vw] h-[2vw] mt-[0.5vw]"
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
              className="bg-[#8956FF] rounded-lg mt-[1vw] px-[1vw] py-[0.4vw] text-white hover:bg-[#9060ff]"
            >
              Login
            </button>
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
                className="bg-[#efefef] w-[60vw] md:w-[18vw] h-[2vw] mt-[0.5vw]"
              />
            )}
            {step === 2 && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#efefef] w-[60vw] md:w-[18vw] h-[2vw] mt-[0.5vw]"
              />
            )}
            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#efefef] w-[60vw] md:w-[18vw] h-[2vw] mt-[0.5vw]"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="bg-[#efefef] w-[60vw] md:w-[18vw] h-[2vw] mt-[0.5vw]"
                />
              </>
            )}

            <div className="flex gap-2 mt-[1vw]">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="border px-[1vw] py-[0.4vw] rounded-lg"
                >
                  Back
                </button>
              )}
              <button
                onClick={
                  step === 1 ? sendOtp : step === 2 ? verifyOtp : resetPassword
                }
                className="bg-[#8956FF] rounded-lg px-[1vw] py-[0.4vw] text-white hover:bg-[#9060ff]"
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

        {/* Normal Login */}
        <div  className="w-[450px] ml-[2vw] mt-[6vw] md:mt-[1vw]  h-[12vw] flex flex-wrap">
        <div className="ml-[3vw] py-[1vw]">
          <label>Mobile number</label> <br />
          <input
            type="text"
            placeholder='Enter Your Name'
            value={Phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="h-[8vw] w-[60vw] md:w-[18vw] px-[1vw] md:h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
          />
        </div>
        <br />
        <div className="ml-[3vw] py-[2vw] mt-[6vw] md:mt-0">
          <label>Password</label> <br />
          <input
            type="text"
            placeholder='Enter Your Name'
            value={Password} 
            onChange={(e) => setPass(e.target.value)}
            className="h-[8vw] w-[60vw] md:w-[18vw] px-[1vw] md:h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
          />
        </div>
        </div>
      <button onClick={handleSubmit} className='bg-[#8956FF]  rounded-lg px-[30vw] md:px-[1vw] py-[2vw] md:py-[0.4vw] ml-[1.5vw] text-[4.2vw] md:text-[1vw] absolute bottom-[0.8vw] w-[90%] hover:bg-[#9060ff] hover:cursor-pointer hover:border-[1px]  '>Submit</button>
        <span className='material-symbols-outlined absolute top-[0.3vw] right-[0.3vw] hover:cursor-pointer' onClick={openCloseLogin}>
       close
        </span>
    </>
}
