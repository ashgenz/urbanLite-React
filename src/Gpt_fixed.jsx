import React, { useState, useCallback, useRef } from 'react';
import { ChevronDown } from "lucide-react";
import Firebase from "./firebase" 
import LocationPicker2 from './LocationPicker2';
import SuggestionButton from './SuggestionButton';
import ServiceCard from "./ServiceCard"
import ArrivalCard from './ArrivalCard';
import Whyus from './Whyus';
import FAQSection from './Faq';
import {BrowserRouter as Router,Route,Routes,Link} from "react-router-dom";
import BookingsPage from './BookingPage';
import JhaduPocha from './JhaduPocha'
import Login from './Login';
import Refunds from './Refunds';
import Tnc from './Tnc';
import ContactUs from './ContactUs';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

// import {
//   GoogleMap,
//   Marker,
//   useLoadScript,
//   Autocomplete
// } from "@react-google-maps/api";

// const mapContainerStyle = {
//   width: "99.9%",
//   height: "16.38vw",
//   top:'-0.5vw',
//   rounded: 'lg'
// };

// const center = {
//   lat: 28.6139, // default (e.g., Delhi)
//   lng: 77.2090,
// };

// const libraries = ["places"];


// const LocationPicker = () => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyAjRHFMmEskWryPGVkxlnUOTP8HVJjbiSk", // 🔒 Replace with your real key
//     libraries,
//   });

//   const [marker, setMarker] = useState(null);
//   const [address, setAddress] = useState("");
//   const autocompleteRef = useRef(null);

//   const handleMapClick = useCallback((event) => {
//     setMarker({
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng(),
//     });
//   }, []);

//   const onPlaceChanged = () => {
//     const place = autocompleteRef.current.getPlace();
//     if (place.geometry) {
//       const location = place.geometry.location;
//       setMarker({
//         lat: location.lat(),
//         lng: location.lng(),
//       });
//       setAddress(place.formatted_address || "");
//     }
//   };

//   if (!isLoaded) return <div>Loading Map...</div>;

//   return (
//     <div>
//       <div className="mb-2">
//         <Autocomplete
//           onLoad={(ref) => (autocompleteRef.current = ref)}
//           onPlaceChanged={onPlaceChanged}
//         >
//           <input
//             type="text"
//             placeholder="Search address..."
//             className="w-[8vw] h-[1.6vw] p-2 border border-gray-300 rounded absolute top-0  z-1 bg-white"
//           />
//         </Autocomplete>
//       </div>

//       <GoogleMap className="absolute "
//         mapContainerStyle={mapContainerStyle}
//         zoom={12}
//         center={marker || center}
//         onClick={handleMapClick}
//       >
//         {marker && <Marker position={marker} />}
//       </GoogleMap>

//       {marker && (
//         <div className="mt-4 text-sm bg-white ">
//           <p><strong>Latitude:</strong> {marker.lat}</p>
//           <p><strong>Longitude:</strong> {marker.lng}</p>
//           {address && <p><strong>Address:</strong> {address}</p>}
//         </div>
//       )}
//     </div>
//   );
// };



