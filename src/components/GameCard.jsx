import { useRef } from "react"; // Import useRef so single-click and double-click actions can be separated.
import { useNavigate } from "react-router-dom"; // Import navigation so game cards can open other pages.

// Display one game using the same vertical cover size everywhere.
function GameCard({ game }) { // Receive one game object from a platform group.
  const navigate = useNavigate(); // Create the navigation helper for this game card.
  const clickTimer = useRef(null); // Store the pending single-click timer.
  let coverContent = <div className="game-cover game-cover-placeholder">{game.name}</div>; // Create a vertical placeholder until a real cover image is added.
  let cardClassName = "game-card"; // Start with the normal game-card class.

  if (game.cover !== "") { // Check whether this game already has a cover image path.
    coverContent = <img className="game-cover" src={game.cover} alt={game.name + " cover"} draggable="false" />; // Display the real game cover without native browser image dragging.
  } // Finish checking for a cover image.

  if (game.isFavorite === true) { // Check whether this game is one of the user's favorites.
    cardClassName = cardClassName + " game-card-favorite"; // Add the purple favorite styling class.
  } // Finish checking the favorite state.

  // Open the matching genre after a normal click.
  function handleClick() { // Handle a single game-card click.
    window.clearTimeout(clickTimer.current); // Clear an older click timer before starting a new one.
    clickTimer.current = window.setTimeout(function () { // Delay briefly so a double-click can cancel the single-click action.
      navigate("/genres", { state: { genre: game.genre } }); // Open the Genres page with this game's genre selected.
    }, 400); // Wait long enough to reliably detect a double-click.
  } // Finish the single-click handler.

  // Open Favorite Games when a favorite receives a double-click.
  function handleDoubleClick() { // Handle a double-click on a game card.
    window.clearTimeout(clickTimer.current); // Cancel the pending single-click navigation.
    if (game.isFavorite === true) { // Check whether this game is marked as a favorite.
      navigate("/favorite-games"); // Open the Favorite Games page for favorites.
      return; // Stop after opening the Favorite Games page.
    } // Finish checking the favorite status.
    navigate("/genres", { state: { genre: game.genre } }); // Keep non-favorite double-clicks going to the normal Genres page.
  } // Finish the double-click handler.

  return ( // Return the complete game card.
    <button className={cardClassName} type="button" onClick={handleClick} onDoubleClick={handleDoubleClick}> {/* Keep the card clickable while allowing pointer events to bubble to the draggable canvas. */}
      {coverContent} {/* Display the vertical game cover or placeholder. */}
      <span className="game-card-name">{game.name}</span> {/* Display the game title below the cover. */}
      <span className="game-card-genre">{game.genre}</span> {/* Display the game genre below the title. */}
    </button> /* Finish the game card button. */
  ); // Finish returning the game card.
} // Finish the GameCard component.

export default GameCard; // Allow platform groups to reuse this component.
