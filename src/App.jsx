import React from "react";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VideoModal from "./components/VideoModal";
import Preloader from "./components/Preloader";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import WatchlistPage from "./pages/WatchlistPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [showPreloader, setShowPreloader] = React.useState(true);

  return (
    <MovieProvider>
      {showPreloader && <Preloader onFinish={() => setShowPreloader(false)} />}
      
      {/* Navbar outside the transition container so `fixed` positioning works correctly against the viewport */}
      <Navbar />
      
      <div 
        style={{ 
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 0.5s ease-in'
        }}
        className="min-h-screen bg-[#050505] text-white relative flex flex-col"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
        <VideoModal />
      </div>
    </MovieProvider>
  );
}

export default App;
