import React, { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'UK', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UAE', name: 'UAE', flag: '🇦🇪' },
];

const citiesByCountry: Record<string, { name: string }[]> = {
  IN: [
    { name: 'Delhi' },
    { name: 'Mumbai' },
    { name: 'Bangalore' },
    { name: 'Hyderabad' },
    { name: 'Kolkata' },
    { name: 'Pune' },
  ],
  US: [
    { name: 'New York City' },
    { name: 'Los Angeles' },
    { name: 'Chicago' },
  ],
  UK: [
    { name: 'London' },
    { name: 'Manchester' },
  ],
  AU: [
    { name: 'Sydney' },
    { name: 'Melbourne' },
  ],
  CA: [
    { name: 'Toronto' },
    { name: 'Vancouver' },
  ],
  UAE: [{ name: 'Dubai' }],
};

const LocationSelector: React.FC = () => {
  const [country, setCountry] = useState('IN');
  const [city, setCity] = useState(citiesByCountry['IN'][0].name);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity(citiesByCountry[value][0].name);
  };

  return (
    <div className="w-full flex flex-row flex-wrap items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-purple-100 dark:border-gray-600 transition-colors duration-300">
      
      {/* Country Selector */}
      <div className="flex flex-col w-[140px] sm:w-60">
        <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
          Country
        </span>
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full font-semibold text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code} className="flex items-center gap-2 text-base">
                <span className="text-lg">{c.flag}</span>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selector */}
      <div className="flex flex-col w-[140px] sm:w-60">
        <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
          City
        </span>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full font-semibold text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {citiesByCountry[country].map((cityObj) => (
              <SelectItem key={cityObj.name} value={cityObj.name} className="text-base">
                {cityObj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
