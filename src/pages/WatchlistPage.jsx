import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";

function WatchlistPage() {
  const { watchlist, toggleWatchlist } = useMovieContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight">My Watchlist</h1>
        
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-neutral-900/30 rounded-3xl border border-neutral-800/50 backdrop-blur-sm">
            <div className="w-24 h-24 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Your collection is empty</h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-10 text-lg font-light">
              Explore our vast library of movies and add your favorites to keep track of what you want to watch next.
            </p>
            <Link to="/" className="bg-white hover:bg-neutral-200 text-black px-10 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-xl shadow-white/10">
              Explore Movies
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
          >
            {watchlist.map((movie) => (
              <motion.div key={movie.id} variants={itemVariants} className="relative group">
                <Link to={`/movie/${movie.id}`} className="block relative aspect-[2/3] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg shadow-black/50 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-purple-500/20">
                  {movie.poster_path ? (
                    <img 
                      src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-neutral-500 text-sm font-medium">{movie.title}</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-base font-bold truncate">{movie.title}</span>
                        <div className="flex items-center gap-1.5 text-yellow-500 text-sm font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {movie.vote_average?.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Remove from watchlist button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWatchlist(movie);
                  }}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110 z-10 backdrop-blur-md border border-white/10 shadow-lg"
                  title="Remove from Watchlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WatchlistPage;
