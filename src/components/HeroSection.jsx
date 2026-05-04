import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../services/tmdbApi';
import { useMovieContext } from '../context/MovieContext';

function HeroSection() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist, openVideoModal } = useMovieContext();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await tmdbApi.getTrendingMovies();
        if (data.results && data.results.length > 0) {
          setMovies(data.results.slice(0, 5)); // Take top 5
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [movies]);

  const movie = movies[currentIndex];

  if (loading || !movie) {
    return (
      <div className="relative w-full h-screen bg-neutral-950 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path.startsWith('http') 
    ? movie.backdrop_path 
    : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* Background Image Carousel */}
      <AnimatePresence>
        <motion.div 
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      </AnimatePresence>

      {/* Heavy Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-0" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-0" />

      <div className="absolute inset-0 flex items-center z-10 container mx-auto px-4 md:px-8">
        <div className="max-w-4xl pt-32">
          <AnimatePresence mode="wait">
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >

            {/* Badges & Metadata */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-widest shadow-lg shadow-purple-600/30">
                FEATURED
              </span>

              <div className="flex items-center space-x-1.5 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
              </div>

              <span className="text-neutral-400 text-sm font-medium">{movie.release_date?.substring(0, 4)}</span>
              
              {movie.original_language && (
                <span className="text-neutral-400 text-sm font-medium uppercase border border-neutral-600 px-2 rounded">
                  {movie.original_language}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
              {movie.title || movie.original_title}
            </h1>

            {/* Overview */}
            <p className="text-neutral-300 text-lg md:text-xl mb-10 line-clamp-3 max-w-2xl drop-shadow-md leading-relaxed font-light">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => {
                  if (movie.trailer_url) {
                    openVideoModal(movie.trailer_url);
                  }
                }}
                className="bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-neutral-500/20 hover:bg-neutral-500/30 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md transform hover:scale-105"
              >
                More Info
              </button>

              <button 
                onClick={() => toggleWatchlist(movie)}
                className="p-4 rounded-full bg-neutral-500/20 hover:bg-neutral-500/30 text-white transition-all border border-white/20 backdrop-blur-md transform hover:scale-105 flex items-center justify-center"
                title={isInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {isInWatchlist(movie.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>

            </motion.div>
          </AnimatePresence>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-12 left-4 md:left-8 flex gap-2 z-20">
            {movies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex ? "w-8 bg-purple-500" : "w-4 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
