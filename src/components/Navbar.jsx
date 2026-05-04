import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tmdbApi } from "../services/tmdbApi";

function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const searchMovies = async () => {
      if (query.trim() === "") {
        setResults([]);
        setShowResults(false);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      setShowResults(true);
      
      try {
        const data = await tmdbApi.searchMovies(query);
        if (data.results) {
          setResults(data.results.slice(0, 5)); // Limit to 5 results for dropdown
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (movie) => {
    navigate(`/movie/${movie.id}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-neutral-900/90 to-transparent pt-4 pb-12">
      <div className="container mx-auto px-4">

        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-purple-500 font-black text-3xl tracking-tighter">
                Cine<span className="text-white font-medium tracking-normal">Max</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-purple-400 transition-colors font-medium">Home</Link>
            <Link to="/watchlist" className="text-neutral-300 hover:text-purple-400 transition-colors font-medium">Watchlist</Link>
          </nav>

          {/* Search */}
          <div className="hidden md:block relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if(query) setShowResults(true) }}
              className="bg-neutral-800/80 text-white px-4 py-2 rounded-full text-sm w-48 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-neutral-500 border border-neutral-700/50"
            />

            {/* Spinner */}
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <svg
                  className="w-4 h-4 text-purple-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}

            {/* Search Results */}
            {showResults && results.length > 0 && (
              <div className="absolute mt-2 w-72 bg-neutral-800 rounded-lg shadow-2xl overflow-hidden z-50 border border-neutral-700">
                <ul className="divide-y divide-neutral-700/50">
                  {results.map((movie) => {
                    const posterUrl = movie.poster_path?.startsWith('http')
                      ? movie.poster_path
                      : `https://image.tmdb.org/t/p/w92${movie.poster_path}`;

                    return (
                      <li key={movie.id} className="hover:bg-neutral-700 transition-colors">
                        <button 
                          onClick={() => handleResultClick(movie)}
                          className="flex items-center p-3 w-full text-left"
                        >
                          <div className="w-10 h-14 bg-neutral-900 rounded overflow-hidden flex-shrink-0">
                            {movie.poster_path ? (
                              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs text-center">
                                No Img
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{movie.title || movie.original_title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-yellow-500 font-medium">★ {movie.vote_average?.toFixed(1)}</span>
                              <span className="text-xs text-neutral-400">{movie.release_date?.substring(0, 4)}</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* No Results */}
            {showResults && !isSearching && query && results.length === 0 && (
              <div className="absolute mt-2 w-72 bg-neutral-800 rounded-lg shadow-2xl overflow-hidden z-50 border border-neutral-700">
                <div className="p-4 text-center text-neutral-400 text-sm">
                  No movies found matching "{query}"
                </div>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button 
            className="md:hidden text-white relative z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-neutral-900 border-l border-neutral-800 z-40 p-6 flex flex-col md:hidden"
            >
              <div className="flex flex-col space-y-6 mt-16">
                <Link 
                  to="/" 
                  className="text-2xl font-semibold text-white hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/watchlist" 
                  className="text-2xl font-semibold text-neutral-300 hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Watchlist
                </Link>
                
                <div className="pt-6 border-t border-neutral-800">
                  <p className="text-neutral-500 text-sm mb-4">Search</p>
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if(query) setShowResults(true) }}
                    className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-neutral-500 border border-neutral-700/50"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
