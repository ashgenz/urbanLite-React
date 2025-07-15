// src/components/ChefCard.jsx
import { Card2, CardContent2 } from "./Card2";

export default function ArrivalCard({Name,srrc,description}) {
  return (
    <div className="px-8 pt-[2vw]">
      <Card2 className="overflow-hidden shadow-lg border-0" style={{ width: "23vw", height: "15vw", minWidth: 280, minHeight: 200 }}>
        <CardContent2 className="p-0 h-full flex flex-col">
          {/* Image Section */}
          <div className="h-3/4 overflow-hidden">
            <img
              src={srrc}
              alt="Chef cooking"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="h-1/2 p-4 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2 capitalize">{Name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent2>
      </Card2>
    </div>
  );
}
