import React from "react";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import Navbar from "./components/Navbar";
import VideoModal from "./components/VideoModal";
import Preloader from "./components/Preloader";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import WatchlistPage from "./pages/WatchlistPage";

function App() {
  const [showPreloader, setShowPreloader] = React.useState(true);

  return (
    <MovieProvider>
      {showPreloader && <Preloader onFinish={() => setShowPreloader(false)} />}
      
      <div 
        style={{ 
          height: showPreloader ? '100vh' : 'auto', 
          overflow: showPreloader ? 'hidden' : 'auto',
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 0.5s ease-in'
        }}
        className="min-h-screen bg-black text-white relative"
      >
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>

        <VideoModal />
      </div>
    </MovieProvider>
  );
}

export default App;
