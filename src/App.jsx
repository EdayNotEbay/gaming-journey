import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom"; // Import the tools for page navigation.
import pages from "./pages.js"; // Import the list of website pages.
import "./App.css"; // Import the external stylesheet.

// Display the selected page's introduction.
function PageContent({ page }) {
  // Render the heading and description for this page.
  return (
    <main className="hero">
      {/* Show the current page title. */}
      <h2>{page.title}</h2>
      {/* Explain what visitors will find on this page. */}
      <p>{page.description}</p>
    </main>
  );
}

// Display the same header and navigation on every page.
function SiteHeader() {
  // Build the shared website header.
  return (
    <header className="site-header">
      {/* Make the website title link back to the timeline. */}
      <h1><NavLink to="/" className="brand-link">My Gaming Journey</NavLink></h1>
      {/* Give visitors links to all seven pages. */}
      <nav className="site-nav" aria-label="Main navigation">
        {/* Make one navigation link for each page. */}
        {pages.map(function (page) {
          // Link to the matching page route.
          return (
            <NavLink
              key={page.path}
              to={page.path}
              end={page.path === "/"}
              className="nav-link"
            >
              {page.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}

// Display the full React website.
function App() {
  // Keep the header and footer visible as pages change.
  return (
    <BrowserRouter>
      <div className="website">
        {/* Display the shared navigation. */}
        <SiteHeader />
        {/* Display the content for the current address. */}
        <Routes>
          {/* Create a route for every approved website page. */}
          {pages.map(function (page) {
            // Show the matching page's introduction.
            return <Route key={page.path} path={page.path} element={<PageContent page={page} />} />;
          })}
          {/* Return to the timeline if the address is unknown. */}
          <Route path="*" element={<PageContent page={pages[0]} />} />
        </Routes>
        {/* Display a consistent footer on every page. */}
        <footer className="site-footer">
          <p>My Gaming Journey</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

// Allow React to load this component.
export default App;
