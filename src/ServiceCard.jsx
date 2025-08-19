// src/components/ServiceCard.jsx
import { Star } from "lucide-react";
import { Card, CardContent } from "./Card";

export default function ServiceCard({Name,srrc}) {
  return (
    <div className="relative pl-[9.2vw] md:p-8 h-[100vw] md:h-[30vw] mt-[2vw] md:mt-[1vw] flex ">
      <Card
        className="h-[90vw] w-[85vw] md:h-[25vw] md:w-[19vw] md:min-h-[300px] md:min-w-[200px]  relative border-[#ffffff] overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-[#eff8ff] cursor-pointer group border-[1px] hover:border-[#ffffff]"
        
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Image Section */}
          <div className="relative h-1/2  overflow-hidden">
            <img
              src={srrc}
              alt=""
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <p className="text-[6vw] md:text-[1.1vw] font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {Name}
            </p>

            <p className="text-[3vw] md:text-[0.9vw] text-gray-600 mb-3 line-clamp-2 flex-1">
              "Liked the service very much! Professional cleaning with attention to detail. Highly recommended for
              regular house cleaning."
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 transition-colors duration-300 ${
                    star <= 4
                      ? "fill-yellow-400 text-yellow-400 group-hover:fill-yellow-500 group-hover:text-yellow-500"
                      : "text-gray-300 group-hover:text-gray-400"
                  }`}
                />
              ))}
              <span className="text-[0.8vw] text-gray-500 ml-2 group-hover:text-gray-700 transition-colors duration-300">
                4.0
              </span>
            </div>
            <button className="absolute bottom-[4vw] right-[4vw] md:bottom-[1vw] md:right-[1vw] text-[3vw] md:text-[0.8vw] hover:cursor-pointer">Book Now</button>
          </div>

          {/* Hover Border */}
          <div className="absolute inset-0 border-[1px] border-transparent group-hover:border-[#c3c3c3] rounded-lg transition-all duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </div>
  );
}
