import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FlyToLocation = ({ coords }) => {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 15, { duration: 1.5 });
  }
  return null;
};

const ClickToSetMarker = ({ setMarker }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
    },
  });
  return null;
};
  let seeMarker;
  let setMarker3;
const LocationPicker2 = () => {
  const [marker, setMarker] = useState([0,0]); // Default: Delhi
  const [search, setSearch] = useState('');
  const [flyCoords, setFlyCoords] = useState(null);

  setMarker3=function(marker){
    setMarker([marker[0],marker[1]])
    setFlyCoords([parseFloat(marker[0]),parseFloat(marker[1])])
  }

  const handleSearch = async () => {
    if (!search) return alert('Please enter an address');
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: search,
          format: 'json',
          limit: 1,
        },
      });

      if (res.data.length > 0) {
        const location = res.data[0];
        const latLng = [parseFloat(location.lat), parseFloat(location.lon)];
        setMarker(latLng);
        setFlyCoords(latLng);
      } else {
        alert('No location found');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to search location');
    }
  };

seeMarker=function(){
    if(marker[0]!=0)return true;
    else false;
  }
  return (
    <div>
      {/* Search Bar */}
      <div className=" absolute mb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter Location..."
          className=" relative z-10 w-[120px]   md:w-[125px] h-[8px] left-[65px] top-[0px] p-2 border border-gray-300 rounded bg-white"
        />
        <button
          onClick={handleSearch}
          className="relative z-10 ml-2 px-3 bg-blue-500 text-white rounded left-[60px] top-[0vw] h-[20px] w-[70px] md:h-[20px] md:w-[60px] md:text-[13px]"
        >
          Search
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={marker}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '99.89%', height: '202px' }}
        className=' top-[-0.5vw] z-0 rounded-xl '
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker[0] != null && <Marker position={marker} />}

        <FlyToLocation coords={flyCoords} />
        <ClickToSetMarker setMarker={setMarker} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker2;
export  {seeMarker,setMarker3};