const UrbanLite2 = () => { 




  //   const getLocation2 = () => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         alert(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
  //       },
  //       (error) => {
  //         alert("Location access denied or unavailable.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by your browser.");
  //   }
  // };
  // //maps


  const trayRef = useRef(null);
  const tray3Ref = useRef(null);
  const tray4Ref = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollTray = (direction, ref) => {
    if (ref.current) ref.current.scrollLeft += direction * 200;
  };

  const scrollVertical = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: direction * 100,
        behavior: 'smooth',
      });
    }
  };

  const renderCards = (count, className) =>
    [...Array(count)].map((_, i) => (
      <div
        key={i}
        className={`rounded-lg bg-[#f2f2f2] ${className} ${i === 0 ? 'ml-[0vw]' : ''}`}
      ></div>
    ));

  return <div className="relative font-sans min-h-screen overflow-x-hidden bg-white" style={{ fontFamily: "sans-serif" }}>
      {/* ================= HERO ================= */}
      <section className="px-4 pt-6 pb-6 md:pt-12 md:pb-12">
        {/* --- Mobile: small centered icons to keep visual feel --- */}
        <div className="flex justify-center gap-4 items-center md:hidden">
          <img src="/chef.png" alt="chef" className="w-14 h-14 object-contain" />
          <img src="/cafeworker.png" alt="cafeworker" className="w-14 h-14 object-contain" />
          <img src="/cap-guy.png" alt="cap" className="w-14 h-14 object-contain" />
          <img src="/3-guy.png" alt="group" className="w-14 h-14 object-contain" />
          <img src="/domestic-clean.png" alt="clean" className="w-14 h-14 object-contain" />
        </div>

        {/* --- Title & subtitle --- */}
        <div className="mt-4 text-center md:text-left md:relative">
          <h1 className="text-xl md:text-[2.7vw] font-bold text-black">Skilled Worker at <br className="md:hidden" /> Your Doorstep</h1>
          <p className="mt-1 text-sm md:text-[1.28vw] text-gray-800">
            India's Best <br className="md:hidden" /> Blue collar Jobs <br className="md:hidden" /> Marketplace
          </p>
        </div>

        {/* --- Desktop absolute decorative images (preserve original look) --- */}
        <div className="hidden md:block">
          <img src="/chef.png" alt="Chef" className="absolute w-[13vw] left-[3vw] top-[6vw]" />
          <img src="/cafeworker.png" alt="Cafe Worker" className="absolute w-[15vw] left-[10vw] top-[19vw]" />
          <img src="/cap-guy.png" alt="Cap Guy" className="absolute w-[15vw] left-[80vw] top-[11vw]" />
          <img src="/3-guy.png" alt="Three Guys" className="absolute  w-[13vw] left-[69vw] top-[23vw]" />
          <img src="/domestic-clean.png" alt="Domestic Clean" className="absolute w-[13vw] left-[63vw] top-[4vw]" />
        </div>

        {/* === Search & location === */}
        <div className="mt-6 md:mt-12">
          <div className="w-full max-w-xl mx-auto md:mx-0">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              {/* main search */}
              <input
                aria-label="Search"
                className="w-full rounded-full px-4 py-3 bg-gray-200 text-gray-800 text-base md:h-[3.5vw] md:px-10 md:text-[1.3vw]"
                placeholder="Search"
              />
              {/* location */}
              <input
                aria-label="Location"
                className="w-1/2 md:w-[8vw] rounded-xl px-4 py-2 bg-white text-gray-700 text-base md:text-[1.1vw]"
                placeholder="Jaipur"
              />
            </div>

            {/* suggestions: horizontal scroll on mobile, absolute on desktop */}
            <div className="mt-3">
              {/* mobile scroll */}
              <div className="flex gap-2 overflow-x-auto md:hidden py-1">
                <SuggestionButton Name="chef" />
                <SuggestionButton Name="waiter" />
                <SuggestionButton Name="Maid" />
                <SuggestionButton Name="Repair" />
                <SuggestionButton Name="cook" />
                <SuggestionButton Name="bartan" />
              </div>

              {/* desktop positioned suggestions (keeps your original placement) */}
              <div className="hidden md:block absolute top-[23.5vw] left-[31vw] w-[35vw]">
                <div className="flex flex-wrap gap-2">
                  <SuggestionButton Name="chef" />
                  <SuggestionButton Name="waiter" />
                  <SuggestionButton Name="Maid" />
                  <SuggestionButton Name="Repair" />
                  <SuggestionButton Name="cook" />
                  <SuggestionButton Name="bartan" />
                </div>
              </div>
            </div>
          </div>

          {/* Book now + chevron */}
          <div className="mt-6 text-center">
            <div className="inline-flex flex-col items-center">
              <span className="text-sm md:text-[1vw]">Book Now</span>
              <div className="mt-2 animate-bounce">
                <ChevronDown size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR SERVICES ================= */}
      <section className="px-4 md:px-8">
        <h2 className="text-lg md:text-[2.2vw] font-semibold text-black">Our Services</h2>

        <p className="mt-4 text-base md:text-[2vw] font-medium text-gray-700">HouseHold Workers</p>

        {/* Mobile: horizontal scroll cards, Desktop: wrap grid */}
        <div className="mt-4">
          <div ref={trayRef} className="flex gap-4 overflow-x-auto md:flex-wrap md:overflow-visible md:ml-[5vw]">
            <Link to="/jhadupocha" className="min-w-[72%] sm:min-w-[48%] md:min-w-0 md:w-auto">
              <ServiceCard Name="Jhadu pocha" srrc="/JhaduPocha.jpg" />
            </Link>
            <Link to="/cook" className="min-w-[72%] sm:min-w-[48%] md:min-w-0 md:w-auto">
              <ServiceCard Name="cook" srrc="/cook.png" />
            </Link>
            <Link to="/bartan" className="min-w-[72%] sm:min-w-[48%] md:min-w-0 md:w-auto">
              <ServiceCard Name="Bartan" srrc="/bartan.jpg" />
            </Link>
            <Link to="/allrounder" className="min-w-[72%] sm:min-w-[48%] md:min-w-0 md:w-auto">
              <ServiceCard Name="All rounder" srrc="/allRounder.jpg" />
            </Link>
          </div>

          {/* optional arrows for desktop */}
          <div className="hidden md:flex gap-2 mt-3">
            <button onClick={() => scrollTray(-1, trayRef)} className="px-3 py-1 rounded bg-white shadow">‹</button>
            <button onClick={() => scrollTray(1, trayRef)} className="px-3 py-1 rounded bg-white shadow">›</button>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      {/* why choose us */}
