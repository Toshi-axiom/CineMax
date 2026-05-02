import React, { useEffect, useState } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import { useMovieContext } from '../context/MovieContext';

function HeroSection() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openModal, toggleWatchlist, isInWatchlist, openVideoModal } = useMovieContext();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await tmdbApi.getTrendingMovies();
        if (data.results && data.results.length > 0) {
          // Pick a random movie from trending to feature
          const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
          setMovie(randomMovie);
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading || !movie) {
    return (
      <div className="relative w-full h-screen bg-neutral-900 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path.startsWith('http') 
    ? movie.backdrop_path 
    : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div className="relative w-full h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-neutral-900 transition-all duration-700"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center z-10 container mx-auto px-4">
        <div className="max-w-3xl pt-20">
          <div className="transition-all duration-700 animate-fade-in-up">

            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-purple-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-sm tracking-wider">
                FEATURED
              </span>

              <div className="flex items-center bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm font-medium text-white">{movie.vote_average?.toFixed(1)}</span>
              </div>

              <span className="text-neutral-400">•</span>
              <span className="text-neutral-300 text-sm">{movie.release_date?.substring(0, 4)}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
              {movie.title || movie.original_title}
            </h1>

            <p className="text-neutral-300 text-base md:text-lg mb-10 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-md leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  if (movie.trailer_url) {
                    openVideoModal(movie.trailer_url);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-500/30 transform hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Play Trailer
              </button>

              <button 
                onClick={() => openModal(movie)}
                className="bg-neutral-800/60 hover:bg-neutral-700/80 text-white px-8 py-3.5 rounded-lg flex items-center gap-2 transition-all border border-neutral-600 backdrop-blur-sm transform hover:-translate-y-1"
              >
                More Info
              </button>

              <button 
                onClick={() => toggleWatchlist(movie)}
                className={`${isInWatchlist(movie.id) ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' : 'bg-neutral-800/60 hover:bg-neutral-700/80 text-white border-neutral-600'} px-8 py-3.5 rounded-lg flex items-center gap-2 transition-all border backdrop-blur-sm transform hover:-translate-y-1`}
              >
                {isInWatchlist(movie.id) ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    In Watchlist
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Watchlist
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
