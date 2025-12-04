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
  const scrollToSection = (id) => {
        // Delay scroll slightly to ensure React Router finishes navigating to '/' first
        setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }   
        }, 100); 
    };
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
        const res = await axios.get('https://urbanlite-backends-vrv6.onrender.com/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setLoggedIn(true); // triggers re-render instantly
        
      } catch (err) {
        console.error(err.response?.data || err.message);
        setLoggedIn(false);

      }
    };

    verifyToken();
  }, []);


    //close Login
    const [SigninOpenClose,setClose1]=useState(false);
    const [loginOpenClose,setClose2]=useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    openCloseSignin=function(){
      setClose2(false);
      setClose1(!SigninOpenClose)
    }
    openCloseLogin=function(){
      setClose1(false);
      setClose2(!loginOpenClose)
    }
    return <div className="static">
        {/* Header */}
     <div className="w-full h-[16vw] md:h-[3.5vw] bg-black  top-0 left-0 z-10">
        <Link to="/">
        <p className=" absolute text-white font-bold text-[6.3vw] md:text-[1.8vw] left-[20px] md:left-[40px] top-[3.8vw] md:top-[0.5vw]">UrbanLite</p>
        </Link>
        <Link to="/#services" onClick={() => scrollToSection('services')}>
        <p className=' md:block hidden text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[30vw]' style={{fontFamily: 'sans-serif'}}>Services</p>
        </Link>
        <Link to="/#aboutus" onClick={() => scrollToSection('aboutus')}>        
          <p className=' md:block hidden text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[46vw] cursor-pointer' style={{fontFamily: 'sans-serif'}}>About us</p>
        </Link>
        <Link to="/bookings">
            <p className='md:block hidden text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[38vw] cursor-pointer' style={{fontFamily: 'sans-serif'}}>Bookings</p>
        </Link>
        <Link  to="/contactUs">
         <p className='md:block hidden text-[0.92vw] text-[#fff] absolute top-[1.3vw] left-[53.1vw]' style={{fontFamily: 'sans-serif'}}>Contact us</p>
         </Link>
        {/* <a href="https://4x07dkrh-8600.inc1.devtunnels.ms/" className="absolute text-[#8956ff] text-[1.2vw] top-[0.8vw] left-[76.2vw]">user</a>
        <a href="https://4x07dkrh-9600.inc1.devtunnels.ms/" className="absolute text-[#8956ff] text-[1.2vw] top-[0.8vw] left-[80vw]">w-user</a> */}
        <span className=" material-symbols-outlined absolute md:block hidden text-white/50"
            style={{ fontSize: '2.3vw', top: '0.6vw', left: '97%', position: 'absolute' }}>
            account_circle
        </span>
        { !LoggedIn &&
        <div>
        <button onClick={openCloseSignin} className='md:block hidden absolute top-[0.6vw] right-[13vw] bg-[#000000]  rounded-lg px-[1vw] py-[0.4vw] text-[1vw]   text-white  hover:bg-[#242424] hover:cursor-pointer' >Sign in </button>
        <button onClick={openCloseLogin} className='md:block block absolute top-[3.8vw] right-[17vw] md:top-[0.6vw] md:right-[8vw] bg-[#8956FF]  rounded-lg px-[4.5vw] md:px-[1vw] py-[1.5vw] md:py-[0.4vw] text-[4vw] md:text-[1vw]   text-white hover:border-[1px] hover:bg-[#9060ff] hover:cursor-pointer' >Login</button>
        </div>
        }
        { LoggedIn && (
          <div>
            <div className="md:block hidden cursor-pointer border-[#0067f8] border-[0.15vw] absolute z-10 top-[0.82vw] right-[0.81vw] rounded-full overflow-hidden h-[2vw]">            
              <img className=" h-[1.81vw] " src="/hamster.jpg" alt="" />
            </div>
          <button 
            onClick={handleLogout} 
            className="md:block hidden absolute top-[0.6vw] right-[8vw] bg-[#000] rounded-lg px-[1vw] py-[0.4vw] text-[1vw] text-white hover:bg-[#2d2d2d]"
            >
            Logout
            </button>
              </div>
        )}
      </div>

      {/* login section */}
      {SigninOpenClose &&   <div className=' fixed md:w-[29.5vw] md:h-[41vw] h-[520px] w-[80vw] top-[15vw] md:top-[4vw]  left-[10vw] md:left-[35vw] z-10 rounded-lg'>
      <Firebase />
      </div>}
      {loginOpenClose &&   <div className='border-[1px] fixed h-[75vw] md:h-[18vw] w-[80vw] md:w-[28vw] top-[40vw] md:top-[12vw] bg-[#f7f7f7] left-[10vw] md:left-[35vw] z-10 rounded-lg'>
      <Login  LoggedIn={LoggedIn} setLoggedIn={setLoggedIn}/>
      </div>
      }
      {/* Notification Icon */}
      <span className=" material-symbols-outlined md:block hidden absolute  text-white/50"
      style={{ fontSize: '1.8vw', top: '0.9vw', left: '93.6%'}}>notifications</span>
      {/* menu */}
      <span 
  onClick={() => setMobileMenuOpen(true)}
  className="block md:hidden text-[8vw] absolute top-[4.5vw] right-[4vw] text-white material-symbols-outlined"
>
  menu
</span>









        {/* Mobile Sidebar */}
<div 
  className={`fixed top-0 right-0 h-full w-[70vw] bg-black text-white z-50 transform 
  ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}
>
  {/* Close Button */}
  <span 
    onClick={() => setMobileMenuOpen(false)} 
    className="material-symbols-outlined text-[9vw] absolute top-[5vw] right-[5vw]"
  >
    close
  </span>

  <div className="mt-[20vw] flex flex-col gap-[6vw] pl-[8vw] text-[5vw] font-medium">

    {/* Profile Photo */}
    {LoggedIn && (
      <div className="flex items-center gap-[4vw] mb-[5vw]">
        <img src="/hamster.jpg" className="w-[14vw] h-[14vw] rounded-full border border-white" />
        <p className="text-[5vw]">My Profile</p>
      </div>
    )}

    {/* Links */}
    <Link to="/#services" onClick={() => { scrollToSection("services"); setMobileMenuOpen(false) }}>
      <p>Services</p>
    </Link>

    <Link to="/bookings" onClick={() => setMobileMenuOpen(false)}>
      <p>Bookings</p>
    </Link>

    <Link to="/#aboutus" onClick={() => { scrollToSection("aboutus"); setMobileMenuOpen(false) }}>
      <p>About Us</p>
    </Link>

    <Link to="/contactUs" onClick={() => setMobileMenuOpen(false)}>
      <p>Contact Us</p>
    </Link>

    {/* Login / Logout Buttons */}
    {!LoggedIn && (
      <div className="flex flex-col gap-[4vw] mt-[7vw]">
        <button 
          onClick={() => { openCloseSignin(); setMobileMenuOpen(false); }}
          className="bg-gray-800 py-[3vw] rounded-lg"
        >Sign In</button>

        <button 
          onClick={() => { openCloseLogin(); setMobileMenuOpen(false); }}
          className="bg-[#8956FF] py-[3vw] rounded-lg"
        >Login</button>
      </div>
    )}

    {LoggedIn && (
      <button 
        onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
        className="bg-red-500 py-[3vw] mt-[7vw] rounded-lg"
      >Logout</button>
    )}

  </div>
</div>

{mobileMenuOpen && (
  <div 
    onClick={() => setMobileMenuOpen(false)}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
  ></div>
)}

      </div>
      }
    
export {openCloseLogin,openCloseSignin};