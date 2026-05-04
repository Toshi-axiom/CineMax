import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tmdbApi } from "../services/tmdbApi";
import SkeletonCard from "../components/SkeletonCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setPage(1);
      try {
        const data = await tmdbApi.searchMovies(query, 1);
        if (data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages || 1);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await tmdbApi.searchMovies(query, nextPage);
      if (data.results) {
        setMovies(prev => [...prev, ...data.results]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more search results:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Search Results for <span className="text-purple-500">"{query}"</span>
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-neutral-400 mb-4">No movies found matching "{query}"</h2>
            <p className="text-neutral-500">Try adjusting your search terms or browsing our genres.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {movies.map((movie) => {
                const posterUrl = movie.poster_path?.startsWith('http')
                  ? movie.poster_path
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                return (
                  <motion.div 
                    variants={item} 
                    key={movie.id} 
                    className="group cursor-pointer" 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] group/card border border-neutral-800 hover:border-purple-500/50">
                      <div className="aspect-[2/3] overflow-hidden relative">
                        {movie.poster_path ? (
                          <img 
                            src={posterUrl} 
                            alt={movie.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-neutral-600 p-4 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">No Poster</span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                          <div className="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md text-sm font-medium shadow-lg backdrop-blur-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 px-1">
                      <h3 className="text-white text-sm font-medium truncate">
                        {movie.title || movie.original_title}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-neutral-300 text-xs font-medium">{movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <span className="text-neutral-500 text-xs">{movie.release_date?.substring(0, 4)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {page < totalPages && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
