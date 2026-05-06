import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { tmdbApi } from "../services/tmdbApi";
import SkeletonCard from "./SkeletonCard";
import { InlineEmpty, InlineError } from "./SectionState";

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

function GenreSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // Sync state with URL
  const activeGenre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";

  const updateFilters = (key, value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbApi.getGenres();
        if (data.genres) {
          setGenres(data.genres);
          if (data.genres.length > 0 && !searchParams.get("genre")) {
            // Default to first genre, use replace to not bloat history
            setSearchParams(prev => {
              prev.set("genre", data.genres[0].id);
              return prev;
            }, { replace: true });
          }
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!activeGenre) return;
    
    const fetchMoviesByFilters = async () => {
      setLoading(true);
      setError("");
      setPage(1);
      try {
        const filters = {
          with_genres: activeGenre,
          ...(year && { primary_release_year: year }),
          ...(rating && { 'vote_average.gte': rating })
        };
        const data = await tmdbApi.discoverMovies(filters, 1);
        if (data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages || 1);
        }
      } catch (error) {
        console.error("Error fetching movies by filters:", error);
        setError(error.message || "Unable to fetch movies for these filters.");
      } finally {
        setLoading(false);
      }
    };
    fetchMoviesByFilters();
  }, [activeGenre, year, rating]);

  const handleLoadMore = async () => {
    if (loadingMore || page >= totalPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const filters = {
        with_genres: activeGenre,
        ...(year && { primary_release_year: year }),
        ...(rating && { 'vote_average.gte': rating })
      };
      const data = await tmdbApi.discoverMovies(filters, nextPage);
      if (data.results) {
        setMovies(prev => [...prev, ...data.results]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
      setError(error.message || "Unable to load more movies.");
    } finally {
      setLoadingMore(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 25 }, (_, index) => String(currentYear - index));

  return (
    <section className="py-16 bg-neutral-900/50">
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Discover
          </h2>
          
          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-3">
            <select 
              value={year}
              onChange={(e) => updateFilters("year", e.target.value)}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none cursor-pointer text-sm font-medium"
            >
              <option value="">All Years</option>
              {yearOptions.map((yearValue) => (
                <option key={yearValue} value={yearValue}>
                  {yearValue}
                </option>
              ))}
            </select>

            <select 
              value={rating}
              onChange={(e) => updateFilters("rating", e.target.value)}
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-neutral-700/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none cursor-pointer text-sm font-medium"
            >
              <option value="">Any Rating</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
            </select>
          </div>
        </div>

        {/* Genre buttons */}
        <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex space-x-3 min-w-max">
            {genres.map(genre => (
              <button 
                key={genre.id}
                onClick={() => updateFilters("genre", genre.id.toString())}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeGenre === genre.id.toString() 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/40 border border-purple-500/50' 
                    : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700/50 backdrop-blur-sm'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : error ? (
          <InlineError message={error} onRetry={handleLoadMore} />
        ) : movies.length === 0 ? (
          <InlineEmpty
            title="No movies found"
            description="Try changing genre, year, or rating filters."
          />
        ) : (
          <>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {movies.map(movie => {
                const posterUrl = movie.poster_path?.startsWith('http')
                  ? movie.poster_path
                  : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

                return (
                  <motion.div variants={item} key={movie.id} className="group cursor-pointer" onClick={() => navigate(`/movie/${movie.id}`)}>
                    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] group/card border border-neutral-800 hover:border-purple-500/50">
                      <div className="aspect-[2/3] overflow-hidden relative">
                        <img 
                          src={posterUrl} 
                          alt={movie.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Hover popup */}
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
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 text-yellow-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                              >
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
    </section>
  );
}

export default GenreSection;
