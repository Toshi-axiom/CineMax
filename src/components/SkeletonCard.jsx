import React from 'react';

const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="aspect-[2/3] bg-neutral-800 rounded-lg animate-pulse relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/4"></div>
          <div className="h-3 bg-neutral-800 rounded animate-pulse w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
