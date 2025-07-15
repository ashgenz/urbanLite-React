export default function BookingPage({heading}){
    return <>
    <h1>{heading}</h1>
    <p>Desciption</p>
    <img src="" alt="" />
    <iframe src="" frameborder="0"></iframe>
    <form action="">
        {/* Amount of work in area units or bhk ,tells time and recommend people accordingly----ok*/}
        {/* one time or monthly----may be*/}
        {/*if monthly selected->  time slot-------yes----------prebooking?---yes with some advance */}
        {/* frequency of services - everyday ? in two days or three days or what   */}
        {/*confirm location-----yes */}
        {/* add on toilet cleaning  */}
    </form>
    <button className="absolute top-[10vw] left-[40vw] bg-[#5726a5] text-[#ffff] rounded-lg px-[1vw] hover:bg-[#5e49d4]">Book</button>
    {/* payment gateway and bookings data and status management(database)=database of Booking and status(two tables different for running and completed) + payment */}
    <button className="absolute top-[15vw] left-[40vw] bg-[#5726a5] text-[#ffff] rounded-lg px-[1vw] hover:bg-[#5e49d4]">Pay</button>
    </>
}