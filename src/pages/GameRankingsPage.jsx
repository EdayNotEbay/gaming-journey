import useGames from "../hooks/useGames.js"; // Import the reusable Cloudflare game-data loader.
import rankedGameNames from "../data/gameRankings.js"; // Import the personal ranking order.

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

// Build one reusable ranking row from matching game entries.
function createRankingRow(gameName, matchingGames, rankText) { // Receive one title, its matching entries, and the displayed rank.
  const primaryGame = matchingGames[0]; // Use the first matching entry for shared cover and rating data.
  return { // Return the complete ranking row.
    rank: rankText, // Store the numbered rank or Unranked label.
    name: gameName, // Store the game title.
    cover: primaryGame.cover, // Store the shared cover artwork.
    platforms: getPlatformText(matchingGames), // Combine every platform for duplicate titles.
    genres: getGenreText(matchingGames), // Combine every genre assigned to the title.
    rating: primaryGame.rating, // Store the personal star rating out of five.
    isFavorite: getFavoriteState(matchingGames), // Store whether any version of the title is a favorite.
  }; // Finish returning the ranking row.
} // Finish the ranking-row creator.

// Build the original numbered personal ranking rows.
function getRankedRows(gameList) { // Receive the current complete game list.
  const rankingRows = []; // Start an empty numbered ranking row list.
  rankedGameNames.forEach(function (gameName, index) { // Inspect every original ranked title from best to lowest.
    const matchingGames = getGamesByName(gameList, gameName); // Find every platform entry for the ranked title.
    if (matchingGames.length > 0) { // Check whether the ranked title exists in the current game data.
      rankingRows.push(createRankingRow(gameName, matchingGames, "#" + String(index + 1))); // Add the numbered ranking row.
    } // Finish checking whether the ranked title exists.
  }); // Finish building numbered ranking rows.
  return rankingRows; // Return the complete numbered ranking list.
} // Finish the numbered ranking helper.

// Return unique D1-added titles with automatic ranking numbers after the original list.
function getAddedRankingRows(gameList) { // Receive the current complete game list.
  const addedNames = []; // Start an empty unique added-title list.
  gameList.forEach(function (game) { // Inspect every game currently available on the website.
    if (game.isAdded === true) { // Check whether this game came from the D1 Add Game page.
      if (rankedGameNames.includes(game.name) === false) { // Check whether the title is absent from the original personal ranking list.
        if (addedNames.includes(game.name) === false) { // Check whether this added title has already been collected.
          addedNames.push(game.name); // Add the new D1 title once.
        } // Finish checking whether the added title is unique.
      } // Finish checking whether the title is already ranked.
    } // Finish checking whether the game was added through D1.
  }); // Finish inspecting the complete game list.
  return addedNames.map(function (gameName, index) { // Build one automatically ranked row for every unique D1-added title.
    const matchingGames = getGamesByName(gameList, gameName); // Find every platform entry for the added title.
    const nextRank = rankedGameNames.length + index + 1; // Calculate the next ranking number after the original ranked list.
    return createRankingRow(gameName, matchingGames, "#" + String(nextRank)); // Return the added title with its automatic next ranking number.
  }); // Finish building automatically ranked rows.
} // Finish the added-ranking-row helper.

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
  const rankedRows = getRankedRows(games); // Build the original numbered ranking rows.
  const addedRankingRows = getAddedRankingRows(games); // Build automatically numbered rows for D1-added titles.
  const rankingRows = rankedRows.concat(addedRankingRows); // Display the original rankings first and added games afterward.

  return ( // Return the complete Game Rankings page.
    <main className="page-content rankings-page"> {/* Create the main rankings content area. */}
      <section className="collection-hero"> {/* Introduce the rankings page. */}
        <p className="eyebrow">Personal Rankings</p> {/* Add a small label above the page title. */}
        <h2>Game Rankings</h2> {/* Display the page title. */}
        <p>My numbered rankings stay in the order I chose. New games added later automatically receive the next ranking number at the bottom of the list.</p> {/* Explain how newly added D1 games receive automatic ranking numbers. */}
      </section> {/* Finish the rankings introduction. */}
      <section className="rankings-panel"> {/* Hold the complete ranking table. */}
        <div className="rankings-summary"> {/* Display a short summary above the table. */}
          <h3>My Top {rankedRows.length}</h3> {/* Display the total number of numbered ranked titles. */}
          <span>{addedRankingRows.length} added games automatically ranked</span> {/* Display how many D1-added titles received automatic ranking numbers. */}
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
              {rankingRows.map(function (game) { /* Build one row for every numbered title. */
                return ( // Return the current ranking row.
                  <tr key={game.rank + "-" + game.name}> {/* Keep each displayed ranking row uniquely identified. */}
                    <td className="rank-cell">{game.rank}</td> {/* Display the numbered personal ranking position. */}
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
