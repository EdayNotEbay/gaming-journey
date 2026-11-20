import { useRef } from "react"; // Import useRef so single-click and double-click actions can be separated.
import { useNavigate } from "react-router-dom"; // Import navigation so game cards can open other pages.

// Display one game using the same vertical cover size everywhere.
function GameCard({ game }) { // Receive one game object from a platform group.
  const navigate = useNavigate(); // Create the navigation helper for this game card.
  const clickTimer = useRef(null); // Store the pending single-click timer.
  let coverContent = <div className="game-cover game-cover-placeholder">{game.name}</div>; // Create a vertical placeholder until a real cover image is added.

  if (game.cover !== "") { // Check whether this game already has a cover image path.
    coverContent = <img className="game-cover" src={game.cover} alt={game.name + " cover"} draggable="false" />; // Display the real game cover without native image dragging.
  } // Finish checking for a cover image.

  // Keep pointer dragging on a game card from moving the timeline canvas.
  function handlePointerDown(event) { // Receive the pointer-down event from this game card.
    event.stopPropagation(); // Stop the pointer event before it reaches the draggable timeline viewport.
  } // Finish the game-card pointer handler.

  // Open the matching genre after a normal click.
  function handleClick() { // Handle a single game-card click.
    clickTimer.current = window.setTimeout(function () { // Delay the action briefly so a double-click can cancel it.
      navigate("/genres", { state: { genre: game.genre } }); // Open the Genres page with this game's genre selected.
    }, 220); // Wait a short time before treating the action as a single click.
  } // Finish the single-click handler.

  // Open Favorite Games when a favorite receives a double-click.
  function handleDoubleClick() { // Handle a double-click on a game card.
    window.clearTimeout(clickTimer.current); // Cancel the pending single-click navigation.
    if (game.isFavorite === true) { // Check whether this game is marked as a favorite.
      navigate("/favorite-games"); // Open the Favorite Games page for favorites.
    } // Finish checking the favorite status.
  } // Finish the double-click handler.

  return ( // Return the complete game card.
    <button className="game-card" type="button" onPointerDown={handlePointerDown} onClick={handleClick} onDoubleClick={handleDoubleClick}> {/* Keep the card clickable without allowing canvas dragging to start on it. */}
      {coverContent} {/* Display the vertical game cover or placeholder. */}
      <span className="game-card-name">{game.name}</span> {/* Display the game title below the cover. */}
      <span className="game-card-genre">{game.genre}</span> {/* Display the game genre below the title. */}
    </button> /* Finish the game card button. */
  ); // Finish returning the game card.
} // Finish the GameCard component.

export default GameCard; // Allow platform groups to reuse this component.
