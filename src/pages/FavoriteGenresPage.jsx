import { useNavigate } from "react-router-dom"; // Import navigation so favorite genres can open the Genres page.
import useGames from "../hooks/useGames.js"; // Import the reusable Cloudflare game-data loader.

// Return every game currently marked as a favorite.
function getFavoriteGames(gameList) { // Receive the complete game list.
  return gameList.filter(function (game) { // Filter the complete game list.
    return game.isFavorite === true; // Keep only confirmed favorite games.
  }); // Finish filtering the favorite games.
} // Finish the favorite-game helper.

// Return unique genres represented by favorite games.
function getFavoriteGenreNames(favoriteGames) { // Receive the favorite-game list.
  const genreNames = []; // Start an empty list of favorite genres.

  favoriteGames.forEach(function (game) { // Inspect every favorite game.
    game.genres.forEach(function (genreName) { // Inspect every genre assigned to the current favorite game.
      if (genreNames.includes(genreName) === false) { // Check whether this favorite genre has already been added.
        genreNames.push(genreName); // Add the favorite genre once.
      } // Finish checking whether the favorite genre is unique.
    }); // Finish inspecting the current favorite game's genres.
  }); // Finish inspecting favorite games.

  genreNames.sort(); // Keep favorite genre cards in alphabetical order.

  return genreNames; // Return the favorite genre names.
} // Finish the favorite-genre helper.

// Return every played game from one genre.
function getGamesForGenre(gameList, genreName) { // Receive the complete game list and one genre.
  return gameList.filter(function (game) { // Filter the complete game list.
    return game.genres.includes(genreName); // Keep games that contain the requested genre.
  }); // Finish filtering the genre games.
} // Finish the genre-game helper.

// Return favorite games from one genre.
function getFavoriteGamesForGenre(favoriteGames, genreName) { // Receive favorite games and one genre.
  return favoriteGames.filter(function (game) { // Filter the favorite-game list.
    return game.genres.includes(genreName); // Keep favorite games that contain the requested genre.
  }); // Finish filtering favorite games for the genre.
} // Finish the favorite-games-by-genre helper.

// Display genres represented by the user's favorite games.
function FavoriteGenresPage() { // Create the Favorite Genres page component.
  const navigate = useNavigate(); // Create navigation for opening a selected genre.
  const gameData = useGames(); // Load the built-in games plus any games saved in D1.
  const games = gameData.games; // Read the current complete game list.
  const favoriteGames = getFavoriteGames(games); // Build the current favorite-game list from Cloudflare data.
  const favoriteGenreNames = getFavoriteGenreNames(favoriteGames); // Build favorite genres from every favorite game's genre array.

  // Open the full Genres page for the selected favorite genre.
  function openFavoriteGenre(event) { // Receive the clicked favorite-genre card.
    navigate("/genres", { state: { genre: event.currentTarget.dataset.genre } }); // Open Genres with this genre selected.
  } // Finish the favorite-genre click handler.

  return ( // Return the complete Favorite Genres page.
    <main className="page-content collection-page"> {/* Create the main Favorite Genres content area. */}
      <section className="collection-hero"> {/* Introduce the Favorite Genres page. */}
        <p className="eyebrow">Favorites</p> {/* Add a small page label above the title. */}
        <h2>Favorite Genres</h2> {/* Display the page title. */}
        <p>These genres are generated from every genre assigned to my favorite games. Click a genre to view all games I have played in that genre.</p> {/* Explain how multi-genre favorites work. */}
      </section> {/* Finish the Favorite Genres introduction. */}
      <section className="favorite-genre-grid"> {/* Display one summary card for every favorite genre. */}
        {favoriteGenreNames.map(function (genreName) { /* Build a summary card for the current favorite genre. */
          const genreGames = getGamesForGenre(games, genreName); // Get every played game in the current genre.
          const genreFavoriteGames = getFavoriteGamesForGenre(favoriteGames, genreName); // Get favorite games from the current genre.
          const previewGames = genreGames.slice(0, 4); // Keep the preview compact with at most four covers.
          return ( // Return the current favorite-genre card.
            <button key={genreName} type="button" className="favorite-genre-card" data-genre={genreName} onClick={openFavoriteGenre}> {/* Make the complete favorite-genre panel clickable. */}
              <div className="favorite-genre-card-heading"> {/* Group the genre title and favorite badge. */}
                <h3>{genreName}</h3> {/* Display the favorite genre name. */}
                <span>{genreFavoriteGames.length} favorite</span> {/* Display the number of favorite games from this genre. */}
              </div> {/* Finish the favorite-genre heading. */}
              <div className="favorite-genre-preview"> {/* Preview games played in this genre. */}
                {previewGames.map(function (game) { /* Build one cover preview for the genre. */
                  return <img key={game.id} src={game.cover} alt="" draggable="false" />; // Display the current game cover as a visual preview.
                })} {/* Finish building the genre preview covers. */}
              </div> {/* Finish the game-cover preview. */}
              <div className="favorite-genre-card-footer"> {/* Display summary information below the covers. */}
                <span>{genreGames.length} games played</span> {/* Display the total games played in this genre. */}
                <span>View genre</span> {/* Explain the card action. */}
              </div> {/* Finish the favorite-genre summary footer. */}
            </button> /* Finish the favorite-genre card. */
          ); // Finish returning the current favorite genre.
        })} {/* Finish building the favorite genres. */}
      </section> {/* Finish the favorite genre grid. */}
    </main> /* Finish the Favorite Genres page content. */
  ); // Finish returning the Favorite Genres page.
} // Finish the FavoriteGenresPage component.

export default FavoriteGenresPage; // Allow the router to display this page.
