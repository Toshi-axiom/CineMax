import React, { useState, useEffect, useRef } from "react";
import { useMovieContext } from "../context/MovieContext";
import SkeletonCard from "./SkeletonCard";

function MovieSlider({ title, fetchAction, moviesList }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const { openModal } = useMovieContext();

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
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-500 mb-4 animate-pulse">{title}</h2>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map(n => (
              <SkeletonCard key={n} className="w-[200px] md:w-[240px] flex-none" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) return null;

  return (
    <section className="py-8 group">
      <div className="container mx-auto px-4 relative">

        {/* Title + Arrows */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {title}
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

        {/* Cards */}
        <div 
          ref={sliderRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => {
            const posterUrl = movie.poster_path?.startsWith('http')
              ? movie.poster_path
              : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

            return (
              <div 
                key={movie.id} 
                className="w-[200px] md:w-[240px] flex-none cursor-pointer snap-start"
                onClick={() => openModal(movie)}
              >
                <div className="rounded-lg overflow-hidden bg-neutral-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 relative group/card">
                  <div className="aspect-[2/3] bg-neutral-700 relative">
                    <img 
                      src={posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <h3 className="text-white text-sm font-medium truncate">
                    {movie.title || movie.original_title}
                  </h3>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-neutral-300 text-xs font-medium">
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>

                    <span className="text-neutral-500 text-xs">
                      {movie.release_date?.substring(0, 4)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default MovieSlider;
