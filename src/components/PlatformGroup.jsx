import GameCard from "./GameCard.jsx"; // Import the reusable vertical game card.

// Display every game that belongs to one platform.
function PlatformGroup({ platform, brandIcon, games, className, timelineYear }) { // Receive the platform name, brand icon, games, canvas position class, and connector year.
  let brandContent = <img className="platform-brand-icon" src={brandIcon} alt="" draggable="false" />; // Start with the normal platform brand image.
  if (platform === "PC") { // Check whether this platform needs the local PC icon.
    brandContent = ( // Replace the external PC image with a reliable inline SVG.
      <svg className="platform-brand-icon platform-pc-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"> {/* Create a simple monitor icon for the PC platform. */}
        <rect x="7" y="9" width="34" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="3" /> {/* Draw the PC monitor screen. */}
        <path d="M19 39H29M24 33V39" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /> {/* Draw the monitor stand. */}
      </svg> /* Finish the local PC monitor icon. */
    ); // Finish creating the local PC icon.
  } // Finish checking for the PC platform.

  return ( // Return the platform collection.
    <section className={"platform-group " + className}> {/* Position and style the platform group on the canvas. */}
      <div className="platform-heading"> {/* Keep the platform brand icon beside the platform name. */}
        {brandContent} {/* Display the normal platform image or the local PC SVG. */}
        <h3 className="platform-title">{platform}</h3> {/* Display the platform name. */}
      </div> {/* Finish the platform heading. */}
      <div className="game-grid"> {/* Place game covers in rows that can stack downward. */}
        {games.map(function (game) { /* Build one vertical game card for each game. */
          return <GameCard key={game.id} game={game} />; // Display the current game card.
        })} {/* Finish building the game cards. */}
      </div> {/* Finish the game grid. */}
      <div className="platform-connector" aria-hidden="true"> {/* Connect this platform group to the main timeline. */}
        <span className="platform-connector-year">{timelineYear}</span> {/* Display the platform year directly on the connector line. */}
        <span className="platform-connector-node"></span> {/* Mark the point where the connector meets the timeline. */}
      </div> {/* Finish the platform connector. */}
    </section> /* Finish the platform group. */
  ); // Finish returning the platform collection.
} // Finish the PlatformGroup component.

export default PlatformGroup; // Allow the timeline canvas to reuse this component.
