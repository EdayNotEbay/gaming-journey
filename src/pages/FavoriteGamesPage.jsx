import LibraryGameCard from "../components/LibraryGameCard.jsx"; // Import the reusable game gallery card.
import games from "../data/games.js"; // Import the shared game data.

// Return every game currently marked as a favorite.
function getFavoriteGames(gameList) { // Receive the complete game list.
  return gameList.filter(function (game) { // Filter the complete game list.
    return game.isFavorite === true; // Keep only favorite games.
  }); // Finish filtering the favorite games.
} // Finish the favorite-game helper.

// Display every game currently marked as a favorite.
function FavoriteGamesPage() { // Create the Favorite Games page component.
  const favoriteGames = getFavoriteGames(games); // Build the favorite-game list from shared data.

  return ( // Return the complete Favorite Games page.
    <main className="page-content collection-page"> {/* Create the main Favorite Games content area. */}
      <section className="collection-hero"> {/* Introduce the Favorite Games page. */}
        <p className="eyebrow">Purple Glow</p> {/* Connect this page to the favorite-card styling used on the timeline. */}
        <h2>Favorite Games</h2> {/* Display the page title. */}
        <p>These are the games currently marked as favorites. Click any game to open its genre on the Genres page.</p> {/* Explain the favorite-game interaction. */}
      </section> {/* Finish the Favorite Games introduction. */}
      <section className="collection-section"> {/* Display the complete favorite-game collection. */}
        <div className="collection-section-heading"> {/* Keep the section title and favorite count together. */}
          <h3>My Favorites</h3> {/* Label the favorite game collection. */}
          <span>{favoriteGames.length} favorite games</span> {/* Display the current favorite-game count. */}
        </div> {/* Finish the favorite section heading. */}
        <div className="favorite-page-legend"><span aria-hidden="true">☆</span> Purple glow = Favorite Game</div> {/* Explain the purple glow used on every card here. */}
        <div className="library-game-grid"> {/* Display favorite games in a responsive grid. */}
          {favoriteGames.map(function (game) { /* Build one card for every favorite game. */
            return <LibraryGameCard key={game.id} game={game} />; // Display the current favorite game.
          })} {/* Finish building favorite game cards. */}
        </div> {/* Finish the favorite game grid. */}
      </section> {/* Finish the favorite game collection. */}
    </main> /* Finish the Favorite Games page content. */
  ); // Finish returning the Favorite Games page.
} // Finish the FavoriteGamesPage component.

export default FavoriteGamesPage; // Allow the router to display this page.
