import { Card3, CardContent3 } from "./Card3"
import { Star } from "lucide-react"

export default function Whyus({feature,description}) {
  return (
    <Card3 className="w-[65vw] shadow-md mb-[1vw] rounded-md">
      <CardContent3 className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Star className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">{feature}</h3>
            <p className="text-sm text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </CardContent3>
    </Card3>
  )
}
