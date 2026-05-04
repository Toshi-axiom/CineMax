import React from "react";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import Navbar from "./components/Navbar";
import VideoModal from "./components/VideoModal";
import Preloader from "./components/Preloader";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import WatchlistPage from "./pages/WatchlistPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const [showPreloader, setShowPreloader] = React.useState(true);

  return (
    <MovieProvider>
      {showPreloader && <Preloader onFinish={() => setShowPreloader(false)} />}
      
      {/* Navbar outside the transition container so `fixed` positioning works correctly against the viewport */}
      <Navbar />
      
      <div 
        style={{ 
          height: showPreloader ? '100vh' : 'auto', 
          overflow: showPreloader ? 'hidden' : 'auto',
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 0.5s ease-in'
        }}
        className="min-h-screen bg-[#050505] text-white relative"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        <VideoModal />
      </div>
    </MovieProvider>
  );
}

export default App;
