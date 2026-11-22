import { useEffect, useState } from "react"; // Import React tools used to load game data.
import fallbackGames from "../data/games.js"; // Import the built-in games used during local development or API failure.

// Load the combined built-in and D1 game collection.
function useGames() { // Create the reusable game-data hook.
  const [games, setGames] = useState(fallbackGames); // Start with the built-in game list so the site always has content.
  const [isLoading, setIsLoading] = useState(true); // Track whether the API request is still running.

  // Request the newest combined game list from Cloudflare.
  async function loadGames() { // Create the reusable game-loading function.
    try { // Start protected API loading.
      const response = await fetch("/api/games"); // Request the combined built-in and D1 game list.
      if (response.ok === false) { // Check whether the API request failed.
        setGames(fallbackGames); // Keep the built-in games when the API is unavailable.
        setIsLoading(false); // Mark loading as finished after the failed request.
        return; // Stop before reading a failed response.
      } // Finish checking the response status.
      const data = await response.json(); // Read the API response as JSON.
      if (Array.isArray(data.games) === true) { // Check whether the API returned a valid game array.
        setGames(data.games); // Replace the local list with the combined Cloudflare game list.
      } // Finish checking the returned game data.
    } catch { // Handle local development or network failure.
      setGames(fallbackGames); // Keep the built-in games when Cloudflare Functions are unavailable.
    } // Finish protected API loading.
    setIsLoading(false); // Mark loading as finished.
  } // Finish the game-loading function.

  useEffect(function () { // Load Cloudflare game data when the page first opens.
    loadGames(); // Request the newest combined game list.
  }, []); // Run the initial load only once.

  return { games: games, isLoading: isLoading, refreshGames: loadGames }; // Return the game data and refresh controls together.
} // Finish the reusable game-data hook.

export default useGames; // Allow pages to reuse the Cloudflare game loader.
