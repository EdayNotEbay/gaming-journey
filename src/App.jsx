import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import the router tools used to switch between website pages.
import Navbar from "./components/Navbar.jsx"; // Import the shared site navigation.
import TimelinePage from "./pages/TimelinePage.jsx"; // Import the Gaming Timeline home page.
import GenresPage from "./pages/GenresPage.jsx"; // Import the Genres page.
import FavoriteGenresPage from "./pages/FavoriteGenresPage.jsx"; // Import the Favorite Genres page.
import FavoriteGamesPage from "./pages/FavoriteGamesPage.jsx"; // Import the Favorite Games page.
import GamingJourneyPage from "./pages/GamingJourneyPage.jsx"; // Import the My Gaming Journey page.
import GameRankingsPage from "./pages/GameRankingsPage.jsx"; // Import the Game Rankings page.
import RecommendGamePage from "./pages/RecommendGamePage.jsx"; // Import the recommendation page.
import "./App.css"; // Import the external website stylesheet.

// Display the full React website and its seven routes.
function App() { // Create the main application component.
  return ( // Return the router and shared website layout.
    <BrowserRouter> {/* Enable browser-based page routing. */}
      <div className="website"> {/* Wrap the complete website. */}
        <Navbar /> {/* Display the same navigation on every page. */}
        <Routes> {/* Match the browser address to the correct page. */}
          <Route path="/" element={<TimelinePage />} /> {/* Display the Gaming Timeline as the home page. */}
          <Route path="/genres" element={<GenresPage />} /> {/* Display the Genres page. */}
          <Route path="/favorite-genres" element={<FavoriteGenresPage />} /> {/* Display the Favorite Genres page. */}
          <Route path="/favorite-games" element={<FavoriteGamesPage />} /> {/* Display the Favorite Games page. */}
          <Route path="/my-gaming-journey" element={<GamingJourneyPage />} /> {/* Display the My Gaming Journey page. */}
          <Route path="/game-rankings" element={<GameRankingsPage />} /> {/* Display the Game Rankings page. */}
          <Route path="/recommend-me-a-game" element={<RecommendGamePage />} /> {/* Display the recommendation page. */}
          <Route path="*" element={<TimelinePage />} /> {/* Return unknown addresses to the Gaming Timeline. */}
        </Routes> {/* Finish the route list. */}
        <footer className="site-footer"> {/* Display the shared footer on every page. */}
          <p>My Gaming Journey</p> {/* Show the website name in the footer. */}
        </footer> {/* Finish the shared footer. */}
      </div> {/* Finish the complete website wrapper. */}
    </BrowserRouter> /* Finish the browser router. */
  ); // Finish returning the application layout.
} // Finish the App component.

export default App; // Allow main.jsx to render the application.
