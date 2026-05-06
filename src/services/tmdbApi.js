const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchFromApi = async (endpoint, params = {}) => {
  if (!API_KEY) {
    throw new Error('TMDB API key is missing. Add VITE_TMDB_API_KEY in your .env file.');
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid TMDB API key. Check VITE_TMDB_API_KEY and try again.');
      }
      if (response.status === 429) {
        throw new Error('TMDB rate limit reached. Please wait and try again.');
      }
      throw new Error(`TMDB API error (${response.status}): ${response.statusText}`);
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

  searchMovies: async (query, page = 1) => {
    if (!query) return { results: [] };
    return fetchFromApi('/search/movie', { query, page });
  },

  getGenres: async () => {
    return fetchFromApi('/genre/movie/list');
  },

  discoverMovies: async (filters = {}, page = 1) => {
    return fetchFromApi('/discover/movie', { ...filters, page });
  },
};
