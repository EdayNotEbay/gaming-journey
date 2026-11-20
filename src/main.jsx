import { StrictMode } from "react"; // Import StrictMode for additional development checks.
import { createRoot } from "react-dom/client"; // Import the React root creation helper.
import "./index.css"; // Import the global external stylesheet.
import App from "./App.jsx"; // Import the main application component.

const rootElement = document.getElementById("root"); // Find the root element from index.html.
const reactRoot = createRoot(rootElement); // Create the React root for the application.

reactRoot.render( // Render the React application.
  <StrictMode> {/* Enable React development checks. */}
    <App /> {/* Display the complete website. */}
  </StrictMode>, // Finish the StrictMode wrapper.
); // Finish rendering the application.
