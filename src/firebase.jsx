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






 
//   export default Firebase

import React, { useState } from 'react';
import axios from 'axios';
import LocationPicker2 from './LocationPicker2';
import {seeMarker,setMarker3} from './LocationPicker2';
import {openCloseSignin} from './Nav';
import {openCloseLogin} from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from  '@fortawesome/free-solid-svg-icons';
import { marker } from 'leaflet';


const OTP = () => {
    const [Name, setName] = useState("");
    const [marker2,setMarker2]=useState(false)
    const [marker,setMarker]=useState([null,null]);

    
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [Password, setPass] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);


const [otpVerified, setOtpVerified] = useState(true);  // As fixed earlier
    const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          setMarker2(true)
          setMarker3([position.coords.latitude,position.coords.longitude])
          setMarker([position.coords.latitude,position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access denied or unavailable.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser, select the location manually.");
    }
  };

  //handle submit
  const handleSubmit = async () => {
    if (!Name) return alert("✍️ Please enter name");
    if (!phone) return alert("✍️ Please enter phone Number");
    if (!Password) return alert("✍️ Please create a Password");
    if (!otpVerified) return alert("✅ Please verify OTP first");
    if (!seeMarker() && !marker2 ) return alert("📍 Please select a location");

  try {
    const response = await axios.post("http://localhost:4000/api/user/signin/", {
      Name: Name.trim(),
      Phone: phone.trim(),
      location: {
        lat: marker[0],
        lng: marker[1],
      },
      Password:Password.trim()
    });

    alert("🎉 Data saved to MongoDB successfully!");
    openCloseSignin(); // Close login modal only on successful new save
  
} catch (err) {
  if (err.response && err.response.status === 409) {
    console.log(err);
    alert("⚠️ Phone Number exists in the database.");
  } else {
    console.error(err);
    alert("❌ Failed to save data. Please try again.");
  }
}
};




  const API_KEY = import.meta.env.VITE_API;

  const sendOtp = async () => {
    if (!phone) return alert('📱 Enter a valid phone number');
    setLoading(true);
    try {
      const res = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`);
      setSessionId(res.data.Details);
      alert('📤 OTP sent!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert('🔐 Enter OTP to verify');
    setLoading(true);



    try {
      const res = await axios.get(
        `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );


          if (res.data.Details === 'OTP Matched') {
  setOtpVerified(true); // ✅ Set it true after successful verification
} else {
  alert('❌ OTP Incorrect!');
}
    } catch (err) {
      console.error(err);
      alert('❌ OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div  className="w-[450px] h-[12vw] flex flex-wrap">
        <div className="ml-[3vw] py-[1vw]">
          <label>Name</label> <br />
          <input
            type="text"
            placeholder='Enter Your Name'
            value={Name}
            onChange={(e) => setName(e.target.value)}
            className="w-[13vw] px-[1vw] h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
          />
        </div>
      {/* <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-[13vw] px-[1vw] h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
        
      /> */}
        <div className="ml-[3vw] py-[1vw]">
          <label>Mobile Number</label> <br />
          <input
            type="number"
            placeholder="enter Mobile number"
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="w-[13vw] px-[1vw] h-[2vw] mt-[0vw] bg-[#efefef]"
          />
        </div>

      <button className="text-blue-500 text-[0.9vw] absolute top-[11vw] px-[0.5vw] left-[11vw] rounded-md hover:cursor-pointer hover:bg-[#e8e8e8] "
       onClick={sendOtp} disabled={loading}>Send OTP</button>

      {/* <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        
      /> */}

       <div className="ml-[3vw] py-[1vw]">
          <label>OTP</label> <br />
           <input
             type="text"
             placeholder="Enter OTP"
             value={otp}
             onChange={(e) => setOtp(e.target.value)}
             className="w-[9vw] px-[1vw] h-[2vw] bg-[#efefef]"
           />
        </div>
          {/* Password */}
          <div className="ml-[3vw] py-[1vw]">
          <label>Password</label> <br />
          <input
            type="text"
            placeholder='Create Password'
            value={Password}
             onChange={(e) => setPass(e.target.value)}
            className="w-[13vw] px-[1vw] h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
          />
        </div>


        {otpVerified && (<FontAwesomeIcon icon={faCheck} style={{ color: "#03e21d" }}  className='absolute top-[9.35vw] left-[26.5vw]'/>)}
      <button 
      className="text-green-600 absolute top-[11vw] text-[0.9vw] px-[0.5vw] rounded-md left-[23vw] hover:cursor-pointer hover:bg-[#e8e8e8]"
      onClick={verifyOtp} disabled={loading}>Verify OTP</button>
    </div>
          <p className='absolute top-[18.6vw] ml-[1vw]' >Location</p>
      <div className='-z-10 mx-auto  bg-white shadow absolute bottom-[3.8vw] h-[16.5vw] w-[26.5vw] ml-[1.5vw] border-black border-[1px] rounded-md'>
             <LocationPicker2/>
      </div>
            
      <button className='absolute top-[18.8vw] ml-[6vw] bg-[#ffffff] rounded-lg px-[1vw]  hover:cursor-pointer hover:border-[1px] ' onClick={getLocation}>find automatically</button>
      <p className='text-[0.8vw] top-[19vw] left-[16.5vw] absolute'>or  Select below</p>
      <button onClick={handleSubmit} className='bg-[#8956FF]  rounded-lg px-[1vw] py-[0.4vw] ml-[1.5vw] text-[1vw] absolute bottom-[0.8vw] w-[90%] hover:bg-[#9060ff] hover:cursor-pointer hover:border-[1px]  '>Submit</button>
        <span className='material-symbols-outlined absolute top-[0.3vw] right-[0.3vw] hover:cursor-pointer' onClick={openCloseSignin}>
        close
        </span>
    </>
  );
};

export default OTP;
