import React from "react";
import { useMovieContext } from "../context/MovieContext";
import MovieSlider from "../components/MovieSlider";
import HeroSection from "../components/HeroSection";
import GenreSection from "../components/GenreSection";
import { tmdbApi } from "../services/tmdbApi";

function HomePage() {
  const { watchlist } = useMovieContext();
  
  return (
    <>
      <HeroSection />
      
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 pb-20">
        {watchlist && watchlist.length > 0 && (
          <div id="watchlist">
            <MovieSlider title="My Watchlist" moviesList={watchlist} />
          </div>
        )}

        <div id="trending">
          <MovieSlider title="Trending Now" fetchAction={tmdbApi.getTrendingMovies} />
        </div>
        
        <div id="popular">
          <MovieSlider title="Popular Picks" fetchAction={tmdbApi.getPopularMovies} />
        </div>
        
        <GenreSection />
        
        <div id="top-rated">
          <MovieSlider title="Top Rated" fetchAction={tmdbApi.getTopRatedMovies} />
        </div>
      </div>
    </>
  );
}

export default HomePage;
