import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterState {
  search: string;
  category: string;
  condition: string;
  priceRange: [number, number];
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Sort by: Newest' },
  { value: 'oldest', label: 'Sort by: Oldest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'most_liked', label: 'Most Liked' },
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const updateFilter = (key: keyof FilterState, value: string | number | [number, number]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex justify-end mb-8">
      <Select
        value={filters.sortBy}
        onValueChange={(value) => updateFilter('sortBy', value)}
      >
        <SelectTrigger className="w-[200px] rounded-none border-2 border-primary">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="rounded-none">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductFilters;
