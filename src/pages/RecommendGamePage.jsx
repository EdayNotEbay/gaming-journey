// Display the Recommend Me a Game page.
function RecommendGamePage() { // Create the recommendation page component.
  return ( // Return the recommendation page content.
    <main className="page-content simple-page"> {/* Create the main recommendation content area. */}
      <h2>Recommend Me a Game</h2> {/* Display the page title. */}
      <p>Suggest a game you think I would enjoy.</p> {/* Explain the purpose of this page. */}
    </main> /* Finish the recommendation page content. */
  ); // Finish returning the recommendation page.
} // Finish the RecommendGamePage component.

export default RecommendGamePage; // Allow the router to display this page.
