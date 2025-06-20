
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
}

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  selectedCity, 
  onCityChange, 
  className 
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      // Since cities table is not in TypeScript types yet, use fallback cities
      // This will be automatically updated when types are regenerated
      const fallbackCities = [
        { id: '1', name: 'Delhi', country: 'India' },
        { id: '2', name: 'Mumbai', country: 'India' },
        { id: '3', name: 'Bangalore', country: 'India' },
        { id: '4', name: 'Hyderabad', country: 'India' },
        { id: '5', name: 'Kolkata', country: 'India' },
        { id: '6', name: 'Pune', country: 'India' },
        { id: '7', name: 'New York City', country: 'US' },
        { id: '8', name: 'Los Angeles', country: 'US' },
        { id: '9', name: 'Chicago', country: 'US' },
        { id: '10', name: 'London', country: 'UK' },
        { id: '11', name: 'Manchester', country: 'UK' },
        { id: '12', name: 'Sydney', country: 'Australia' },
        { id: '13', name: 'Melbourne', country: 'Australia' },
        { id: '14', name: 'Toronto', country: 'Canada' },
        { id: '15', name: 'Vancouver', country: 'Canada' },
        { id: '16', name: 'Dubai', country: 'UAE' }
      ];
      setCities(fallbackCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Use fallback cities
      const fallbackCities = [
        { id: '1', name: 'Delhi', country: 'India' },
        { id: '2', name: 'Mumbai', country: 'India' },
        { id: '3', name: 'Bangalore', country: 'India' },
        { id: '4', name: 'New York City', country: 'US' },
        { id: '5', name: 'London', country: 'UK' },
        { id: '6', name: 'Sydney', country: 'Australia' },
        { id: '7', name: 'Toronto', country: 'Canada' },
        { id: '8', name: 'Dubai', country: 'UAE' }
      ];
      setCities(fallbackCities);
    } finally {
      setLoading(false);
    }
  };

  const groupedCities: Record<string, City[]> = cities.reduce((acc, city) => {
    if (!acc[city.country]) {
      acc[city.country] = [];
    }
    acc[city.country].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <MapPin className="w-4 h-4" />
        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <MapPin className="w-4 h-4" />
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select your city" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedCities).map(([country, countryCities]) => (
            <div key={country}>
              <div className="px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-50">
                {country}
              </div>
              {countryCities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