<p className='mt-6 ml-4 md:ml-[3vw] text-black/70 text-[1.05rem] md:text-[2vw]' style={{fontFamily: 'sans-serif'}}>Why Choose Us</p>

{/* keep original Whyus components but adjust container for mobile */}
<div className='mt-4 md:mt-[4vw] px-4 md:px-0 md:ml-[17vw] ml-0 space-y-4'>
  <Whyus feature="Professional Workers" description="We provide skilled, punctual, and trained workers for every job. Each worker is vetted and committed to high service standards. You can rely on them to get the job done right the first time."/>
  <Whyus feature="Affordable Price" description="Our pricing is designed to suit middle and lower-middle class families. You don’t need to overpay for quality household help anymore. Great service, honest rates—that’s our promise."/>
  <Whyus feature="Convenience First" description="Book workers easily through our platform in just a few steps. No endless calls, no waiting—get help when you need it. We simplify the process so your daily life runs smoothly."/>
  <Whyus feature="No Fear of Theft" description="All our workers are verified with background checks and ID proof. We prioritize your family’s safety and peace of mind. Trust and transparency are core to our platform."/>
  <Whyus feature="All your Workers Need Under One Roof" description="From cleaning to cooking to repairs—we cover it all. No need to juggle multiple sources or search endlessly. We’re your go-to solution for every kind of household work."/>
  <Whyus feature="Strong Customer Relationships" description="We believe in building more than just transactions. Our team ensures respectful, consistent, and helpful interactions. Your satisfaction and trust drive everything we do"/>
