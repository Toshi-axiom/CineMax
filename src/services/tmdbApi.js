// src/services/tmdbApi.js
import { MOCK_MOVIES, MOCK_GENRES } from './mockTmdbData';

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const tmdbApi = {
  getTrendingMovies: async () => {
    await delay(600);
    return { results: [...MOCK_MOVIES].sort(() => 0.5 - Math.random()) };
  },

  getPopularMovies: async () => {
    await delay(600);
    return { results: [...MOCK_MOVIES].sort((a, b) => b.popularity - a.popularity) };
  },

  getTopRatedMovies: async () => {
    await delay(600);
    return { results: [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average) };
  },

  searchMovies: async (query) => {
    await delay(400);
    if (!query) return { results: [] };
    const lowerQuery = query.toLowerCase();
    const results = MOCK_MOVIES.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.overview.toLowerCase().includes(lowerQuery)
    );
    return { results };
  },

  getGenres: async () => {
    await delay(300);
    return { genres: MOCK_GENRES };
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    await delay(600);
    let results = MOCK_MOVIES.filter((movie) => movie.genre_ids.includes(genreId));
    
    // Simulate more data on subsequent pages
    if (page > 1) {
      results = results.map(movie => ({
        ...movie,
        id: movie.id + (page * 1000) // Ensure unique keys for new items
      })).sort(() => 0.5 - Math.random());
    }
    
    return { 
      results,
      page,
      total_pages: 5
    };
  },
};
