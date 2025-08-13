import axios from "axios";
import { openCloseLogin } from "./Nav"
import { useState } from "react";

export default function Login({ LoggedIn, setLoggedIn }){


      const [Phone, setPhone] = useState('');
      const [Password, setPass] = useState('');

    //handle submit
      const handleSubmit = async () => {
        if (!Phone) return alert("✍️ Please enter phone Number");
        if (!Password) return alert("✍️ Please create a Password");
    
      try {
        const response = await axios.post("http://localhost:4000/api/user/login/", {
          Phone: Phone.trim(),
          Password:Password.trim()
        });

      localStorage.setItem('token', response.data.token);

      // update parent state
      setLoggedIn(true);

      alert("🎉 Logged in successfully!");
      openCloseLogin();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("⚠️unable to login");
      } else if(err.response.status === 401){
        console.error(err);
        alert("❌mobile number is not logged in yet");
      }
      else if(err.response.status === 403){
        console.error(err);
        alert("❌wrong Password");
      }
    }
    };


    return <>
        {/* OAuth - Email */}

        {/* Normal Login */}
        <div  className="w-[450px] ml-[2vw] mt-[1vw]  h-[12vw] flex flex-wrap">
        <div className="ml-[3vw] py-[1vw]">
          <label>Mobile number</label> <br />
          <input
            type="text"
            placeholder='Enter Your Name'
            value={Phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="w-[18vw] px-[1vw] h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
          />
        </div>
        <div className="ml-[3vw] py-[2vw]">
          <label>Password</label> <br />
          <input
            type="text"
            placeholder='Enter Your Name'
            value={Password} 
            onChange={(e) => setPass(e.target.value)}
            className="w-[18vw] px-[1vw] h-[2vw] mt-[0.5vw] bg-[#efefef] mr-[5vw]"
          />
        </div>
        </div>
      <button onClick={handleSubmit} className='bg-[#8956FF]  rounded-lg px-[1vw] py-[0.4vw] ml-[1.5vw] text-[1vw] absolute bottom-[0.8vw] w-[90%] hover:bg-[#9060ff] hover:cursor-pointer hover:border-[1px]  '>Submit</button>
        <span className='material-symbols-outlined absolute top-[0.3vw] right-[0.3vw] hover:cursor-pointer' onClick={openCloseLogin}>
       close
        </span>
    </>
}