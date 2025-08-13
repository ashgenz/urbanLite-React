import { Link } from "react-router-dom"
// import { openCloseLogin } from "./Gpt"
// import { openCloseSignin } from "./Gpt"
import { useState,useEffect } from "react"
import Firebase from "./firebase"
import Login from "./Login"
import axios from "axios"
let openCloseSignin;
let openCloseLogin;


export default function Nav({ LoggedIn, setLoggedIn }){
  //logout handle
  
    const handleLogout = () => {
    localStorage.removeItem('token'); // delete the stored token
    setLoggedIn(false); // update UI immediately
    // optional redirect
    // navigate('/'); // if using react-router's useNavigate
    alert("logout successful")
  };

  //verify Token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setLoggedIn(true); // triggers re-render instantly
        
      } catch (err) {
        console.error(err.response?.data || err.message);
        setLoggedIn(false);
        alert("log in failure");
      }
    };

    verifyToken();
  }, []);


    //close Login
    const [SigninOpenClose,setClose1]=useState(false);
    const [loginOpenClose,setClose2]=useState(false);
    openCloseSignin=function(){
      setClose1(!SigninOpenClose)
    }
    openCloseLogin=function(){
      setClose2(!loginOpenClose)
    }
    return <div className="static">
        {/* Header */}
     <div className="w-full h-[3.5vw] bg-black  top-0 left-0 z-10">
        <Link to="/">
        <p className="absolute text-white font-bold text-[1.8vw] left-[40px] top-[0.5vw]">UrbanLite</p>
        </Link>
        <Link to="/">
        <p className='text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[30vw]' style={{fontFamily: 'sans-serif'}}>Services</p>
        </Link>
        <p className='text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[46vw]' style={{fontFamily: 'sans-serif'}}>About us</p>
        <p className='text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[38vw]' style={{fontFamily: 'sans-serif'}}>Why us</p>
        <Link  to="/contactUs">
         <p className='text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[53.1vw]' style={{fontFamily: 'sans-serif'}}>Contact us</p>
         </Link>
        {/* <a href="https://4x07dkrh-8600.inc1.devtunnels.ms/" className="absolute text-[#8956ff] text-[1.2vw] top-[0.8vw] left-[76.2vw]">user</a>
        <a href="https://4x07dkrh-9600.inc1.devtunnels.ms/" className="absolute text-[#8956ff] text-[1.2vw] top-[0.8vw] left-[80vw]">w-user</a> */}
        <span className="material-symbols-outlined absolute text-white/50"
            style={{ fontSize: '2.3vw', top: '0.6vw', left: '97%', position: 'absolute' }}>
            account_circle
        </span>
        { !LoggedIn &&
        <div>
        <button onClick={openCloseSignin} className='absolute top-[0.6vw] right-[13vw] bg-[#000000]  rounded-lg px-[1vw] py-[0.4vw] text-[1vw]   text-white  hover:bg-[#242424] hover:cursor-pointer' >Sign in </button>
        <button onClick={openCloseLogin} className='absolute top-[0.6vw] right-[8vw] bg-[#8956FF]  rounded-lg px-[1vw] py-[0.4vw] text-[1vw]   text-white hover:border-[1px] hover:bg-[#9060ff] hover:cursor-pointer' >Login</button>
        </div>
        }
        { LoggedIn && (
          <div>
            <div className=" cursor-pointer border-[#0067f8] border-[0.15vw] absolute z-10 top-[0.82vw] right-[0.81vw] rounded-full overflow-hidden h-[2vw]">            
              <img className=" h-[1.81vw] " src="/hamster.jpg" alt="" />
            </div>
          <button 
            onClick={handleLogout} 
            className="absolute top-[0.6vw] right-[8vw] bg-[#000] rounded-lg px-[1vw] py-[0.4vw] text-[1vw] text-white hover:bg-[#2d2d2d]"
            >
            Logout
            </button>
              </div>
        )}
      </div>

      {/* login section */}
      {SigninOpenClose &&   <div className='border-[1px] fixed h-[41vw] w-[29.5vw] top-[4vw] bg-[#f7f7f7] left-[35vw] z-10 rounded-lg'>
      <Firebase />
      </div>}
      {loginOpenClose &&   <div className='border-[1px] fixed h-[18vw] w-[28vw] top-[12vw] bg-[#f7f7f7] left-[35vw] z-10 rounded-lg'>
      <Login  LoggedIn={LoggedIn} setLoggedIn={setLoggedIn}/>
      </div>
      }
      {/* Notification Icon */}
      <span className="material-symbols-outlined absolute  text-white/50"
      style={{ fontSize: '1.8vw', top: '0.9vw', left: '93.6%'}}>notifications</span>
      </div>
      }
    
export {openCloseLogin,openCloseSignin}