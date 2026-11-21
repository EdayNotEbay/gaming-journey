import { useState } from "react"; // Import React state for the ranking filters.
import games from "../data/games.js"; // Import the shared game data.
import rankedGameNames from "../data/gameRankings.js"; // Import the personal ranking order.

// Build a map from game name to rank number.
function getRankMap() { // Create the lookup used by the ranking table.
  const rankMap = new Map(); // Store each ranked game name with its one-based position.

  rankedGameNames.forEach(function (gameName, index) { // Inspect every game in the personal ranking order.
    rankMap.set(gameName, index + 1); // Save the current game with its displayed rank number.
  }); // Finish building the ranking lookup.

  return rankMap; // Return the complete ranking lookup.
} // Finish the rank-map helper.

// Return every unique value for one game property.
function getUniqueValues(gameList, propertyName) { // Receive the game list and requested property name.
  const values = []; // Start an empty unique-value list.

  gameList.forEach(function (game) { // Inspect every game in the shared data.
    const value = game[propertyName]; // Read the requested property from the current game.

    if (values.includes(value) === false) { // Check whether the value has already been added.
      values.push(value); // Add the unique value once.
    } // Finish checking whether the value is unique.
  }); // Finish inspecting the game list.

  values.sort(); // Keep filter options in alphabetical order.

  return values; // Return the unique filter values.
} // Finish the unique-value helper.

// Add ranking information to every game.
function buildRankingRows(gameList) { // Receive the complete game list.
  const rankMap = getRankMap(); // Build the current personal ranking lookup.

  return gameList.map(function (game) { // Create one ranking row for every game.
    let rank = null; // Start each game without a rank.

    if (rankMap.has(game.name) === true) { // Check whether this game appears in the personal ranking order.
      rank = rankMap.get(game.name); // Store the assigned personal rank.
    } // Finish checking for a personal rank.

    return { // Return the complete ranking row.
      id: game.id, // Keep the original game identifier.
      name: game.name, // Keep the game title.
      platform: game.platform, // Keep the platform name.
      genre: game.genre, // Keep the genre name.
      isFavorite: game.isFavorite, // Keep the favorite state.
      cover: game.cover, // Keep the game cover artwork.
      rank: rank, // Add the personal rank or null when unranked.
    }; // Finish returning the ranking row.
  }); // Finish building the ranking rows.
} // Finish the ranking-row helper.

// Sort ranked games first and unranked games after them.
function sortRankingRows(rows) { // Receive ranking rows after filtering.
  return rows.slice().sort(function (firstGame, secondGame) { // Sort a copy so the original array remains unchanged.
    if (firstGame.rank !== null && secondGame.rank !== null) { // Check whether both games already have ranks.
      return firstGame.rank - secondGame.rank; // Sort ranked games from best rank to lowest rank.
    } // Finish checking two ranked games.

    if (firstGame.rank !== null) { // Check whether only the first game has a rank.
      return -1; // Keep the ranked first game above the unranked second game.
    } // Finish checking the first ranked game.

    if (secondGame.rank !== null) { // Check whether only the second game has a rank.
      return 1; // Keep the ranked second game above the unranked first game.
    } // Finish checking the second ranked game.

    return firstGame.name.localeCompare(secondGame.name); // Sort unranked games alphabetically.
  }); // Finish sorting the ranking rows.
} // Finish the ranking sort helper.

// Return rows that match the current search and filters.
function filterRankingRows(rows, searchText, platformFilter, genreFilter) { // Receive all rows and active filter values.
  const normalizedSearch = searchText.trim().toLowerCase(); // Normalize the search text for simple matching.

  return rows.filter(function (game) { // Test every game against the active filters.
    let matchesSearch = true; // Start by allowing the game through the search filter.
    let matchesPlatform = true; // Start by allowing the game through the platform filter.
    let matchesGenre = true; // Start by allowing the game through the genre filter.

    if (normalizedSearch !== "") { // Check whether the visitor entered search text.
      matchesSearch = game.name.toLowerCase().includes(normalizedSearch); // Match the search text against the game title.
    } // Finish checking the search text.

    if (platformFilter !== "All") { // Check whether a specific platform is selected.
      matchesPlatform = game.platform === platformFilter; // Match the game against the selected platform.
    } // Finish checking the platform filter.

    if (genreFilter !== "All") { // Check whether a specific genre is selected.
      matchesGenre = game.genre === genreFilter; // Match the game against the selected genre.
    } // Finish checking the genre filter.

    return matchesSearch && matchesPlatform && matchesGenre; // Keep games that pass every active filter.
  }); // Finish filtering the ranking rows.
} // Finish the ranking filter helper.

