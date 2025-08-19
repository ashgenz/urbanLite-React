// src/components/ChefCard.jsx
import { Card2, CardContent2 } from "./Card2";

export default function ArrivalCard({Name,srrc,description}) {
  return (
    <div className="md:px-8 px-[4vw] pt-[2vw]">
      <Card2 className="overflow-hidden shadow-lg mt-[5vw] md:mt-0 border-0 h-[65vw] w-[40vw] md:w-[23vw] md:h-[17vw] md:min-h-200 " >
        <CardContent2 className="p-0 h-full flex flex-col">
          {/* Image Section */}
          <div className="h-3/4 overflow-hidden">
            <img
              src={srrc}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="h-1/2 p-4 flex flex-col justify-center">
            <h2 className="text-[4.4vw] md:text-[1.2vw] font-bold text-gray-800 mb-2 capitalize">{Name}</h2>
            <p className="text-[3vw]  md:text-[0.9vw] text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent2>
      </Card2>
    </div>
  );
}
