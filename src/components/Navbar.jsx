import { NavLink } from "react-router-dom"; // Import NavLink so the current page can be highlighted.

// Keep the main navigation links together in one reusable list.
const navigationLinks = [ // Start the navigation link list.
  { path: "/", label: "Timeline" }, // Link to the Gaming Timeline home page.
  { path: "/genres", label: "Genres" }, // Link to the Genres page.
  { path: "/favorite-genres", label: "Favorite Genres" }, // Link to the Favorite Genres page.
  { path: "/favorite-games", label: "Favorite Games" }, // Link to the Favorite Games page.
  { path: "/my-gaming-journey", label: "My Journey" }, // Link to the My Gaming Journey page.
  { path: "/game-rankings", label: "Game Rankings" }, // Link to the Game Rankings page.
  { path: "/recommend-me-a-game", label: "Recommend a Game" }, // Link to the recommendation page.
]; // Finish the navigation link list.

// Display the same site navigation on every page.
function Navbar() { // Create the shared navigation component.
  return ( // Return the navigation header.
    <header className="site-header"> {/* Create the shared website header. */}
      <h1> {/* Display the website title. */}
        <NavLink to="/" className="brand-link">My Gaming Journey</NavLink> {/* Link the title back to the timeline. */}
      </h1> {/* Finish the website title. */}
      <nav className="site-nav" aria-label="Main navigation"> {/* Create the main navigation area. */}
        {navigationLinks.map(function (link) { /* Build one navigation link for each page. */
          return ( /* Return the current navigation link. */
            <NavLink key={link.path} to={link.path} end={link.path === "/"} className="nav-link"> {/* Create the route link. */}
              {link.label} {/* Display the page label. */}
            </NavLink> /* Finish the route link. */
          ); // Finish returning the route link.
        })} {/* Finish building the navigation links. */}
      </nav> {/* Finish the navigation area. */}
    </header> /* Finish the shared header. */
  ); // Finish returning the navigation header.
} // Finish the Navbar component.

export default Navbar; // Allow the app to reuse this component.
