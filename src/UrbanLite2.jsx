
import React, { useState, useCallback, useRef, Suspense, lazy } from 'react';
import { ChevronDown } from "lucide-react";
import ServiceCard from "./ServiceCard"
import ArrivalCard from './ArrivalCard';
import Whyus from './Whyus';
// import FAQSection from './Faq';
import {BrowserRouter as Router,Route,Routes,Link} from "react-router-dom";
import InfiniteScroll from './InfiniteScroll';
 const UrbanLite2 = () => { 


// Data for the suggestion cards (Updated with image paths for all)
  const suggestions = [
    { name: "Jhadu Pocha", available: true, image: "/JhaduPocha.jpg", to: "/jhadupocha" },
    { name: "Cook", available: true, image: "/cook.png", to: "/cook" },
    { name: "Bartan", available: true, image: "/bartan.jpg", to: "/bartan" },
    { name: "All Rounder", available: true, image: "/allRounder.jpg", to: "/allrounder" },
    // Using images from the "Coming soon" section for the unavailable services
    { name: "Chef", available: false, image: "/chef2.jpg" },
    { name: "Waiter", available: false, image: "/waiter.jpg" },
    { name: "Repair", available: false, image: "/repair.jpg" },
    { name: "Barber", available: false, image: "/barber.avif" },
  ];

  // Component for a single Suggestion Card
  const SuggestionCard = ({ name, image, available, to }) => {
    const cardContent = (
      // Adjusted margin for wrapping layout. Added 'flex-shrink-0' to prevent distortion on smaller widths.
      <div className={`flex flex-col items-center justify-center p-[2vw] md:p-[0.5vw] w-[20vw] md:w-[6.5vw] h-[28vw] md:h-[8vw] rounded-lg shadow-md transition-shadow duration-300 mb-[2vw] md:mb-[1vw] mr-[2vw] md:mr-[1vw] bg-white flex-shrink-0
        ${!available ? 'opacity-50 cursor-default' : 'hover:shadow-lg hover:scale-[1.02]'}
      `}>
        <img 
          src={image} 
          alt={name} 
          className="w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw] object-cover rounded-full mb-[1vw] md:mb-[0.5vw] border border-gray-100" 
        />
        <p className="text-[3.5vw] md:text-[1vw] font-medium text-center text-gray-700 leading-tight">
          {name}
        </p>
{/*         {!available && (
          <span className="absolute bottom-[2vw] md:bottom-[0.5vw] text-[2.5vw] md:text-[0.7vw] font-bold text-red-600">
            Coming Soon
          </span>
        )} */}
      </div>
    );

    return available && to ? (
      <Link to={to} className="inline-block hover:no-underline">
        {cardContent}
      </Link>
    ) : (
      <div className="inline-block">
        {cardContent}
      </div>
    );
  };

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

  return (
<div className="relative font-sans min-h-screen overflow-x-hidden overflow-y-scroll bg-white" style={{fontFamily: 'sans-serif'}}>

   


    <div className=''>
      {/* Images */}
      <img src="chef.png" alt="Chef" className="hidden md:block absolute w-[13vw] left-[3vw] top-[6vw]" />
      <img src="cafeworker.png" alt="Cafe Worker" className="hidden md:block absolute w-[15vw] left-[10vw] top-[19vw]" />
      <img src="cap-guy.png" alt="Cap Guy" className="hidden md:block absolute w-[15vw] left-[80vw] top-[11vw]" />
      <img src="3-guy.png" alt="Three Guys" className="hidden md:block absolute  w-[13vw] left-[69vw] top-[23vw]" />
      <img src="domestic-clean.png" alt="Domestic Clean" className="hidden md:block absolute w-[13vw]  left-[63vw] top-[4vw]" />
      {/* Headings */}
      <div className="relative mt-[7vw]  left-[10vw] md:left-[27.7vw]   md:mt-[6vw] text-black text-[8.4vw]  md:text-[2.7vw] font-bold md:block" style={{fontFamily: 'Arial'}}>
        Skilled Worker at <br /> Your Doorstep
      </div>
      <div className="relative  left-[12vw] md:left-[28vw] mt-[1vw] md:mt-[0vw] text-black text-[4.3vw]  md:text-[1.28vw] md:block" style={{fontFamily: 'sans-serif'}}>
        India's Best <br /> Blue collar Jobs <br /> Marketplace
      </div>
      {/* Search */}
      {/* <div className="relative mt-[3vw] md:mt-[0vw] left-[7vw] md:left-[26vw] w-[80vw] gap-2">
        <input className="bg-[#d8d8d8] h-[13vw] w-[85vw] rounded-full md:h-[3.5vw]  px-10 text-[5vw] md:text-[1.3vw] md:w-[41vw] absolute top-[0.1vw]" placeholder="Search" />
        <input className="bg-white pl-[1.2vw] rounded-[15px] h-[9.5vw] w-[30vw] md:h-[2.6vw] md:w-[8vw] text-[3.5vw] md:text-[1.1vw] absolute right-[-3vw] md:right-[39.8vw] top-[2vw] md:top-[0.5vw]" placeholder="Jaipur " />
        <span className="material-symbols-outlined absolute  rounded-[5px] ml-[75vw] mt-[3vw] md:ml-[38vw] md:top-[1vw] text-[7vw] md:text-[1.68vw] w-[1.9vw] bg-[#ffffff] text-[#6c6c6c]"
        >
        distance 
        </span>
      </div> */}
      {/* suggestions */}
        {/* <div className='h-[30vw] w-[86vw] md:w-[35vw] md:h-[10vw] top-[69.5vw]  absolute md:top-[23.5vw] left-[10vw] md:left-[31vw] '>
          <SuggestionButton Name="chef"/>
          <SuggestionButton Name="waiter"/>
          <SuggestionButton Name="Maid"/>
          <SuggestionButton Name="Repair"/>
          <SuggestionButton Name="chef"/> <br />
          <button className='w-[2.4vw]'></button>
          <SuggestionButton Name="waiter"/>
          <SuggestionButton Name="Maid"/>
          <SuggestionButton Name="Repair"/>
        </div> */}
        {/* Suggestions (NEW Horizontal Cards) */}
      {/* Suggestions (NEW Wrapping Cards) */}
      {/* Removed overflow-x-scroll and whitespace-nowrap and added flex-wrap */}
      <div className='relative mt-[0vw] md:mt-[3vw] left-[7vw] md:left-[26vw] w-[86vw] md:w-[45vw] flex flex-wrap'>
          {suggestions.map((suggestion) => (
            <SuggestionCard 
              key={suggestion.name} 
              name={suggestion.name}
              image={suggestion.image}
              available={suggestion.available}
              to={suggestion.to}
            />
          ))}
      </div>
      {/* End of Suggestions */}
      {/* End of Suggestions */}
          <InfiniteScroll/>
      <p className='relative mt-[10vw] md:mt-[4.5vw] left-[40.8vw] md:left-[46.8vw] text-[4vw]  md:text-[1vw] ' style={{fontFamily: 'sans-serif'}}>Book Now</p>
      {/* Arrow-bounce */}
      <div className="relative md:mt-[0vw] md:left-[48vw]  mt-0 ml-[46vw] md:ml-[0vw]">
      <div className="animate-bounce text-gray-600 dark:text-black">
        <ChevronDown className='size-[9vw] md:size-[2.5vw]'/>
      </div>
      </div>
    </div>
      





    {/* Services Section */}
    <div id="services" className="relative mt-[5vw] md:mt-[2vw] left-[2vw] text-[6vw] md:text-[2.2vw] font-semibold text-black" >Our Services</div>

      {/* Profile Completion for worker*/}
      {/* <div className="absolute  top-[0.3vw] right-[30vw] ">
        <p className="absolute inline text-xs text-gray-200 top-[0.5vw] text-[0.9vw]">Profile</p>
        <p className="absolute inline text-xs text-gray-200 top-[0.5vw]  ml-[11vw] text-[0.9vw]">20%</p>
        <div className="absolute top-[2vw] w-[13vw]  bg-white rounded-full ">
          <div className=" top-0 left-0 h-[0.5vw] w-[3vw] bg-[#8956ff] rounded-full "></div>
          </div>
      </div> */}




    <div className=''>
      <p className="relative text-[6vw] md:text-[2vw] font-medium text-black/70 mt-[4vw] left-[3vw]" style={{fontFamily: 'sans-serif'}}>HouseHold Workers</p>
      <div className="relative mt-[6vw] md:mt-[2vw] w-full ">
        <div className="ml-[-3vw] md:ml-[5vw] flex flex-wrap w-[120vw] md:w-[200vw]  px-2" ref={trayRef}>
          {/* {renderCards(6, 'min-w-[19vw] h-[25vw] mx-[12px]')} */}
          <Link to="/jhadupocha">
            <ServiceCard Name="Jhadu pocha"  srrc="/JhaduPocha.jpg" /> {/*addons=bartan,toilet/washroom*/}
          </Link>
          {/* <ServiceCard Name="Jhadu pocha" srrc="/JhaduPocha.jpg" /> */}
          <Link to="/cook" >
          <ServiceCard Name="cook" srrc="/cook.png"/>{/*all utensils of n people(for which have booked)*/}
          </Link>
          <Link to="/bartan" >
          <ServiceCard Name="Bartan" srrc="/bartan.jpg"/>{/*addons=Jhadu pocha or jhadu pocha and toilet/washroom*/}
          </Link>
          <Link to="/allrounder" >
          <ServiceCard Name="All rounder" srrc="/allRounder.jpg"/>
          </Link>
    </div>  
          
          
          {/* <div className='bg-[#f2f2f2] w-[19vw] h-[25vw] ml-[3vw] mt-[2vw] rounded-md border-[0.5px]'>
            jhadu/pocha or with bartan
            </div>
          <div className='bg-[#f2f2f2] w-[19vw] h-[25vw] ml-[3vw] mt-[2vw] rounded-md'>cooking</div>
          <div className='bg-[#f2f2f2] w-[19vw] h-[25vw] ml-[3vw] mt-[2vw] rounded-md'>bathroom cleaning</div>
          <div className='bg-[#f2f2f2] w-[19vw] h-[25vw] ml-[3vw] mt-[2vw] rounded-md'>Bartan</div> */}
        </div>
        {/* <button className="absolute left-[10px] top-1/2 transform -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white shadow" onClick={() => scrollTray(-1, trayRef)}>&#8249;</button>
        <button className="absolute right-[10px] top-1/2 transform -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white shadow" onClick={() => scrollTray(1, trayRef)}>&#8250;</button> */}
      </div>

      {/* why choose us */}
      <p className='relative mt-[24vw] md:mt-[6vw] left-[3vw] font-medium text-black/70 text-[6vw]  md:text-[2vw]' style={{fontFamily: 'sans-serif'}}>Why Choose Us</p>
      <div className='relative mt-[4vw] left-[8vw] md:left-[17vw]'>
          <Whyus feature="Professional Workers" description="We provide skilled, punctual, and trained workers for every job. Each worker is vetted and committed to high service standards. You can rely on them to get the job done right the first time."/>
          <Whyus feature="Affordable Price" description="Our pricing is designed to suit middle and lower-middle class families. You don’t need to overpay for quality household help anymore. Great service, honest rates—that’s our promise."/>
          <Whyus feature="Convenience First" description="Book workers easily through our platform in just a few steps. No endless calls, no waiting—get help when you need it. We simplify the process so your daily life runs mdoothly."/>
          <Whyus feature="No Fear of Theft" description="All our workers are verified with background checks and ID proof. We prioritize your family’s safety and peace of mind. Trust and transparency are core to our platform."/>
          <Whyus feature="All your Workers Need Under One Roof" description="From cleaning to cooking to repairs—we cover it all. No need to juggle multiple sources or search endlessly. We’re your go-to solution for every kind of household work."/>
          <Whyus feature="Strong Customer Relationships" description="We believe in building more than just transactions. Our team ensures respectful, consistent, and helpful interactions. Your satisfaction and trust drive everything we do"/>
      </div>
      

      {/* About us */}
      <div>
      <p id="aboutus" className='relative mt-[18vw] md:mt-[7vw] left-[4vw] font-medium text-black/70 text-[6vw] md:text-[2vw]' style={{fontFamily: 'sans-serif'}}>About Us</p>
          {/* Main Premium Quote */}
        <div className="bg-white rounded-lg shadow-lg pt-[5vw] md:p-16  relative w-[85vw] md:w-[80vw] mt-[1vw] left-[7vw] md:left-[12vw]">
          <div className="absolute top-8 left-8">
            <span className="text-[6vw] md:text-6xl font-serif text-gray-300 leading-none select-none">"</span>
          </div>

          <div className="md:pt-8 pb-4 px-8">
            <p className="text-[4.1vw] md:text-[1.2vw] mt-[7vw] md:mt-0 text-gray-700 leading-relaxed mb-8 font-light">
              At our core, we believe that quality help at home shouldn't be a luxury. Our platform was built to solve a problem faced by millions of urban households—finding trustworthy, professional workers without the stress, overpricing, or endless searching. We're starting where the need is greatest: in middle and lower-middle-class homes, where people often struggle to find reliable help for essential daily tasks. From cleaning and cooking to household repairs and caregiving, we bring all types of workers under one roof, ensuring convenience, safety, and affordability. But we’re more than just a service. We’re a people-first platform that values long-term relationships, not just one-time tasks. Our team is dedicated to making sure every worker is verified, every customer is heard, and every issue is resolved fast—because your home deserves care, and your time deserves respect. 
            </p>

            <p className="text-[4.1vw] md:text-[1.2vw] text-gray-700 leading-relaxed mb-8 font-light">
              We’re on a mission to make everyday life easier, safer, and more organized—one household at a time.
            </p>
          </div>

          <div className="absolute bottom-8 right-8">
            <span className="text-[6vw] md:text-6xl font-serif text-gray-300 leading-none select-none">"</span>
          </div>
        </div>
      </div>

          {/* --- Trust/Registration Section --- */}
<div className="mt-10 pt-6 border-t border-gray-200 flex flex-col items-center animate-fade-in-up">
  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
    Registered & Recognized By
  </p>
  
<div className="flex gap-10 items-center justify-center py-4">
  {/* MSME Logo */}
  <div className="flex flex-col items-center transition-transform duration-300 hover:scale-110 cursor-pointer">
    <img 
      src="https://cpimg.tistatic.com/8209356/b/1/msme-certificate-service.jpg" 
      alt="MSME Registered" 
      className="h-[23vw]  md:h-[10vw] w-auto object-contain "
    />
  </div>

  {/* Startup India Logo */}
  <div className="flex flex-col items-center transition-transform duration-300 hover:scale-110 cursor-pointer">
    <img 
      src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/Startup-India_Preview.png" 
      alt="Startup India" 
      className="h-[39vw] md:h-[20vw] w-auto object-contain "
    />
  </div>
</div>
</div>
      {/* Household Workers */}
      {/* <div className="absolute text-[2vw] font-medium text-black/70 top-[89vw] left-[3vw]">Household workers</div>
      <div className="absolute left-[1vw] top-[96vw] w-full flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[35vw] px-4" ref={scrollContainerRef}>
          {renderCards(6, 'w-[28vw] h-[18vw]')}
        </div>
      </div> */}

      {/* Local Business Workers */}
      {/* <div className="absolute text-[2vw] font-medium text-black/70 top-[138vw] left-[3vw]">Local business workers</div>
      <div className="absolute  top-[147vw] w-full overflow-hidden">
        <div className="flex ml-[3vw] overflow-x-scroll px-2" ref={tray3Ref}>
          {renderCards(6, 'min-w-[18vw] h-[25vw] mx-[10px]')}
        </div>
        <button className="absolute left-[10px] top-1/2 transform -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white shadow" onClick={() => scrollTray(-1, tray3Ref)}>&#8249;</button>
        <button className="absolute right-[10px] top-1/2 transform -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white shadow" onClick={() => scrollTray(1, tray3Ref)}>&#8250;</button>
      </div> */}

      {/* New Arrivals */}
      <div>
      <p className="relative text-[6vw] md:text-[2vw] font-medium text-black/70 mt-[20vw] md:mt-[5vw] left-[4vw]" style={{fontFamily: 'sans-serif'}}>Coming soon</p>
      <div className="relative mt-[4vw]  w-[100vw] left-[1vw]  md:left-[10vw] flex-wrap flex ">
        <ArrivalCard Name="chef" description="Expertly crafted dishes with authentic Indian spices." srrc="/chef2.jpg"/>
        <ArrivalCard Name="waiter" description="Professional service that makes every meal special." srrc="/waiter.jpg"/>
        <ArrivalCard Name="repair" description="Quick and reliable fixes to keep things running." srrc="/repair.jpg"/>
        <ArrivalCard Name="car clean" description="Sparkling clean cars, inside and out." srrc="/carClean.webp"/>
        <ArrivalCard Name="Barber" description="Sharp cuts and fresh styles, every time." srrc="/barber.avif"/>
        <ArrivalCard Name="manicure & padicure" description="Pampering hands and feet for a polished look." srrc="/manipadi.jpg"/>

        {/* <div className="flex ml-[3vw] overflow-x-scroll px-2" ref={tray4Ref}>
          {renderCards(12, 'min-w-[25vw] h-[18vw] mx-[10px]')}
        </div> */}
        
      </div>
      </div>


      {/* <button className="absolute left-[10px] top-1/2 transform -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white shadow" onClick={() => scrollTray(-1, tray4Ref)}>&#8249;</button>
        <button className="absolute right-[10px] top-1/2 transform -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-white shadow" onClick={() => scrollTray(1, tray4Ref)}>&#8250;</button> */}

      {/* locations */}
      <div>
      <p className="relative md:text-[2vw] text-[6vw] font-medium text-black/70 mt-[18vw] md:mt-[7vw]  left-[3vw]" style={{fontFamily: 'sans-serif'}}>Locations</p>
      <div className="relative left-[5vw] mt-[3vw] mb-[5vw] w-full overflow-hidden">
        <div className="flex  ml-[13vw]  px-2" >
          {/* {renderCards(4, 'min-w-[18vw] h-[10vw] mx-[10px]')} */}
          <div className='bg-[#ffffff] h-[50vw] w-[50vw] md:w-[17vw] md:h-[14vw] ml-[4vw] md:ml-[21vw] mt-[2vw] rounded-md border-[1px] border-[#cacaca]'>
            <img src="/Jaipur.jpg" alt="jaipur"  className=' h-[35vw] md:h-[7vw] rounded-lg ml-[8.8vw] md:ml-[5.3vw] mt-[2.3vw]'/>
            <p className='text-[#222222dd] text-[5vw] md:text-[1.3vw] mt-[1vw] md:ml-[7vw] ml-[17vw]'  style={{fontFamily: 'sans-serif'}}>Jaipur</p>
          </div>
          {/* <div className='bg-[#ffffff] w-[17vw] h-[14vw] ml-[10vw] mt-[2vw] rounded-md border-[1px] border-[#cacaca]'>
            <img src="/sikar.jpg" alt="Sikar"  className='h-[7vw] rounded-lg ml-[4vw] mt-[2.3vw]'/>
            <p className='text-[#222222dd] text-[1.3vw] mt-[1vw] ml-[7vw]'  style={{fontFamily: 'sans-serif'}}>Sikar</p>
          </div> */}
        </div>
    </div>
      </div>

      
        
     
</div>
  );
};
export default UrbanLite2;
