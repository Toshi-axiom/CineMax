import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_MOVIES } from '../services/mockTmdbData';

const Preloader = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep the preloader visible for 3.5 seconds to let the animation play out, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 800); // wait for exit animation to complete before removing from DOM
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Animation Variants
  const reelVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const holeVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 0.5, delay: 1 }
    }
  };

  const playBtnVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -90 },
    show: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 12, delay: 1.2 }
    }
  };

  const pixelVariants = {
    hidden: { opacity: 0, scale: 0, x: -20, y: -20 },
    show: (i) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 100, delay: 1.4 + (i * 0.1) }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.6 } }
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 1.8 + (i * 0.1) }
    })
  };

  const postersRow1 = [...MOCK_MOVIES, ...MOCK_MOVIES];
  const postersRow2 = [...MOCK_MOVIES].reverse();
  const postersRow2Double = [...postersRow2, ...postersRow2];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Animated Background Posters */}
          <div className="absolute inset-0 z-0 opacity-80 flex flex-col gap-6 justify-center -rotate-6 scale-125">
            {/* Row 1: Scrolling Left */}
            <div className="flex w-max animate-scroll-left gap-6">
              {postersRow1.map((movie, idx) => (
                <div key={`r1-${idx}`} className="w-40 md:w-56 aspect-[2/3] flex-none rounded-xl overflow-hidden border border-neutral-800/50 shadow-2xl shadow-black/80">
                  <img src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className="w-full h-full object-cover grayscale opacity-90" />
                </div>
              ))}
            </div>
            
            {/* Row 2: Scrolling Right */}
            <div className="flex w-max animate-scroll-right gap-6">
              {postersRow2Double.map((movie, idx) => (
                <div key={`r2-${idx}`} className="w-40 md:w-56 aspect-[2/3] flex-none rounded-xl overflow-hidden border border-neutral-800/50 shadow-2xl shadow-black/80">
                  <img src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className="w-full h-full object-cover grayscale opacity-90" />
                </div>
              ))}
            </div>
            
             {/* Row 3: Scrolling Left */}
            <div className="flex w-max animate-scroll-left gap-6">
              {postersRow1.map((movie, idx) => (
                <div key={`r3-${idx}`} className="w-40 md:w-56 aspect-[2/3] flex-none rounded-xl overflow-hidden border border-neutral-800/50 shadow-2xl shadow-black/80">
                  <img src={movie.poster_path?.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className="w-full h-full object-cover grayscale opacity-90" />
                </div>
              ))}
            </div>
          </div>

          {/* Dark Overlay to pop the logo */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/90"></div>

          {/* Background glow */}
          <div className="absolute z-10 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>

          <div className="relative z-20 flex flex-col items-center justify-center">
            
            {/* The Custom SVG Logo */}
            <svg width="240" height="240" viewBox="0 0 200 200" className="drop-shadow-2xl overflow-visible">
              <defs>
                <linearGradient id="reelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d8b4fe" /> {/* purple-300 */}
                  <stop offset="50%" stopColor="#a855f7" /> {/* purple-500 */}
                  <stop offset="100%" stopColor="#7e22ce" /> {/* purple-700 */}
                </linearGradient>
              </defs>

              {/* Main Film Reel 'C' Arc */}
              {/* Draws a C shape starting from top right (160, 40) down to bottom right (160, 160) */}
              <motion.path 
                d="M 150 40 A 70 70 0 1 0 140 160" 
                fill="none" 
                stroke="url(#reelGrad)" 
                strokeWidth="35" 
                strokeLinecap="butt"
                variants={reelVariants}
                initial="hidden"
                animate="show"
              />

              {/* Inner Film Holes (using stroke-dasharray over the arc to cut out holes) */}
              {/* To make holes, we draw an inner and outer dashed stroke with the background color */}
              <motion.path 
                d="M 152 41 A 68 68 0 1 0 142 161" 
                fill="none" 
                stroke="#0a0a0a" /* neutral-950 background color */
                strokeWidth="6" 
                strokeDasharray="4 8"
                variants={holeVariants}
                initial="hidden"
                animate="show"
              />
              <motion.path 
                d="M 148 39 A 72 72 0 1 0 138 159" 
                fill="none" 
                stroke="#0a0a0a" 
                strokeWidth="6" 
                strokeDasharray="4 8"
                variants={holeVariants}
                initial="hidden"
                animate="show"
              />

              {/* Play Button */}
              <motion.polygon 
                points="85,80 85,120 120,100" 
                fill="#ffffff" 
                variants={playBtnVariants}
                initial="hidden"
                animate="show"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}
              />

              {/* Dissolving Pixels at the bottom right edge of the 'C' */}
              <g fill="#a855f7">
                {[
                  { x: 145, y: 155, s: 8 },
                  { x: 155, y: 150, s: 6 },
                  { x: 165, y: 145, s: 10 },
                  { x: 140, y: 168, s: 7 },
                  { x: 152, y: 162, s: 9 },
                  { x: 160, y: 168, s: 5 },
                  { x: 172, y: 155, s: 6 }
                ].map((px, i) => (
                  <motion.rect 
                    key={i}
                    x={px.x} 
                    y={px.y} 
                    width={px.s} 
                    height={px.s} 
                    custom={i}
                    variants={pixelVariants}
                    initial="hidden"
                    animate="show"
                  />
                ))}
              </g>

              {/* Bottom Text "CineMax" */}
              <motion.text 
                x="100" y="210" 
                textAnchor="middle" 
                fontSize="36" 
                fontWeight="900" 
                fontFamily="sans-serif"
                variants={textVariants}
                initial="hidden"
                animate="show"
              >
                <tspan fill="#d8b4fe">Cine</tspan>
                <tspan fill="#ffffff">Max</tspan>
              </motion.text>

              {/* Dotted curve under text */}
              <g fill="#a855f7">
                {[
                  { cx: 70, cy: 230, r: 2 },
                  { cx: 85, cy: 226, r: 3 },
                  { cx: 100, cy: 224, r: 4 },
                  { cx: 115, cy: 226, r: 3 },
                  { cx: 130, cy: 230, r: 2 }
                ].map((dot, i) => (
                  <motion.circle 
                    key={i}
                    cx={dot.cx} 
                    cy={dot.cy} 
                    r={dot.r} 
                    custom={i}
                    variants={dotVariants}
                    initial="hidden"
                    animate="show"
                  />
                ))}
              </g>

            </svg>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
