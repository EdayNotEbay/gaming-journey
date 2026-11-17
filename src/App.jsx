
import "./App.css"; // Import the external CSS file.

// Create the main React component.
function App() {
  // Display the website homepage.
  return (
    <div className="website">
      {/* Display the website header. */}
      <header className="site-header">
        {/* Display the website title. */}
        <h1>My Gaming Journey</h1>
      </header>

      {/* Display the homepage introduction. */}
      <main className="hero">
        {/* Display the main heading. */}
        <h2>My Gaming Timeline</h2>
        {/* Display the introductory text. */}
        <p>Explore the games and platforms that shaped my gaming journey.</p>
      </main>
    </div>
  );
}

// Export the component.
export default App;
