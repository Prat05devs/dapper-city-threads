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
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-purple-100 dark:border-gray-600 transition-colors duration-300">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
          <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Hunting in:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-purple-700 dark:text-purple-400 font-semibold hover:text-purple-800 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 px-2 sm:px-3 transition-colors duration-200">
                <span className="mr-1">{selectedCity.flag}</span>
                {selectedCity.name}
                <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 bg-white dark:bg-gray-800 border shadow-lg dark:border-gray-700">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className="flex items-center space-x-3 p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-900 dark:text-gray-100"
                >
                  <span className="text-lg">{city.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{city.region}</span>
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