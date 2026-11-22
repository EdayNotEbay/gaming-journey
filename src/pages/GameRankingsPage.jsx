import useGames from "../hooks/useGames.js"; // Import the reusable Cloudflare game-data loader.
import rankedGameNames from "../data/gameRankings.js"; // Import the original personal title order used to break rating ties.

// Return every game entry that matches one title.
function getGamesByName(gameList, gameName) { // Receive the complete game list and one game title.
  return gameList.filter(function (game) { // Search the complete game data.
    return game.name === gameName; // Keep entries that share the requested title.
  }); // Finish finding matching game entries.
} // Finish the game-name helper.

// Return a comma-separated list of unique platforms for one title.
function getPlatformText(matchingGames) { // Receive every platform entry for one title.
  const platformNames = []; // Start an empty unique platform list.
  matchingGames.forEach(function (game) { // Inspect every matching game entry.
    if (platformNames.includes(game.platform) === false) { // Check whether this platform is already listed.
      platformNames.push(game.platform); // Add the platform once.
    } // Finish checking the platform.
  }); // Finish inspecting matching game entries.
  return platformNames.join(", "); // Return the combined platform text.
} // Finish the platform-text helper.

// Return every unique genre assigned to one title.
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

// Return whether any version of one title is marked as a favorite.
function getFavoriteState(matchingGames) { // Receive every platform entry for one title.
  let isFavorite = false; // Start by treating the title as a normal game.
  matchingGames.forEach(function (game) { // Inspect every matching game entry.
    if (game.isFavorite === true) { // Check whether this version is marked as a favorite.
      isFavorite = true; // Mark the title as a favorite.
    } // Finish checking the favorite state.
  }); // Finish inspecting matching game entries.
  return isFavorite; // Return the combined favorite state.
} // Finish the favorite-state helper.

// Build the unique title order used when two games have the same star rating.
function getTieOrderNames(gameList) { // Receive the current complete game list.
  const orderedNames = []; // Start an empty unique title list.
  rankedGameNames.forEach(function (gameName) { // Inspect every title from the original personal order.
    if (getGamesByName(gameList, gameName).length > 0) { // Check whether the title still exists in the current game data.
      orderedNames.push(gameName); // Keep the original title order for rating ties.
    } // Finish checking whether the original title exists.
  }); // Finish inspecting the original title order.
  gameList.forEach(function (game) { // Inspect every current game entry.
    if (orderedNames.includes(game.name) === false) { // Check whether this added title is already represented.
      orderedNames.push(game.name); // Append new titles after existing titles for the same rating.
    } // Finish checking whether the added title is unique.
  }); // Finish inspecting current game entries.
  return orderedNames; // Return the complete tie-breaking title order.
} // Finish the tie-order helper.

// Build one reusable ranking row from matching game entries.
function createRankingRow(gameName, matchingGames, tieOrder) { // Receive one title, its matching entries, and its tie-breaking position.
  const primaryGame = matchingGames[0]; // Use the first matching entry for shared cover and rating data.
  return { // Return the complete ranking row.
    name: gameName, // Store the game title.
    cover: primaryGame.cover, // Store the shared cover artwork.
    platforms: getPlatformText(matchingGames), // Combine every platform for duplicate titles.
    genres: getGenreText(matchingGames), // Combine every genre assigned to the title.
    rating: primaryGame.rating, // Store the personal star rating out of five.
    isFavorite: getFavoriteState(matchingGames), // Store whether any version of the title is a favorite.
    tieOrder: tieOrder, // Store the original or added order used only when ratings are equal.
  }; // Finish returning the ranking row.
} // Finish the ranking-row creator.

// Sort every unique game by rating while preserving the desired order inside equal rating groups.
function getRankingRows(gameList) { // Receive the current complete game list.
  const tieOrderNames = getTieOrderNames(gameList); // Build the order used when two games share the same rating.
  const rankingRows = []; // Start an empty ranking-row list.
  tieOrderNames.forEach(function (gameName, index) { // Inspect every unique title in tie-breaking order.
    const matchingGames = getGamesByName(gameList, gameName); // Find every platform entry for the current title.
    if (matchingGames.length > 0) { // Check whether the current title exists.
      rankingRows.push(createRankingRow(gameName, matchingGames, index)); // Add the title with its rating and tie-breaking position.
    } // Finish checking whether the title exists.
  }); // Finish building unsorted ranking rows.
  rankingRows.sort(function (firstGame, secondGame) { // Sort all titles into personal rating groups.
    if (firstGame.rating > secondGame.rating) { // Check whether the first game has the higher rating.
      return -1; // Place the higher-rated game first.
    } // Finish checking whether the first game has the higher rating.
    if (firstGame.rating < secondGame.rating) { // Check whether the second game has the higher rating.
      return 1; // Place the higher-rated second game first.
    } // Finish checking whether the second game has the higher rating.
    return firstGame.tieOrder - secondGame.tieOrder; // Keep existing titles first and newly added titles last inside the same rating group.
  }); // Finish sorting the ranking rows.
  return rankingRows; // Return the complete rating-based ranking order.
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
  const gameData = useGames(); // Load the built-in games plus any games saved in D1.
  const games = gameData.games; // Read the current complete game list.
  const rankingRows = getRankingRows(games); // Sort every unique title by personal star rating.

  return ( // Return the complete Game Rankings page.
    <main className="page-content rankings-page"> {/* Create the main rankings content area. */}
      <section className="collection-hero"> {/* Introduce the rankings page. */}
        <p className="eyebrow">Personal Rankings</p> {/* Add a small label above the page title. */}
        <h2>Game Rankings</h2> {/* Display the page title. */}
        <p>Games are ranked by my personal star rating. A newly added game goes to the end of its rating group, above every lower-rated game.</p> {/* Explain the automatic rating-group ranking behavior. */}
      </section> {/* Finish the rankings introduction. */}
      <section className="rankings-panel"> {/* Hold the complete ranking table. */}
        <div className="rankings-summary"> {/* Display a short summary above the table. */}
          <h3>My Top {rankingRows.length}</h3> {/* Display the total number of unique ranked titles. */}
          <span>Higher star ratings rank above lower star ratings.</span> {/* Explain the main ranking rule. */}
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
              {rankingRows.map(function (game, index) { /* Build one row for every unique title in rating order. */
                return ( // Return the current ranking row.
                  <tr key={game.name}> {/* Keep each unique title on its own table row. */}
                    <td className="rank-cell">#{index + 1}</td> {/* Number the complete sorted list from top to bottom. */}
                    <td> {/* Start the game information cell. */}
                      <div className="rank-game-cell"> {/* Keep the cover beside the game title. */}
                        <img src={game.cover} alt={game.name + " cover"} draggable="false" /> {/* Display the game cover artwork. */}
                        <span>{game.name}</span> {/* Display the game title. */}
                      </div> {/* Finish the game information layout. */}
                    </td> {/* Finish the game information cell. */}
                    <td>{game.platforms}</td> {/* Display every platform for the title. */}
                    <td className="rank-genres-cell">{game.genres}</td> {/* Display every genre assigned to the title. */}
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
