import React, { createContext, useState, useContext, useEffect } from 'react';

const MovieContext = createContext();

export const useMovieContext = () => {
  return useContext(MovieContext);
};

export const MovieProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('movieAppWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('movieAppWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const isPresent = prev.some((m) => m.id === movie.id);
      if (isPresent) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const openVideoModal = (url) => {
    setVideoUrl(url);
    setIsVideoModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setVideoUrl('');
    setIsVideoModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <MovieContext.Provider 
      value={{ 
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        isVideoModalOpen,
        videoUrl,
        openVideoModal,
        closeVideoModal
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
