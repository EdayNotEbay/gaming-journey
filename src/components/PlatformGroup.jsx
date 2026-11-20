import GameCard from "./GameCard.jsx"; // Import the reusable vertical game card.

// Display every game that belongs to one platform.
function PlatformGroup({ platform, games, className }) { // Receive the platform name, its games, and its canvas position class.
  return ( // Return the platform collection.
    <section className={"platform-group " + className}> {/* Position and style the platform group on the canvas. */}
      <h3 className="platform-title">{platform}</h3> {/* Display the platform name. */}
      <div className="game-grid"> {/* Place game covers in rows that can stack downward. */}
        {games.map(function (game) { /* Build one vertical game card for each game. */
          return <GameCard key={game.id} game={game} />; // Display the current game card.
        })} {/* Finish building the game cards. */}
      </div> {/* Finish the game grid. */}
    </section> /* Finish the platform group. */
  ); // Finish returning the platform collection.
} // Finish the PlatformGroup component.

export default PlatformGroup; // Allow the timeline canvas to reuse this component.
