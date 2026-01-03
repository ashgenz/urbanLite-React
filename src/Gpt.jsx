import React, { useState, useCallback, useRef, Suspense, lazy } from 'react';
// import FAQSection from './Faq';
import {BrowserRouter as Router,Route,Routes,Link} from "react-router-dom";
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import UrbanLite2 from './UrbanLite2';


// import BookingsPage from './BookingsPage';
// import JhaduPocha from './JhaduPocha'
// import Login from './Login';
// import Refunds from './Refunds';
// import Tnc from './Tnc';
// import ContactUs from './ContactUs';
// import Nav from './Nav';
// import Footer from './Footer';
// import ScrollToTop from './ScrollToTop';
// import InfiniteScroll from './InfiniteScroll';
// import Cook from './Cook';
// import Bartan from './Bartan';
// import AllRounder from './AllRounder';
// import WorkerRegister from './WorkerRegister';
// 2. Define lazy components outside the function
const JhaduPocha = lazy(() => import('./JhaduPocha'));
const Cook = lazy(() => import('./Cook'));
const Bartan = lazy(() => import('./Bartan'));
const AllRounder = lazy(() => import('./AllRounder'));
const BookingsPage = lazy(() => import('./BookingsPage'));
const ContactUs = lazy(() => import('./ContactUs'));
const Refunds = lazy(() => import('./Refunds'));
const Tnc = lazy(() => import('./Tnc'));
const WorkerRegister = lazy(() => import('./WorkerRegister'));





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
//         <div className="mt-4 text-md bg-white ">
//           <p><strong>Latitude:</strong> {marker.lat}</p>
//           <p><strong>Longitude:</strong> {marker.lng}</p>
//           {address && <p><strong>Address:</strong> {address}</p>}
//         </div>
//       )}
//     </div>
//   );
// };





function UrbanLite() {
  const [LoggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <Nav LoggedIn={LoggedIn} setLoggedIn={setLoggedIn}/>
      <ScrollToTop paths={["/contactUs", "/RefundsAndCancellation","/termsAndConditions","/jhadupocha","/cook","/bartan","/allrounder"]} />
      
      {/* 3. Wrap Routes in Suspense to handle the loading state */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen text-gray-500">
          Loading UrbanLite...
        </div>
      }>
        <Routes>
            <Route path="/" element={<UrbanLite2/>}/>
            <Route path="/termsAndConditions" element={<Tnc/>}/>
            <Route path="/contactUs" element={<ContactUs LoggedIn={LoggedIn}/>}/>
            <Route path="/bookings" element={<BookingsPage LoggedIn={LoggedIn}/>}/>
            <Route path="/RefundsAndCancellation" element={<Refunds/>}/>
            <Route path="/cook" element={<Cook LoggedIn={LoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/bartan" element={<Bartan LoggedIn={LoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/allrounder" element={<AllRounder LoggedIn={LoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/jhadupocha" element={<JhaduPocha heading="Jhadu Pocha" LoggedIn={LoggedIn} setLoggedIn={setLoggedIn} />} />
            <Route path="/workerregister" element={<WorkerRegister/>}/>
        </Routes>
      </Suspense>
      
      <Footer/>
    </Router>
  );
}
export default UrbanLite;
