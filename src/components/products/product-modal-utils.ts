import React from 'react';
import { Star } from 'lucide-react';

export const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
  return [...Array(5)].map((_, i) => (
    React.createElement(Star, {
      key: i,
      className: `w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
        interactive ? 'cursor-pointer hover:text-yellow-400' : ''
      }`,
      onClick: () => interactive && onStarClick && onStarClick(i + 1)
    })
  ));
};