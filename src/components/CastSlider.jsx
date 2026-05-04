import React, { useRef } from "react";

function CastSlider({ cast }) {
  const sliderRef = useRef(null);

  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!cast || cast.length === 0) return null;

  return (
    <section className="py-8 group">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Top Cast
            </h2>
          </div>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => slide('left')}
              className="p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 text-white backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              onClick={() => slide('right')}
              className="p-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700 text-white backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cast.slice(0, 20).map((person) => {
            const profileUrl = person.profile_path
              ? `https://image.tmdb.org/t/p/w276_and_h350_face${person.profile_path}`
              : 'https://via.placeholder.com/276x350?text=No+Image';

            return (
              <div 
                key={person.cast_id || person.id} 
                className="w-[140px] md:w-[160px] flex-none snap-start"
              >
                <div className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-[3/4]">
                  <img 
                    src={profileUrl} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="mt-2 px-1 text-center">
                  <h3 className="text-white text-sm font-medium truncate">
                    {person.name}
                  </h3>
                  <p className="text-neutral-500 text-xs truncate mt-0.5">
                    {person.character}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CastSlider;
