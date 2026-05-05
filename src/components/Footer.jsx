import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-neutral-800 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-black text-3xl tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] font-heading">
                Cine<span className="text-white font-medium tracking-normal">Max</span>
              </span>
            </Link>
            <p className="text-neutral-400 max-w-sm">
              Your ultimate cinematic destination. Discover, track, and immerse yourself in the world of premium entertainment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm font-heading">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-neutral-400 hover:text-white transition-colors text-sm">Watchlist</Link>
              </li>
              <li>
                <button className="text-neutral-400 hover:text-white transition-colors text-sm">Top Rated</button>
              </li>
              <li>
                <button className="text-neutral-400 hover:text-white transition-colors text-sm">Trending Now</button>
              </li>
            </ul>
          </div>

          {/* Legal / API Attribution */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm font-heading">Legal</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <button className="text-neutral-400 hover:text-white transition-colors text-sm">Privacy Policy</button>
              </li>
              <li>
                <button className="text-neutral-400 hover:text-white transition-colors text-sm">Terms of Service</button>
              </li>
            </ul>
            
            <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800 inline-block">
              <p className="text-xs text-neutral-500 flex flex-col items-start gap-2">
                <span>Data provided by TMDB</span>
                <img 
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
                  alt="TMDB Logo" 
                  className="h-3 opacity-50 grayscale"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} CineMax. All rights reserved.
          </p>
          
          {/* Social Icons (Dummy) */}
          <div className="flex space-x-4">
            {['Twitter', 'Instagram', 'YouTube'].map(social => (
              <button key={social} className="text-neutral-500 hover:text-white transition-colors">
                <span className="sr-only">{social}</span>
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-[10px] font-bold">{social[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
