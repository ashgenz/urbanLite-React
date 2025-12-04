// // firebase-config.js
// import { useState } from "react"; 
// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBR5YMQjoB1uTZTYH4vr7l3q1niM1zV3iA",
//   authDomain: "otpurbanlite.firebaseapp.com",
//   projectId: "otpurbanlite",
//   storageBucket: "otpurbanlite.firebasestorage.app",
//   messagingSenderId: "1089086917175",
//   appId: "1:1089086917175:web:533dc877ce8608cd50cdb2",
//   measurementId: "G-S9KKXZ50CS"
// };

// // Initialize Firebase
// // Setup Firebase
// const app = initializeApp(firebaseConfig);

// // Analytics (only if needed)
// // const analytics = getAnalytics(app); // ✅ only if you're using Google Analytics

// // Authentication
// const auth = getAuth(app); // ✅ use THIS for OTP, login, etc.



// function Firebase() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   const sendOtp = () => {
//     console.log("auth object:", auth);

//     if (!window.recaptchaVerifier) {
//       try {
//         window.recaptchaVerifier = new RecaptchaVerifier(
//           "recaptcha-container",
//           {
//             size: "invisible",
//             callback: (response) => {
//               console.log("reCAPTCHA solved", response);
//             },
//           },
//           auth
//         );

//         window.recaptchaVerifier.render().then((widgetId) => {
//           console.log("reCAPTCHA widget rendered with ID:", widgetId);
//           window.recaptchaWidgetId = widgetId;
//         });
//       } catch (err) {
//         console.error("reCAPTCHA init error", err);
//         alert("reCAPTCHA initialization failed: " + err.message);
//         return;
//       }
//     }

//     const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

//     signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier)
//       .then((result) => {
//         setConfirmationResult(result); // ✅ Store this to use later
//         alert("OTP sent!");
//       })
//       .catch((error) => {
//         console.error("OTP Error:", error);
//         alert("OTP send failed: " + error.message);
//       });
//   };

//   const verifyOtp = () => {
//     if (confirmationResult && otp) {
//       confirmationResult
//         .confirm(otp)
//         .then((res) => {
//           alert("Phone number verified!");
//           console.log(res.user);
//         })
//         .catch((err) => {
//           alert("Invalid OTP");
//         });
//     } else {
//       alert("Missing OTP or confirmationResult");
//     }
//   };

//   return (
//     <>
//       <div id="recaptcha-container"></div>

//       <div className="w-[450px] h-[12vw] flex flex-wrap">
        // <div className="ml-[3vw] py-[1vw]">
        //   <label>Name</label> <br />
        //   <input
        //     type="text"
        //     className="w-[13vw] px-[1vw] h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
        //   />
        // </div>

//         <div className="ml-[3vw] py-[1vw]">
//           <label>Phone Number</label> <br />
//           <input
//             type="tel"
//             placeholder="+91xxxxxxxxxx"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-[13vw] px-[1vw] h-[2vw] mt-[0vw] bg-[#efefef]"
//           />
//         </div>

//         <div className="ml-[3vw] py-[1vw]">
//           <label>OTP</label> <br />
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-[9vw] px-[1vw] h-[2vw] bg-[#efefef]"
//           />
//         </div>
//       </div>

//       <button
//         onClick={sendOtp}
//         className="text-blue-500 absolute top-[9vw] left-[11vw] hover:cursor-pointer"
//       >
//         Send OTP
//       </button>

//       <button
//         onClick={verifyOtp}
//         className="text-green-600 absolute top-[9vw] left-[20vw] hover:cursor-pointer"
//       >
//         Verify OTP
//       </button>
//     </>
//   );
// }





import React, { useState } from "react";
import axios from "axios";
import LocationPicker2, { seeMarker, setMarker3 } from "./LocationPicker2";
import { openCloseSignin } from "./Nav";
import {openCloseLogin} from './Nav';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { marker } from 'leaflet';


const OTP = () => {
  const [Name, setName] = useState("");
  const [marker2, setMarker2] = useState(false);
  const [marker, setMarker] = useState([null, null]);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [Password, setPass] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const API_KEY = import.meta.env.VITE_API;

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMarker2(true);
          setMarker3([pos.coords.latitude, pos.coords.longitude]);
          setMarker([pos.coords.latitude, pos.coords.longitude]);
        },
        () => alert("Location not available.")
      );
    }
  };

  const sendOtp = async () => {
    if (!phone) return alert("Enter a valid number");
    setLoading(true);
    try {
      const res = await axios.get(
        `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`
      );
      setSessionId(res.data.Details);
      alert("OTP Sent!");
    } catch (err) {
      alert("Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    setLoading(true);
    try {
      const res = await axios.get(
        `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );
      if (res.data.Details === "OTP Matched") setOtpVerified(true);
      else alert("Wrong OTP");
    } catch {
      alert("Verification failed");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!Name) return alert("Enter Name");
    if (!phone) return alert("Enter Phone");
    if (!Password) return alert("Create Password");
    if (!otpVerified) return alert("Verify OTP first");
    if (!seeMarker() && !marker2) return alert("Select a location");

    try {
      await axios.post("https://urbanlite-backends-vrv6.onrender.com/api/user/signin/", {
        Name,
        Phone: phone,
        location: { lat: marker[0], lng: marker[1] },
        Password,
      });
      alert("Saved!");
      openCloseSignin();
    } catch (err) {
      alert("Phone exists or failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-3">
      <div
        className="
        bg-white 
        w-full 
        max-w-[500px]    /* smaller width */
        rounded-xl 
        p-4              /* reduced padding */
        relative 
        shadow-lg 
        max-h-[85vh]     /* shorter modal */
        overflow-y-auto
        text-sm          /* smaller font size */
      "
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-xl"
          onClick={openCloseSignin}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">Create Account</h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Name */}
          <div>
            <label className="font-medium text-xs">Name</label>
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full p-2 mt-1 bg-gray-100 rounded-md text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium text-xs">Mobile Number</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter mobile"
              className="w-full p-2 mt-1 bg-gray-100 rounded-md text-sm"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="text-blue-600 text-xs underline mt-1"
            >
              Send OTP
            </button>
          </div>

          {/* OTP */}
          <div>
            <label className="font-medium text-xs">OTP</label>
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 mt-1 bg-gray-100 rounded-md text-sm"
              />
              {otpVerified && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-green-500 absolute right-3 top-3 text-sm"
                />
              )}
            </div>
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="text-green-600 text-xs underline mt-1"
            >
              Verify OTP
            </button>
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-xs">Password</label>
            <input
              type="text"
              value={Password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Create Password"
              className="w-full p-2 mt-1 bg-gray-100 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="mt-4">
          <p className="font-medium mb-1 text-xs">Location</p>

          <button
            onClick={getLocation}
            className="text-xs border px-2 py-1 rounded-md hover:bg-gray-100"
          >
            Find automatically
          </button>

          <span className="ml-2 text-xs text-gray-600">or select below</span>

          <div className="mt-2 border rounded-md overflow-hidden h-[200px] md:h-[180px]">
            <LocationPicker2 />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default OTP;
