# 🎬 CineMax

CineMax is a premium, cinematic movie discovery application built with React and Tailwind CSS. It features a highly interactive UI with fluid animations, a custom SVG-animated preloading sequence, and a fully functional persistent watchlist system.

## ✨ Features

- **Cinematic Preloader**: A beautiful, custom SVG logo animation with infinitely scrolling background movie posters using Framer Motion and CSS keyframes.
- **Dynamic Watchlist**: Add and remove movies from your personal watchlist, persistently saved across sessions via browser `localStorage`.
- **Video Trailer Modals**: Seamless, glassmorphic video modals for playing movie trailers directly within the application without breaking context.
- **Advanced Filtering & Pagination**: Browse movies by specific genres and load additional pages of content with a dynamic "Load More" implementation.
- **Premium UI/UX**:
  - Custom skeleton loading cards with continuous shimmering gradient effects.
  - Staggered card reveal animations using Framer Motion.
  - Smooth hover scaling, drop-shadows, and micro-interactions.
- **Live TMDB Integration**: Movie data is fetched from TMDB using `VITE_TMDB_API_KEY`.

## 🛠️ Tech Stack

- **Core**: React (Vite)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion & CSS Keyframes
- **State Management**: React Context API (`MovieContext`)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory and install the dependencies:
   ```bash
   npm install
   ```
3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
4. Add your TMDB key in `.env`:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```
5. Start the local development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:5173`.

### Building for Production
To build the application for a production environment, run:
```bash
npm run build
```
This will compile and optimize all static assets into the `dist` folder.

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── Preloader.jsx    # SVG animation & infinite scrolling background
│   ├── HeroSection.jsx  # Dynamic hero banner
│   ├── MovieSlider.jsx  # Horizontal scrolling movie lists
│   ├── GenreSection.jsx # Grid layout with filtering
│   ├── VideoModal.jsx   # Framer motion trailer overlay
│   └── SkeletonCard.jsx # Shimmering loading state
├── context/
│   └── MovieContext.jsx # Global state for Watchlist & Modals
├── services/
│   └── tmdbApi.js       # TMDB API wrapper with normalized errors
├── App.jsx              # Main application layout and preloader logic
└── index.css            # Tailwind configuration and custom keyframes
```

## 🎨 Design System

The application is built around a **Sleek Dark Mode** aesthetic to provide a theater-like experience:
- **Base Backgrounds**: Pure Black (`#000000`) and Deep Neutrals (`neutral-900` to `neutral-950`).
- **Primary Accent**: Vibrant Purple (`purple-500` / `#a855f7`) used for the main logo, active states, and glowing drop-shadows.
- **Typography**: High contrast pure white for headings and muted grays (`neutral-400`) for secondary metadata like release years.
- **Secondary Accents**: Yellow (`yellow-500`) for star ratings and Red (`red-500`) for destructive actions/tags.
