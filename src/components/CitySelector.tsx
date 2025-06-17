
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const cities = [
  { name: 'Delhi', region: 'National Capital Territory', flag: '🇮🇳' },
  { name: 'Bengaluru', region: 'Karnataka', flag: '🇮🇳' },
  { name: 'Dehradun', region: 'Uttarakhand', flag: '🇮🇳' },
  { name: 'Mumbai', region: 'Maharashtra', flag: '🇮🇳' },
];

const CitySelector = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span className="text-gray-700 font-medium">Hunting in:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-purple-700 font-semibold hover:text-purple-800 hover:bg-purple-100 px-2 sm:px-3">
                <span className="mr-1">{selectedCity.flag}</span>
                {selectedCity.name}
                <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 bg-white border shadow-lg">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className="flex items-center space-x-3 p-3 hover:bg-purple-50"
                >
                  <span className="text-lg">{city.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-sm text-gray-500">{city.region}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