// Return the correct favorite badge class for one game.
function getFavoriteBadgeClass(game) { // Receive one game ranking row.
  let className = "ranking-favorite"; // Start with the normal favorite badge class.

  if (game.isFavorite === true) { // Check whether the game is marked as a favorite.
    className = className + " ranking-favorite-active"; // Add the purple favorite badge style.
  } // Finish checking the favorite state.

  return className; // Return the complete favorite badge class name.
} // Finish the favorite badge helper.

// Display the personal game ranking table.
function GameRankingsPage() { // Create the Game Rankings page component.
  const [searchText, setSearchText] = useState(""); // Store the current title search text.
  const [platformFilter, setPlatformFilter] = useState("All"); // Store the selected platform filter.
  const [genreFilter, setGenreFilter] = useState("All"); // Store the selected genre filter.
  const rankingRows = buildRankingRows(games); // Add personal rank information to every game.
  const filteredRows = filterRankingRows(rankingRows, searchText, platformFilter, genreFilter); // Apply the active search and filters.
  const displayedRows = sortRankingRows(filteredRows); // Sort ranked games before unranked games.
  const platformNames = getUniqueValues(games, "platform"); // Build the available platform filter options.
  const genreNames = getUniqueValues(games, "genre"); // Build the available genre filter options.
  const rankedCount = rankedGameNames.length; // Count how many games currently have personal ranks.

  // Update the title search text.
  function handleSearchChange(event) { // Receive changes from the ranking search field.
    setSearchText(event.target.value); // Store the current search text.
  } // Finish the search handler.

  // Update the platform filter.
  function handlePlatformChange(event) { // Receive changes from the platform dropdown.
    setPlatformFilter(event.target.value); // Store the selected platform.
  } // Finish the platform filter handler.

  // Update the genre filter.
  function handleGenreChange(event) { // Receive changes from the genre dropdown.
    setGenreFilter(event.target.value); // Store the selected genre.
  } // Finish the genre filter handler.

  return ( // Return the complete Game Rankings page.
    <main className="page-content rankings-page"> {/* Create the main rankings content area. */}
      <section className="collection-hero"> {/* Introduce the Game Rankings page. */}
        <p className="eyebrow">Personal Rankings</p> {/* Add a small label above the page title. */}
        <h2>Game Rankings</h2> {/* Display the page title. */}
        <p>Compare the games I have played by personal rank, platform, genre, and favorite status.</p> {/* Explain the purpose of the rankings page. */}
      </section> {/* Finish the rankings introduction. */}
      <section className="rankings-controls" aria-label="Game ranking filters"> {/* Group the ranking search and filter controls. */}
        <label className="rankings-control"> {/* Group the search label and field. */}
          <span>Search</span> {/* Label the title search field. */}
          <input type="search" value={searchText} onChange={handleSearchChange} placeholder="Search games" /> {/* Let visitors search by game title. */}
        </label> {/* Finish the search control. */}
        <label className="rankings-control"> {/* Group the platform label and dropdown. */}
          <span>Platform</span> {/* Label the platform filter. */}
          <select value={platformFilter} onChange={handlePlatformChange}> {/* Let visitors filter the table by platform. */}
            <option value="All">All Platforms</option> {/* Let visitors show every platform. */}
            {platformNames.map(function (platformName) { /* Build one option for every platform. */
              return <option key={platformName} value={platformName}>{platformName}</option>; // Display the current platform option.
            })} {/* Finish building platform options. */}
          </select> {/* Finish the platform dropdown. */}
        </label> {/* Finish the platform control. */}
        <label className="rankings-control"> {/* Group the genre label and dropdown. */}
          <span>Genre</span> {/* Label the genre filter. */}
          <select value={genreFilter} onChange={handleGenreChange}> {/* Let visitors filter the table by genre. */}
            <option value="All">All Genres</option> {/* Let visitors show every genre. */}
            {genreNames.map(function (genreName) { /* Build one option for every genre. */
              return <option key={genreName} value={genreName}>{genreName}</option>; // Display the current genre option.
            })} {/* Finish building genre options. */}
          </select> {/* Finish the genre dropdown. */}
        </label> {/* Finish the genre control. */}
      </section> {/* Finish the ranking controls. */}
      <section className="rankings-panel"> {/* Display the ranking summary and required table. */}
        <div className="rankings-summary"> {/* Keep the table summary information together. */}
          <div> {/* Group the section title and explanation. */}
            <h3>My Ranking List</h3> {/* Label the ranking table. */}
            <p>{rankedCount} of {games.length} games currently ranked.</p> {/* Display ranking completion progress. */}
          </div> {/* Finish the ranking summary text. */}
          <span>{displayedRows.length} shown</span> {/* Display how many rows match the current filters. */}
        </div> {/* Finish the ranking summary. */}
        <div className="rankings-table-wrapper"> {/* Allow the ranking table to scroll horizontally on small screens. */}
          <table className="rankings-table"> {/* Create the required rankings table. */}
            <thead> {/* Start the table heading rows. */}
              <tr> {/* Create the table heading row. */}
                <th scope="col">Rank</th> {/* Label the personal rank column. */}
                <th scope="col">Game</th> {/* Label the game information column. */}
                <th scope="col">Platform</th> {/* Label the platform column. */}
                <th scope="col">Genre</th> {/* Label the genre column. */}
                <th scope="col">Favorite</th> {/* Label the favorite-state column. */}
              </tr> {/* Finish the table heading row. */}
            </thead> {/* Finish the table headings. */}
            <tbody> {/* Start the ranking table body. */}
              {displayedRows.map(function (game) { /* Build one table row for every displayed game. */
                let rankLabel = "Unranked"; // Start with the label used before personal ranks are added.
                let favoriteLabel = "No"; // Start with the normal non-favorite label.

                if (game.rank !== null) { // Check whether this game has a personal rank.
                  rankLabel = "#" + game.rank; // Display the personal ranking number.
                } // Finish checking the personal rank.

                if (game.isFavorite === true) { // Check whether this game is marked as a favorite.
                  favoriteLabel = "Yes"; // Display the favorite status.
                } // Finish checking the favorite state.

                return ( // Return the current ranking table row.
                  <tr key={game.id}> {/* Keep each game on its own ranking row. */}
                    <td className="rank-cell">{rankLabel}</td> {/* Display the personal rank or Unranked label. */}
                    <td> {/* Display the game artwork and title together. */}
                      <div className="rank-game-cell"> {/* Keep the game cover beside its title. */}
                        <img src={game.cover} alt={game.name + " cover"} draggable="false" /> {/* Display the game cover artwork. */}
                        <span>{game.name}</span> {/* Display the game title. */}
                      </div> {/* Finish the game information cell. */}
                    </td> {/* Finish the game information column. */}
                    <td>{game.platform}</td> {/* Display the game's platform. */}
                    <td>{game.genre}</td> {/* Display the game's genre. */}
                    <td> {/* Display whether the game is a favorite. */}
                      <span className={getFavoriteBadgeClass(game)}>{favoriteLabel}</span> {/* Display the favorite badge. */}
                    </td> {/* Finish the favorite-status column. */}
                  </tr> /* Finish the current ranking row. */
                ); // Finish returning the current ranking row.
              })} {/* Finish building ranking rows. */}
            </tbody> {/* Finish the ranking table body. */}
          </table> {/* Finish the rankings table. */}
        </div> {/* Finish the responsive table wrapper. */}
      </section> {/* Finish the ranking panel. */}
    </main> /* Finish the Game Rankings page content. */
  ); // Finish returning the Game Rankings page.
} // Finish the GameRankingsPage component.

export default GameRankingsPage; // Allow the router to display this page.
