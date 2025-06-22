
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LocationSelector from '@/components/LocationSelector';

interface LocationButtonProps {
  country: string;
  city: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
}

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'UK', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UAE', name: 'UAE', flag: '🇦🇪' },
];

const LocationButton = ({ country, city, onCountryChange, onCityChange }: LocationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const countryObj = countries.find((c) => c.code === country);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 h-auto"
        >
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-600 flex-shrink-0" />
          <span className="text-gray-700 font-medium truncate max-w-[120px] sm:max-w-none">
            <span className="hidden sm:inline">Trending in </span>
            {city}, {countryObj?.name}
          </span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-gray-500 flex-shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[420px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Select Your Location</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <LocationSelector
            valueCountry={country}
            valueCity={city}
            onCountryChange={onCountryChange}
            onCityChange={onCityChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationButton;
