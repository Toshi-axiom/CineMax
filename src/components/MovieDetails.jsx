import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";

function MovieDetails() {
  const { 
    selectedMovie, 
    isModalOpen, 
    closeModal,
    toggleWatchlist,
    isInWatchlist,
    openVideoModal
  } = useMovieContext();

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  return (
    <AnimatePresence>
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          
          {/* Background click to close */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={closeModal}
          ></motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-neutral-900 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-neutral-800 z-10 scrollbar-hide"
          >

            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors backdrop-blur-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* DETAILS CONTENT */}
            <div>
              <div className="relative h-64 md:h-96 w-full bg-neutral-800">
                {selectedMovie.backdrop_path && (
                  <img 
                    src={selectedMovie.backdrop_path?.startsWith('http') ? selectedMovie.backdrop_path : `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`} 
                    alt={`${selectedMovie.title} backdrop`}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
              </div>

              <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 -mt-32 md:-mt-48 relative">
                  
                  {/* Poster */}
                  <div className="w-40 md:w-64 flex-shrink-0 mx-auto md:mx-0">
                    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black border border-neutral-700/50 aspect-[2/3] bg-neutral-800">
                      {selectedMovie.poster_path ? (
                        <img 
                          src={selectedMovie.poster_path?.startsWith('http') ? selectedMovie.poster_path : `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                          alt={selectedMovie.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          No poster
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 mt-4 md:mt-16 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                      {selectedMovie.title || selectedMovie.original_title}
                      {selectedMovie.release_date && (
                        <span className="text-neutral-400 font-normal text-2xl md:text-4xl ml-3">
                          ({selectedMovie.release_date.substring(0, 4)})
                        </span>
                      )}
                    </h1>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm font-medium">
                      <div className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-md border border-neutral-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white">{selectedMovie.vote_average?.toFixed(1)}</span>
                        <span className="text-neutral-500 ml-1">({selectedMovie.vote_count} votes)</span>
                      </div>

                      <span className="text-neutral-300 bg-neutral-800 px-3 py-1.5 rounded-md border border-neutral-700">
                        {selectedMovie.original_language?.toUpperCase() || 'EN'}
                      </span>
                      
                      {selectedMovie.adult && (
                        <span className="text-red-400 bg-red-400/10 px-3 py-1.5 rounded-md border border-red-400/20">
                          18+
                        </span>
                      )}
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
                      <p className="text-neutral-300 leading-relaxed md:text-lg">
                        {selectedMovie.overview || "No overview available for this movie."}
                      </p>
                    </div>

                    <div className="mt-10 flex gap-4 justify-center md:justify-start">
                      <button 
                        onClick={() => {
                          if (selectedMovie.trailer_url) {
                            openVideoModal(selectedMovie.trailer_url);
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Play Trailer
                      </button>
                      <button 
                        onClick={() => toggleWatchlist(selectedMovie)}
                        className={`${isInWatchlist(selectedMovie.id) ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'} px-8 py-3 rounded-lg font-medium transition-colors border flex items-center gap-2`}
                      >
                        {isInWatchlist(selectedMovie.id) ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            In Watchlist
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MovieDetails;
