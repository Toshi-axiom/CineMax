const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromApi = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

export const tmdbApi = {
  getMovieDetails: async (id) => {
    const data = await fetchFromApi(`/movie/${id}`, { append_to_response: 'videos,credits,similar,reviews' });
    
    // Extract trailer URL to maintain compatibility with existing components
    let trailer_url = null;
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
      if (trailer) {
        trailer_url = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
      }
    }
    
    return { ...data, trailer_url };
  },

  getTrendingMovies: async () => {
    return fetchFromApi('/trending/movie/week');
  },

  getPopularMovies: async () => {
    return fetchFromApi('/movie/popular');
  },

  getTopRatedMovies: async () => {
    return fetchFromApi('/movie/top_rated');
  },

  searchMovies: async (query) => {
    if (!query) return { results: [] };
    return fetchFromApi('/search/movie', { query });
  },

  getGenres: async () => {
    return fetchFromApi('/genre/movie/list');
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    return fetchFromApi('/discover/movie', { with_genres: genreId, page });
  },
};
