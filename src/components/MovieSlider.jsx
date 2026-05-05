import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";
import ExpandableMovieCard from "./ExpandableMovieCard";

function MovieSlider({ title, fetchAction, moviesList }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (moviesList) {
      setMovies(moviesList);
      setLoading(false);
      return;
    }

    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchAction();
        if (data.results) {
          setMovies(data.results);
        }
      } catch (error) {
        console.error(`Error fetching movies for ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };
    if (fetchAction) {
      loadMovies();
    }
  }, [fetchAction, title, moviesList]);

  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -sliderRef.current.offsetWidth + 100 : sliderRef.current.offsetWidth - 100;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-500 mb-4 animate-pulse">{title}</h2>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <SkeletonCard key={n} className="w-[200px] md:w-[240px] flex-none" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) return null;

  return (
    <section className="py-4 md:py-8 group relative">
      <div className="container mx-auto px-4 md:px-8">

        {/* Title */}
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        {/* Navigation Arrows - Netflix style, full height of slider, appearing on hover */}
        <button 
          onClick={() => slide('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bottom-0 w-12 md:w-16 h-[200px] md:h-[240px] z-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm rounded-r-lg mt-10 md:mt-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 scale-y-150" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={() => slide('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bottom-0 w-12 md:w-16 h-[200px] md:h-[240px] z-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm rounded-l-lg mt-10 md:mt-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 scale-y-150" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Cards */}
        {/* We keep overflow-x-auto but we will allow children to break out of y using the fixed overlay in ExpandableMovieCard */}
        <div 
          ref={sliderRef}
          className="flex space-x-2 md:space-x-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 md:-mx-8 md:px-8 scrollbar-hide snap-x relative z-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <ExpandableMovieCard key={movie.id} movie={movie} />
          ))}
        </div>

      </div>
    </section>
  );
}

export default MovieSlider;
