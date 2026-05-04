import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";
import { tmdbApi } from "../services/tmdbApi";

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    toggleWatchlist,
    isInWatchlist,
    openVideoModal
  } = useMovieContext();

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await tmdbApi.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-neutral-950">
        <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-purple-600 px-6 py-2 rounded-lg text-white font-medium"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-950 pb-20"
    >
      {/* DETAILS CONTENT */}
      <div>
        <div className="relative h-64 md:h-[50vh] w-full bg-neutral-900">
          {movie.backdrop_path && (
            <img 
              src={movie.backdrop_path?.startsWith('http') ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
              alt={`${movie.title} backdrop`}
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 -mt-32 md:-mt-48 relative z-10">
            
            {/* Poster */}
            <div className="w-48 md:w-80 flex-shrink-0 mx-auto md:mx-0">
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-neutral-800 aspect-[2/3] bg-neutral-900">
                {movie.poster_path ? (
                  <img 
                    src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    No poster
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 mt-4 md:mt-16 text-center md:text-left pb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                {movie.title || movie.original_title}
                {movie.release_date && (
                  <span className="text-neutral-500 font-normal text-3xl md:text-5xl ml-3">
                    ({movie.release_date.substring(0, 4)})
                  </span>
                )}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-sm font-medium">
                <div className="flex items-center gap-1.5 bg-neutral-900 px-4 py-2 rounded-md border border-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-base">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-neutral-500 ml-1">({movie.vote_count} votes)</span>
                </div>

                <span className="text-neutral-400 bg-neutral-900 px-4 py-2 rounded-md border border-neutral-800 text-base">
                  {movie.original_language?.toUpperCase() || 'EN'}
                </span>
                
                {movie.adult && (
                  <span className="text-red-400 bg-red-500/10 px-4 py-2 rounded-md border border-red-500/20 text-base">
                    18+
                  </span>
                )}
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-white mb-4">Overview</h3>
                <p className="text-neutral-300 leading-relaxed text-lg max-w-3xl mx-auto md:mx-0">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>

              <div className="mt-12 flex gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => {
                    if (movie.trailer_url) {
                      openVideoModal(movie.trailer_url);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2 text-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Play Trailer
                </button>
                <button 
                  onClick={() => toggleWatchlist(movie)}
                  className={`${isInWatchlist(movie.id) ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700'} px-8 py-3.5 rounded-lg font-medium transition-colors border flex items-center gap-2 text-lg`}
                >
                  {isInWatchlist(movie.id) ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Watchlist
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MoviePage;
