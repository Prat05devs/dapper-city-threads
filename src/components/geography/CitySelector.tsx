
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('country', { ascending: true })
        .order('name', { ascending: true });

      if (data && !error) {
        setCities(data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedCities = cities.reduce((acc, city) => {
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
