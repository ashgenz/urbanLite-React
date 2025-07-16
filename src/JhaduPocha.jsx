import TimeSlotDropdown from "./TimeSlotDropdown"

export default function JhaduPocha({heading}){
    return <>
    <h1 className="text-[2vw] absolute top-[2vw] left-[30vw]">{heading}</h1>
    <p className="text-[1.2vw] absolute top-[6vw] left-[30vw]">Desciption</p>
    <p className=" absolute top-[9vw] left-[30vw]">
        "Professional brooming and mopping service"
    </p>
    <div className="absolute top-[5vw] left-[5vw] rounded-lg  border-black border-[2px] z-1 overflow-hidden">
    <img style={{backgroundSize:'auto'}} src="/JhaduPocha.jpg" alt="JhaduPocha" />
    </div>
    <iframe src="" frameborder="0"></iframe>
    <form action="">
        {/* one time or monthly----may be*/}
        <div className="absolute top-[13vw] left-[30vw] h-[2.8vw] w-[15vw] rounded-3xl bg-[#f0f0f0]">
            <button className="absolute top-[0.35vw] left-[1vw] h-[2vw] w-[6vw] rounded-3xl bg-[#fffefe]">Monthly</button>
            <button className="absolute top-[0.35vw] left-[7vw] h-[2vw] w-[6vw] rounded-3xl ">One Time</button>
        </div>


        {/* Amount of work in area units or bhk ,tells time and recommend people accordingly----ok*/}
        <div  className="absolute top-[17.5vw] bg-[#ffffff] h-[4vw] left-[30vw] w-[50vw] flex ">
        <span>
            <p>Number of Rooms</p> <br />
            <input type="number" className="relative top-[-1vw] bg-[#f0f0f0] w-[5.5vw] h-[2vw] pl-[3vw] " />
        </span>
        <span className="absolute left-[10vw]">
            <p>Number of kitchen</p><br />
            <input type="number" className="relative top-[-1vw] bg-[#f0f0f0] w-[5.5vw] h-[2vw] pl-[3vw] " />
        </span>
        <span className="absolute left-[20vw]">
            <p>Hall Size</p> <br />
            <div className="relative top-[-1vw]  ">
                <input type="number" className="bg-[#f0f0f0] w-[5.5vw] h-[2vw] pl-[2.5vw] "/>
                <p className="inline text-[#505050] italic">(if more than one hall is there, give combined size)</p>
            </div>
        </span>
        </div>
        

        {/* add on toilet cleaning  */}
        <div className="absolute top-[23vw] left-[30vw] rounded-3xl ">
            <p>Add-on:</p>
            <div>
              <div className="relative left-[3vw] top-[0.5vw]">
                <input type="checkbox" className="  h-[1vw] w-[1vw]" />
                 <p className="relative ml-[0.5vw] inline">Toilet Cleaning</p>
              </div>  
            
               <div className="relative left-[6.5vw] top-[1.3vw]">
                <p>Number of Toilets</p>
                <input type="number"  className="bg-[#f0f0f0] w-[5.5vw] h-[2vw] pl-[2.5vw] " />
               </div>
            </div>
            
            </div>


            <div className="absolute top-[31.5vw] left-[30vw] rounded-3xl ">
            <div>
              <div className="relative left-[3vw] top-[0.5vw]">
                <input type="checkbox" className="  h-[1vw] w-[1vw]" />
                 <p className="relative ml-[0.5vw] inline">Bartan cleaning</p>
              </div>  
               <div className="relative left-[6.5vw] top-[1.3vw]">
                <p>Amount of Baratan</p>
                <input type="number"  className="bg-[#f0f0f0] w-[5.5vw] h-[2vw] pl-[2.5vw] " />
               </div>
            </div>
            
        </div>
            
        {/*if monthly selected->  time slot-------yes----------prebooking?---yes with some advance */}
        <TimeSlotDropdown />

        {/* prebook */}
        <div className="absolute top-[46vw] left-[30vw]">
        <p>prebook selection</p>
        <p className="font-semibold">Select Date:</p>
        <input type="date"  className=" bg-[#f0f0f0] h-[2vw] pl-[1vw] left-[30vw] rounded-md"/>
        </div>
        {/* frequency of services - everyday ? in two days or three days or what   */}
        {/*confirm location-----yes */}
        <div className="absolute top-[30vw] left-[50vw]">
          <p>Confirm Location of work</p>
          <input type="text" className="bg-[#f0f0f0]"/>
        </div> 
        
    </form>

    {/* plans */}
    <button className="absolute top-[40vw] left-[60vw]  bg-[#f0f0f0]">
      <h1>Standard plan</h1>
      <ul >
        <li>Jadhu pocha: Alternate day</li>
        <li>toilet: twice a week</li>
        <li>bartan: daily once</li>
    </ul>
    </button>

    <button  className="absolute top-[40vw] left-[74vw]  bg-[#f0f0f0]">
    <h1>premium plan</h1>
      <ul>
        <li>Jadhu pocha: daily</li>
        <li>toilet: twice a week</li>
        <li>bartan: daily twice</li>
    </ul>
    </button>
    <button  className="absolute top-[40vw] left-[84vw]  bg-[#f0f0f0]">
    <h1>custom plan</h1>
      <ul>
        <li>Jadhu pocha: daily/alternate day/in every 2 days</li>
        <li>toilet: once/twice/thrice a week</li>
        <li>bartan: daily once/twice</li>
    </ul>    
    </button>

    <p  className="absolute top-[34vw] left-[84vw]">estimated duration:</p>
    <p  className="absolute top-[30vw] left-[84vw]">no. of workers:</p>

    <button className="absolute top-[40vw] left-[40vw] bg-[#5726a5] text-[#ffff] rounded-lg px-[1vw] hover:bg-[#5e49d4]">Book</button>
    {/* payment gateway and bookings data and status management(database)=database of Booking and status(two tables different for running and completed) + payment */}
    <button className="absolute top-[45vw] left-[40vw] bg-[#5726a5] text-[#ffff] rounded-lg px-[1vw] hover:bg-[#5e49d4]">Pay</button>
    </>
}