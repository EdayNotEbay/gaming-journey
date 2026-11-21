import games from "../data/games.js"; // Import the shared game data.
import rankedGameNames from "../data/gameRankings.js"; // Import the personal ranking order.

// Return every game entry that matches one ranked title.
function getGamesByName(gameName) { // Receive one ranked game title.
  return games.filter(function (game) { // Search the complete game data.
    return game.name === gameName; // Keep entries that share the ranked title.
  }); // Finish finding matching game entries.
} // Finish the game-name helper.

// Return a comma-separated list of unique platforms for one ranked title.
function getPlatformText(matchingGames) { // Receive every platform entry for one title.
  const platformNames = []; // Start an empty unique platform list.

  matchingGames.forEach(function (game) { // Inspect every matching game entry.
    if (platformNames.includes(game.platform) === false) { // Check whether this platform is already listed.
      platformNames.push(game.platform); // Add the platform once.
    } // Finish checking the platform.
  }); // Finish inspecting matching game entries.

  return platformNames.join(", "); // Return the combined platform text.
} // Finish the platform-text helper.

// Return every unique genre assigned to one ranked title.
function getGenreText(matchingGames) { // Receive every platform entry for one title.
  const genreNames = []; // Start an empty unique genre list.

  matchingGames.forEach(function (game) { // Inspect every matching game entry.
    game.genres.forEach(function (genreName) { // Inspect every genre assigned to the current entry.
      if (genreNames.includes(genreName) === false) { // Check whether this genre is already listed.
        genreNames.push(genreName); // Add the genre once.
      } // Finish checking the genre.
    }); // Finish inspecting the current entry's genres.
  }); // Finish inspecting matching game entries.

  return genreNames.join(" • "); // Return the combined genre text.
} // Finish the genre-text helper.

// Return whether any version of one ranked title is marked as a favorite.
function getFavoriteState(matchingGames) { // Receive every platform entry for one title.
  let isFavorite = false; // Start by treating the ranked title as a normal game.

  matchingGames.forEach(function (game) { // Inspect every matching game entry.
    if (game.isFavorite === true) { // Check whether this version is marked as a favorite.
      isFavorite = true; // Mark the ranked title as a favorite.
    } // Finish checking the favorite state.
  }); // Finish inspecting matching game entries.

  return isFavorite; // Return the combined favorite state.
} // Finish the favorite-state helper.

// Build one unique ranking row for every title in the personal ranking order.
function getRankingRows() { // Build the complete ranking table data.
  const rankingRows = []; // Start an empty ranking row list.

  rankedGameNames.forEach(function (gameName, index) { // Inspect every title from best rank to lowest.
    const matchingGames = getGamesByName(gameName); // Find every platform entry for the ranked title.

    if (matchingGames.length > 0) { // Check whether the ranked title exists in the shared game data.
      const primaryGame = matchingGames[0]; // Use the first matching entry for shared cover and rating data.
      rankingRows.push({ // Add one unique row for the ranked title.
        rank: index + 1, // Store the one-based personal ranking position.
        name: gameName, // Store the ranked game title.
        cover: primaryGame.cover, // Store the shared cover artwork.
        platforms: getPlatformText(matchingGames), // Combine every platform for duplicate titles such as Phasmophobia.
        genres: getGenreText(matchingGames), // Combine every genre assigned to the ranked title.
        rating: primaryGame.rating, // Store the personal star rating out of five.
        isFavorite: getFavoriteState(matchingGames), // Store whether any version of the title is a favorite.
      }); // Finish adding the ranking row.
    } // Finish checking whether the ranked title exists.
  }); // Finish building ranking rows.

  return rankingRows; // Return the complete unique ranking table data.
} // Finish the ranking-row helper.

// Return the correct favorite badge class for one ranking row.
function getFavoriteClass(game) { // Receive one ranking row.
  let className = "ranking-favorite"; // Start with the normal favorite badge class.

  if (game.isFavorite === true) { // Check whether the ranked title is a favorite.
    className = className + " ranking-favorite-active"; // Add the purple favorite styling.
  } // Finish checking the favorite state.

  return className; // Return the complete favorite badge class name.
} // Finish the favorite-class helper.

