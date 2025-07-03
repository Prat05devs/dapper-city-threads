import React, { useState, useEffect } from 'react';
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
  IN: ['Delhi', 'Mumbai', 'Bangalore', 'Dehradun', 'Hyderabad', 'Kolkata', 'Pune'].map(name => ({ name })),
  US: ['New York City', 'Los Angeles', 'Chicago'].map(name => ({ name })),
  UK: ['London', 'Manchester'].map(name => ({ name })),
  AU: ['Sydney', 'Melbourne'].map(name => ({ name })),
  CA: ['Toronto', 'Vancouver'].map(name => ({ name })),
  UAE: ['Dubai'].map(name => ({ name })),
};

interface LocationSelectorProps {
  valueCountry?: string;
  valueCity?: string;
  onCountryChange?: (country: string) => void;
  onCityChange?: (city: string) => void;
  compact?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  valueCountry,
  valueCity,
  onCountryChange,
  onCityChange,
  compact = false,
}) => {
  const handleCountryChange = (newCountry: string) => {
    const defaultCity = citiesByCountry[newCountry][0].name;
    
    // Update both country and city
    onCountryChange?.(newCountry);
    onCityChange?.(defaultCity);
  };

  const handleCityChange = (newCity: string) => {
    onCityChange?.(newCity);
  };

  const countryObj = countries.find(c => c.code === valueCountry);

  if (compact) {
    return (
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Country Selector */}
        <div className="flex flex-col w-full sm:w-48">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Country</span>
          <Select value={valueCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full font-semibold text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition-all">
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
        <div className="flex flex-col w-full sm:w-48">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">City</span>
          <Select value={valueCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full font-semibold text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {citiesByCountry[valueCountry || 'IN'].map((c) => (
                <SelectItem key={c.name} value={c.name} className="text-base">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-purple-100 dark:border-gray-600 transition-colors duration-300">
      <div className="mb-3 text-center w-full">
        <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
          Select your city to see what's available near you
        </span>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Country Selector */}
        <div className="flex flex-col w-[140px] sm:w-60">
          <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">Country</span>
          <Select value={valueCountry} onValueChange={handleCountryChange}>
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
          <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">City</span>
          <Select value={valueCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full font-semibold text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {citiesByCountry[valueCountry || 'IN'].map((c) => (
                <SelectItem key={c.name} value={c.name} className="text-base">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Single source of truth for "Now browsing" */}
      <div className="mt-4 text-center w-full">
        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">
          Now browsing: {valueCity}, {countryObj?.name}
        </span>
      </div>
    </div>
  );
};

export default LocationSelector;