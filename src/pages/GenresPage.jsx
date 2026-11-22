import { useEffect, useState } from "react"; // Import React tools for the selected genre filter.
import { useLocation } from "react-router-dom"; // Import location so timeline clicks can choose a genre automatically.
import LibraryGameCard from "../components/LibraryGameCard.jsx"; // Import the reusable game gallery card.
import useGames from "../hooks/useGames.js"; // Import the reusable Cloudflare game-data loader.

// Return every unique genre assigned to any game.
function getGenreNames(gameList) { // Receive the complete game list.
  const genreNames = []; // Start an empty list of unique genre names.

  gameList.forEach(function (game) { // Inspect every game in the shared data.
    game.genres.forEach(function (genreName) { // Inspect every genre assigned to the current game.
      if (genreNames.includes(genreName) === false) { // Check whether this genre has already been added.
        genreNames.push(genreName); // Add the new genre once.
      } // Finish checking whether the genre is unique.
    }); // Finish inspecting the current game's genres.
  }); // Finish inspecting the games.

  genreNames.sort(); // Keep the genre filter buttons in alphabetical order.

  return genreNames; // Return the unique genre names.
} // Finish the genre-name helper.

// Read the requested genre passed from another page.
function getRequestedGenre(location) { // Receive the current router location.
  let requestedGenre = "All"; // Default to showing every genre.

  if (location.state !== null) { // Check whether another page passed route state.
    if (location.state.genre !== undefined) { // Check whether the route state includes a genre.
      requestedGenre = location.state.genre; // Use the requested genre as the starting filter.
    } // Finish checking for a route genre.
  } // Finish checking the route state.

  return requestedGenre; // Return the requested starting genre.
} // Finish the requested-genre helper.

// Return the games that match the active genre filter.
function getDisplayedGames(gameList, selectedGenre) { // Receive the complete game list and active genre.
  if (selectedGenre === "All") { // Check whether every genre should be shown.
    return gameList; // Return the complete game list.
  } // Finish checking the All filter.

  return gameList.filter(function (game) { // Filter the complete game list.
    return game.genres.includes(selectedGenre); // Keep games that contain the selected genre anywhere in their genre array.
  }); // Finish filtering the games.
} // Finish the displayed-game helper.

// Return the correct CSS class for a genre filter button.
function getGenreButtonClass(genreName, selectedGenre) { // Receive the button genre and current selection.
  let className = "genre-filter-button"; // Start with the normal genre button class.

  if (genreName === selectedGenre) { // Check whether this button represents the active genre.
    className = className + " genre-filter-button-active"; // Add the selected button style.
  } // Finish checking the active genre.

  return className; // Return the complete button class name.
} // Finish the genre-button class helper.

// Display all games with interactive multi-genre filtering.
function GenresPage() { // Create the Genres page component.
  const location = useLocation(); // Read route state passed from timeline or gallery cards.
  const gameData = useGames(); // Load the built-in games plus any games saved in D1.
  const games = gameData.games; // Read the current complete game list.
  const [selectedGenre, setSelectedGenre] = useState(getRequestedGenre(location)); // Store the currently displayed genre.
  const genreNames = getGenreNames(games); // Build the available genre filter list from every genre array.
  const displayedGames = getDisplayedGames(games, selectedGenre); // Build the game list for the active genre.

  // Update the filter when another page routes here with a genre.
  useEffect(function () { // Run whenever the router location changes.
    setSelectedGenre(getRequestedGenre(location)); // Apply the genre passed through route state.
  }, [location]); // Repeat when the location object changes.

  // Change the displayed genre from a filter button.
  function handleGenreClick(event) { // Receive the clicked genre button.
    setSelectedGenre(event.currentTarget.dataset.genre); // Read the button genre and make it active.
  } // Finish the genre filter handler.

  return ( // Return the complete Genres page.
    <main className="page-content collection-page"> {/* Create the main Genres content area. */}
      <section className="collection-hero"> {/* Introduce the Genres page. */}
        <p className="eyebrow">Game Library</p> {/* Add a small page label above the title. */}
        <h2>Genres</h2> {/* Display the page title. */}
        <p>Explore the games I have played by genre. Games can appear in multiple genre sections when more than one genre applies.</p> {/* Explain the multi-genre page behavior. */}
      </section> {/* Finish the Genres introduction. */}
      <section className="genre-filter-panel" aria-label="Game genre filters"> {/* Group all selectable genre filters. */}
        <button type="button" className={getGenreButtonClass("All", selectedGenre)} data-genre="All" onClick={handleGenreClick}>All</button> {/* Let visitors show every game. */}
        {genreNames.map(function (genreName) { /* Build one button for every genre. */
          return <button key={genreName} type="button" className={getGenreButtonClass(genreName, selectedGenre)} data-genre={genreName} onClick={handleGenreClick}>{genreName}</button>; // Display the current genre filter button.
        })} {/* Finish building the genre filters. */}
      </section> {/* Finish the genre filter panel. */}
      <section className="collection-section"> {/* Display the games matching the selected filter. */}
        <div className="collection-section-heading"> {/* Keep the selected genre and count together. */}
          <h3>{selectedGenre}</h3> {/* Display the active genre name. */}
          <span>{displayedGames.length} games</span> {/* Display the number of games in the active filter. */}
        </div> {/* Finish the collection heading. */}
        <div className="library-game-grid"> {/* Display equal-sized game cards in a responsive grid. */}
          {displayedGames.map(function (game) { /* Build one gallery card for every displayed game. */
            return <LibraryGameCard key={game.id} game={game} />; // Display the current game card.
          })} {/* Finish building the displayed game cards. */}
        </div> {/* Finish the game grid. */}
      </section> {/* Finish the displayed game section. */}
    </main> /* Finish the Genres page content. */
  ); // Finish returning the Genres page.
} // Finish the GenresPage component.

export default GenresPage; // Allow the router to display this page.