// Return readable favorite text for one ranking row.
function getFavoriteText(game) { // Receive one ranking row.
  let favoriteText = "No"; // Start with the normal non-favorite label.

  if (game.isFavorite === true) { // Check whether the ranked title is a favorite.
    favoriteText = "Yes"; // Display the favorite label.
  } // Finish checking the favorite state.

  return favoriteText; // Return the favorite status text.
} // Finish the favorite-text helper.

// Display the complete personal game ranking table.
function GameRankingsPage() { // Create the Game Rankings page component.
  const rankingRows = getRankingRows(); // Build the unique ranked game rows.

  return ( // Return the complete Game Rankings page.
    <main className="page-content rankings-page"> {/* Create the main rankings content area. */}
      <section className="collection-hero"> {/* Introduce the rankings page. */}
        <p className="eyebrow">Personal Rankings</p> {/* Add a small label above the page title. */}
        <h2>Game Rankings</h2> {/* Display the page title. */}
        <p>My personal ranking from top to bottom. The numbered rank compares games against each other, while the star rating shows how highly I rate each game on its own.</p> {/* Explain the difference between rank and rating. */}
      </section> {/* Finish the rankings introduction. */}
      <section className="rankings-panel"> {/* Hold the complete ranking table. */}
        <div className="rankings-summary"> {/* Display a short summary above the table. */}
          <h3>My Top {rankingRows.length}</h3> {/* Display the total number of unique ranked titles. */}
          <span>Number 1 is my highest-ranked game.</span> {/* Explain the ranking direction. */}
        </div> {/* Finish the rankings summary. */}
        <div className="rankings-table-wrapper"> {/* Allow the table to scroll horizontally on smaller screens. */}
          <table className="rankings-table"> {/* Create the required game rankings table. */}
            <thead> {/* Start the table header. */}
              <tr> {/* Create the column heading row. */}
                <th scope="col">Rank</th> {/* Label the personal rank column. */}
                <th scope="col">Game</th> {/* Label the game column. */}
                <th scope="col">Platform</th> {/* Label the platform column. */}
                <th scope="col">Genres</th> {/* Label the multi-genre column. */}
                <th scope="col">My Personal Rating</th> {/* Label the five-star rating column. */}
                <th scope="col">Favorite</th> {/* Label the favorite-status column. */}
              </tr> {/* Finish the column heading row. */}
            </thead> {/* Finish the table header. */}
            <tbody> {/* Start the table body. */}
              {rankingRows.map(function (game) { /* Build one row for every unique ranked title. */
                return ( // Return the current ranking row.
                  <tr key={game.name}> {/* Keep each unique ranked title on its own table row. */}
                    <td className="rank-cell">#{game.rank}</td> {/* Display the personal rank number. */}
                    <td> {/* Start the game information cell. */}
                      <div className="rank-game-cell"> {/* Keep the cover beside the game title. */}
                        <img src={game.cover} alt={game.name + " cover"} draggable="false" /> {/* Display the game cover artwork. */}
                        <span>{game.name}</span> {/* Display the ranked game title. */}
                      </div> {/* Finish the game information layout. */}
                    </td> {/* Finish the game information cell. */}
                    <td>{game.platforms}</td> {/* Display every platform for the ranked title. */}
                    <td className="rank-genres-cell">{game.genres}</td> {/* Display every genre assigned to the ranked title. */}
                    <td><span className="ranking-rating">★ {game.rating.toFixed(1)} / 5</span></td> {/* Display the personal star rating out of five. */}
                    <td><span className={getFavoriteClass(game)}>{getFavoriteText(game)}</span></td> {/* Display the favorite status badge. */}
                  </tr> /* Finish the current ranking row. */
                ); // Finish returning the current ranking row.
              })} {/* Finish building ranking rows. */}
            </tbody> {/* Finish the table body. */}
          </table> {/* Finish the required rankings table. */}
        </div> {/* Finish the responsive table wrapper. */}
      </section> {/* Finish the rankings panel. */}
    </main> /* Finish the Game Rankings page content. */
  ); // Finish returning the Game Rankings page.
} // Finish the GameRankingsPage component.

export default GameRankingsPage; // Allow the router to display this page.
