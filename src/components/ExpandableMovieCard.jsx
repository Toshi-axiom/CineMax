import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovieContext } from '../context/MovieContext';

const ExpandableMovieCard = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const cardRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useMovieContext();

  const posterUrl = movie.poster_path?.startsWith('http')
    ? movie.poster_path
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const backdropUrl = movie.backdrop_path?.startsWith('http')
    ? movie.backdrop_path
    : `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        setIsExpanded(true);
      }
    }, 500); // 500ms delay before expanding
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) setIsExpanded(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also attach to the parent slider to close on horizontal scroll
    const slider = cardRef.current?.closest('.overflow-x-auto');
    if (slider) {
      slider.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (slider) slider.removeEventListener('scroll', handleScroll);
    };
  }, [isExpanded]);

  // Adjust left position so card doesn't expand off screen
  let adjustedLeft = position.left;
  const expansionWidth = position.width * 1.5; // We scale by 1.5 approx
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  if (position.left + expansionWidth > screenWidth) {
    adjustedLeft = screenWidth - expansionWidth - 20; // 20px padding from edge
  }
  if (position.left < 20) {
    adjustedLeft = 20;
  }

  return (
    <>
      {/* Base Card */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="w-[200px] md:w-[240px] flex-none cursor-pointer snap-start relative group/card"
      >
        <div className="rounded-md overflow-hidden bg-neutral-900 transition-colors duration-300 relative border border-transparent">
          <div className="aspect-[2/3] bg-neutral-800 relative overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover rounded-md"
              loading="lazy"
            />
          </div>
        </div>

        {/* Text underneath when not expanded (Optional, Netflix often just shows poster) */}
        <div className={`mt-2 px-1 transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="text-white text-sm font-medium truncate">
            {movie.title || movie.original_title}
          </h3>
        </div>
      </div>

      {/* Expanded Overlay Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 1,
              top: position.top,
              left: position.left,
              width: position.width,
              height: position.height
            }}
            animate={{ 
              opacity: 1, 
              scale: 1.25, // Netflix style scale
              top: position.top - (position.height * 0.125), // Adjust top to center scale
              left: adjustedLeft,
              width: position.width,
              height: 'auto',
              zIndex: 100 // High z-index to overlay everything
            }}
            exit={{ 
              opacity: 0, 
              scale: 1,
              transition: { duration: 0.2 }
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              setIsExpanded(true);
            }}
            onMouseLeave={handleMouseLeave}
            className="fixed rounded-lg bg-[#181818] shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden border border-neutral-800"
            style={{ transformOrigin: 'center center' }}
          >
            {/* Top Image/Video Section */}
            <div 
              className="relative aspect-video w-full cursor-pointer bg-neutral-800"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={backdropUrl || posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg drop-shadow-md truncate">
                  {movie.title || movie.original_title}
                </h3>
              </div>
            </div>

            {/* Bottom Details Section */}
            <div className="p-4 bg-[#181818]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
                    className="w-8 h-8 md:w-10 md:h-10 border-2 border-neutral-500 bg-neutral-900/50 rounded-full flex items-center justify-center hover:border-white transition-colors text-white"
                  >
                    {isInWatchlist(movie.id) ? (
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                  className="w-8 h-8 md:w-10 md:h-10 border-2 border-neutral-500 bg-neutral-900/50 rounded-full flex items-center justify-center hover:border-white transition-colors text-white"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-green-500 font-medium">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="border border-neutral-600 px-1 text-xs text-neutral-300 rounded">
                  {movie.adult ? '18+' : '13+'}
                </span>
                <span className="text-neutral-300">
                  {movie.release_date?.substring(0, 4)}
                </span>
              </div>
              
              <div className="text-xs text-neutral-400 font-medium capitalize line-clamp-1">
                {movie.original_language === 'en' ? 'English' : movie.original_language} • HD
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpandableMovieCard;
