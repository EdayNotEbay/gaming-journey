import { useEffect, useRef } from "react"; // Import React tools used by the game-card click timer.
import { useNavigate } from "react-router-dom"; // Import navigation so game cards can open other pages.

// Display one game using the same vertical cover size everywhere.
function GameCard({ game }) { // Receive one game object from a platform group.
  const navigate = useNavigate(); // Create the navigation helper for this game card.
  const clickTimer = useRef(null); // Store the pending single-click timer.
  const primaryGenre = game.genres[0]; // Use the first genre as the default genre when opening the Genres page.
  const genreText = game.genres.join(" • "); // Join every genre so the timeline card shows all assigned genres.
  let coverContent = <div className="game-cover game-cover-placeholder">{game.name}</div>; // Create a vertical placeholder until a real cover image is added.
  let cardClassName = "game-card"; // Start with the normal game-card class.

  // Clear any delayed click action if this card leaves the page.
  useEffect(function () { // Set up cleanup for the single-click timer.
    return function () { // Run when the game card unmounts.
      window.clearTimeout(clickTimer.current); // Prevent an old timer from navigating after the card is gone.
    }; // Finish the timer cleanup function.
  }, []); // Keep the cleanup setup from repeating.

  if (game.cover !== "") { // Check whether this game already has a cover image path.
    coverContent = <img className="game-cover" src={game.cover} alt={game.name + " cover"} draggable="false" />; // Display the real game cover without native browser image dragging.
  } // Finish checking for a cover image.

  if (game.isFavorite === true) { // Check whether this game is one of the user's favorites.
    cardClassName = cardClassName + " game-card-favorite"; // Add the purple favorite styling class.
  } // Finish checking the favorite state.

  // Open the matching primary genre after a normal click.
  function handleClick() { // Handle a single game-card click.
    window.clearTimeout(clickTimer.current); // Clear an older click timer before starting a new one.
    clickTimer.current = window.setTimeout(function () { // Delay briefly so a double-click can cancel the single-click action.
      navigate("/genres", { state: { genre: primaryGenre } }); // Open the Genres page with this game's primary genre selected.
    }, 400); // Wait long enough to reliably detect a double-click.
  } // Finish the single-click handler.

  // Open Favorite Games when a favorite receives a double-click.
  function handleDoubleClick() { // Handle a double-click on a game card.
    window.clearTimeout(clickTimer.current); // Cancel the pending single-click navigation.
    if (game.isFavorite === true) { // Check whether this game is marked as a favorite.
      navigate("/favorite-games"); // Open the Favorite Games page for favorites.
      return; // Stop after opening the Favorite Games page.
    } // Finish checking the favorite status.
    navigate("/genres", { state: { genre: primaryGenre } }); // Keep non-favorite double-clicks going to the primary Genres page.
  } // Finish the double-click handler.

  return ( // Return the complete game card.
    <button className={cardClassName} type="button" onClick={handleClick} onDoubleClick={handleDoubleClick}> {/* Keep the card clickable while allowing pointer events to bubble to the draggable canvas. */}
      {coverContent} {/* Display the vertical game cover or placeholder. */}
      <span className="game-card-name">{game.name}</span> {/* Display the game title below the cover. */}
      {game.timelineDate !== "" && <span className="game-card-date">{game.timelineDate}</span>} {/* Display the saved timeline date whenever one has been entered. */}
      <span className="game-card-genre">{genreText}</span> {/* Display every assigned genre below the title. */}
    </button> /* Finish the game card button. */
  ); // Finish returning the game card.
} // Finish the GameCard component.

export default GameCard; // Allow platform groups to reuse this component.
