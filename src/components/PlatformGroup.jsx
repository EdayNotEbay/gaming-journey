import GameCard from "./GameCard.jsx"; // Import the reusable vertical game card.

// Display every game that belongs to one platform.
function PlatformGroup({ platform, brandIcon, games, className }) { // Receive the platform name, brand icon, games, and canvas position class.
  return ( // Return the platform collection.
    <section className={"platform-group " + className}> {/* Position and style the platform group on the canvas. */}
      <div className="platform-heading"> {/* Keep the platform brand icon beside the platform name. */}
        <img className="platform-brand-icon" src={brandIcon} alt="" draggable="false" /> {/* Display the real platform brand icon without native image dragging. */}
        <h3 className="platform-title">{platform}</h3> {/* Display the platform name. */}
      </div> {/* Finish the platform heading. */}
      <div className="game-grid"> {/* Place game covers in rows that can stack downward. */}
        {games.map(function (game) { /* Build one vertical game card for each game. */
          return <GameCard key={game.id} game={game} />; // Display the current game card.
        })} {/* Finish building the game cards. */}
      </div> {/* Finish the game grid. */}
      <div className="platform-connector" aria-hidden="true"> {/* Connect this platform group to the main timeline. */}
        <span className="platform-connector-node"></span> {/* Mark the point where the connector meets the timeline. */}
      </div> {/* Finish the platform connector. */}
    </section> /* Finish the platform group. */
  ); // Finish returning the platform collection.
} // Finish the PlatformGroup component.

export default PlatformGroup; // Allow the timeline canvas to reuse this component.
