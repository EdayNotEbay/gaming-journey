// Display the Game Rankings page.
function GameRankingsPage() { // Create the Game Rankings page component.
  return ( // Return the Game Rankings page content.
    <main className="page-content simple-page"> {/* Create the main rankings content area. */}
      <h2>Game Rankings</h2> {/* Display the page title. */}
      <p>Compare games by platform, genre, and my personal rating.</p> {/* Explain the purpose of this page. */}
    </main> /* Finish the Game Rankings page content. */}
  ); // Finish returning the Game Rankings page.
} // Finish the GameRankingsPage component.

export default GameRankingsPage; // Allow the router to display this page.
