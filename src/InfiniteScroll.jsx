import React from "react";

const imagesRow1 = [
  "/1.webp",
  "/2.webp",
  "/3.webp",
  "/4.webp",
  "/5.webp",
  "/6.webp",
  "/19.webp",
  "/20.webp",
  "/21.webp",
  "/22.webp",
  "/23.webp",
  "/24.webp",
  "/26.webp",
];

const imagesRow2 = [
  "/7.webp",
  "/9.webp",
  "/10.webp",
  "/11.webp",
  "/12.webp",
  "/13.webp",
  "/14.webp",
  "/15.webp",
  "/16.webp",
  "/17.webp",
  "/24.webp",
  "/25.webp",
];

const InfiniteScroll = () => {
  return (
    <div className="mt-[10vw] md:mt-[2vw] h-[73vw] md:h-[25.7vw] w-full bg-[#eaeaea] overflow-hidden ">
      {/* Row 1 - moves left */}
      <div className="flex overflow-hidden relative mt-[5vw] md:mt-[2.2vw]">
        <div className="flex animate-scroll-left-mobile md:animate-scroll-left-desktop">
          {[...imagesRow1, ...imagesRow1].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-[30vw] w-[40vw] md:w-[18vw] md:h-[10vw] object-cover mx-2 "
            />
          ))}
        </div>
      </div>

      {/* Row 2 - moves right */}
      <div className="flex overflow-hidden relative   mt-[3vw] md:mt-[1vw]">
        <div className="flex animate-scroll-right-mobile md:animate-scroll-right-desktop">
          {[...imagesRow2, ...imagesRow2].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-[30vw] w-[60vw] md:w-[18vw] md:h-[10vw] object-cover mx-2 "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;