</div>


      {/* ================= ABOUT US ================= */}
      <section className="px-4 md:px-8 mt-8">
        <h3 className="text-base md:text-[2vw] text-gray-700">About Us</h3>

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-16 mt-4 w-full">
          <div className="absolute top-6 left-6 hidden md:block">
            <span className="text-6xl font-serif text-gray-300 select-none">"</span>
          </div>

          <div>
            <p className="text-sm md:text-[1.2vw] text-gray-700 leading-relaxed">
              At our core, we believe that quality help at home shouldn't be a luxury. Our platform was built to solve a problem faced by millions of urban households—finding trustworthy, professional workers without the stress, overpricing, or endless searching. We're starting where the need is greatest: in middle and lower-middle-class homes, where people often struggle to find reliable help for essential daily tasks. From cleaning and cooking to household repairs and caregiving, we bring all types of workers under one roof, ensuring convenience, safety, and affordability. But we’re more than just a service. We’re a people-first platform that values long-term relationships, not just one-time tasks. Our team is dedicated to making sure every worker is verified, every customer is heard, and every issue is resolved fast—because your home deserves care, and your time deserves respect.
            </p>

            <p className="mt-4 text-sm md:text-[1.4vw] text-gray-700 leading-relaxed">
              We’re on a mission to make everyday life easier, safer, and more organized—one household at a time.
            </p>
          </div>

          <div className="absolute right-6 bottom-6 hidden md:block">
            <span className="text-6xl font-serif text-gray-300 select-none">"</span>
          </div>
        </div>
      </section>

      {/* ================= COMING SOON ================= */}
      <section className="px-4 md:px-8 mt-8">
        <h3 className="text-base md:text-[2vw] text-gray-700">Coming soon</h3>

        <div className="mt-4 flex gap-4 overflow-x-auto md:flex-wrap" ref={tray4Ref}>
          <ArrivalCard Name="chef" description="Expertly crafted dishes with authentic Indian spices." srrc="/chef2.jpg" />
          <ArrivalCard Name="waiter" description="Professional service that makes every meal special." srrc="/waiter.jpg" />
          <ArrivalCard Name="repair" description="Quick and reliable fixes to keep things running." srrc="/repair.jpg" />
          <ArrivalCard Name="car clean" description="Sparkling clean cars, inside and out." srrc="/carClean.webp" />
          <ArrivalCard Name="Barber" description="Sharp cuts and fresh styles, every time." srrc="/barber.avif" />
          <ArrivalCard Name="manicure & padicure" description="Pampering hands and feet for a polished look." srrc="/manipadi.jpg" />
        </div>
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="px-4 md:px-8 mt-8 mb-12">
        <h3 className="text-base md:text-[2vw] text-gray-700">Locations</h3>
        <div className="mt-4 flex justify-center md:justify-start">
          <div className="bg-white w-11/12 sm:w-3/4 md:w-[17vw] h-[14vw] rounded-md border border-gray-300 flex flex-col items-center p-4">
            <img src="/Jaipur.jpg" alt="Jaipur" className="h-20 rounded-lg object-cover" />
            <p className="mt-3 text-sm md:text-[1.3vw] text-gray-700">Jaipur</p>
          </div>
        </div>
      </section>

      {/* ================= FAQ / Footer placeholder ================= */}
      <footer className="bg-black text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h4 className="font-semibold text-lg">Frequently Asked Questions</h4>
          <p className="text-sm mt-2 text-gray-300">Answers to common questions about our worker services.</p>
          {/* Your FAQ components go here — keep existing markup */}
        </div>
      </footer>
    </div>

  
};

function UrbanLite() {
  return (
    <Router>
      <Nav/>
      <ScrollToTop paths={["/contactUs", "/RefundsAndCancellation","/termsAndConditions"]} />
      <Routes>
          <Route path="/" element={<UrbanLite2/>}/>
          <Route path="/termsAndConditions" element={<Tnc/>}/>
          <Route path="/contactUs" element={<ContactUs/>}/>
          <Route path="/RefundsAndCancellation" element={<Refunds/>}/>
        <Route path="/jhadupocha" element={<JhaduPocha heading="Jhadu Pocha"/>}/>
        <Route path="/cook" element={<BookingsPage heading="Cook"/>}/>
        <Route path="/allrounder" element={<BookingsPage heading="All Rounder"/>}/>
        <Route path="/bartan" element={<BookingsPage heading="Bartan"/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}
export default UrbanLite;
