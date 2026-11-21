import { useNavigate } from "react-router-dom"; // Import navigation so gallery cards can open the matching genre.

// Display one game on the Genres and Favorites pages.
function LibraryGameCard({ game }) { // Receive one game object from the shared game data.
  const navigate = useNavigate(); // Create the navigation helper for this game card.
  let cardClassName = "library-game-card"; // Start with the normal gallery card class.

  if (game.isFavorite === true) { // Check whether this game is marked as a favorite.
    cardClassName = cardClassName + " library-game-card-favorite"; // Add the purple favorite glow class.
  } // Finish checking the favorite state.

  // Open the Genres page focused on this game's genre.
  function openGenre() { // Handle a normal click on the gallery card.
    navigate("/genres", { state: { genre: game.genre } }); // Open Genres and pass the selected genre.
  } // Finish the card click handler.

  return ( // Return the complete gallery card.
    <button className={cardClassName} type="button" onClick={openGenre}> {/* Make the complete game card clickable. */}
      <img className="library-game-cover" src={game.cover} alt={game.name + " cover"} draggable="false" /> {/* Display the game's cover artwork. */}
      <span className="library-game-name">{game.name}</span> {/* Display the game title below the cover. */}
      <span className="library-game-platform">{game.platform}</span> {/* Display the platform below the game title. */}
      <span className="library-game-genre">{game.genre}</span> {/* Display the genre as the final card label. */}
    </button> /* Finish the gallery game card. */
  ); // Finish returning the gallery card.
} // Finish the LibraryGameCard component.

export default LibraryGameCard; // Allow the three library pages to reuse this component.
