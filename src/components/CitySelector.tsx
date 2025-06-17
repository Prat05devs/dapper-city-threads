
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
  { name: 'Delhi', region: 'National Capital Territory' },
  { name: 'Bengaluru', region: 'Karnataka' },
  { name: 'Dehradun', region: 'Uttarakhand' },
  { name: 'Mumbai', region: 'Maharashtra' },
];

const CitySelector = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <div className="bg-green-50 border-b border-green-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">Shopping in:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-green-700 font-medium hover:text-green-800">
                {selectedCity.name}
                <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className="flex flex-col items-start p-3"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-sm text-gray-500">{city.region}</span>
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
