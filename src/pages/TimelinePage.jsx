import TimelineCanvas from "../components/TimelineCanvas.jsx"; // Import the interactive two-dimensional timeline.
import games from "../data/games.js"; // Import the current local game data.

// Display the home page and interactive gaming timeline.
function TimelinePage() { // Create the Gaming Timeline page component.
  return ( // Return the complete timeline page.
    <main className="page-content"> {/* Create the main page content area. */}
      <section className="timeline-hero"> {/* Introduce the gaming timeline. */}
        <p className="eyebrow">Welcome to</p> {/* Add a small heading above the main title. */}
        <h2>My Gaming Journey</h2> {/* Display the website's main heading. */}
        <p>Explore the games and platforms that shaped my gaming journey over the years.</p> {/* Explain the purpose of the timeline. */}
      </section> {/* Finish the timeline introduction. */}
      <TimelineCanvas games={games} /> {/* Display the draggable two-dimensional timeline. */}
    </main> /* Finish the main page content. */
  ); // Finish returning the Timeline page.
} // Finish the TimelinePage component.

export default TimelinePage; // Allow the router to display this page.
