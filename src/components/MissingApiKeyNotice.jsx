import React from "react";

function MissingApiKeyNotice() {
  return (
    <div className="min-h-screen bg-neutral-950 px-6 pt-28 text-white">
      <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8">
        <h1 className="text-3xl font-bold">TMDB API key required</h1>
        <p className="mt-4 text-neutral-300">
          This app needs <code>VITE_TMDB_API_KEY</code> in your local environment before movie data can be loaded.
        </p>
        <div className="mt-5 rounded-lg border border-neutral-700 bg-neutral-950 p-4 text-sm text-neutral-300">
          <p>1. Create a <code>.env</code> file in the project root.</p>
          <p className="mt-2">2. Add: <code>VITE_TMDB_API_KEY=your_key_here</code></p>
          <p className="mt-2">3. Restart the dev server.</p>
        </div>
      </div>
    </div>
  );
}

export default MissingApiKeyNotice;

