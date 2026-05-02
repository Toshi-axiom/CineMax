import React from "react";
import { MovieProvider, useMovieContext } from "./context/MovieContext";
import Navbar from "./components/Navbar";
import MovieSlider from "./components/MovieSlider";
import HeroSection from "./components/HeroSection";
import GenreSection from "./components/GenreSection";
import MovieDetails from "./components/MovieDetails";
import VideoModal from "./components/VideoModal";
import Preloader from "./components/Preloader";
import { tmdbApi } from "./services/tmdbApi";

function MainApp() {
  const { watchlist } = useMovieContext();
  
  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
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
      
      <MovieDetails />
      <VideoModal />
    </div>
  );
}

function App() {
  const [showPreloader, setShowPreloader] = React.useState(true);

  return (
    <MovieProvider>
      {showPreloader && <Preloader onFinish={() => setShowPreloader(false)} />}
      
      {/* We keep MainApp mounted so it can fetch data in the background */}
      <div 
        style={{ 
          height: showPreloader ? '100vh' : 'auto', 
          overflow: showPreloader ? 'hidden' : 'auto',
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 0.5s ease-in'
        }}
      >
        <MainApp />
      </div>
    </MovieProvider>
  );
}

export default App;
