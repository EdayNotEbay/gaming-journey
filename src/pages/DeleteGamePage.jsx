import { useEffect, useState } from "react"; // Import React tools used by the protected Delete Game page.

// Display the protected Delete Game admin page.
function DeleteGamePage() { // Create the Delete Game page component.
  const [games, setGames] = useState([]); // Store only games that were added through D1.
  const [password, setPassword] = useState(""); // Store the administrator password field.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track whether the administrator session is active.
  const [isCheckingSession, setIsCheckingSession] = useState(true); // Track the initial session-status request.
  const [statusMessage, setStatusMessage] = useState(""); // Store page feedback for login, loading, and deletion.
  const [deletingId, setDeletingId] = useState(0); // Store the D1 row ID currently being deleted.

  // Load only games that were added through the administrator page.
  async function loadAddedGames() { // Create the protected D1 game-list request.
    try { // Start protected game loading.
      const response = await fetch("/api/admin-games", { credentials: "same-origin" }); // Request only administrator-added games.
      const data = await response.json(); // Read the protected game-list response.
      if (response.ok === false) { // Check whether Cloudflare rejected the request.
        setStatusMessage(data.message); // Display the server-provided loading error.
        return; // Stop before replacing the current game list.
      } // Finish checking the protected game-list response.
      setGames(data.games); // Store the current D1-added game list.
      if (data.games.length === 0) { // Check whether there are any D1-added games to manage.
        setStatusMessage("There are no added games to delete."); // Explain that the protected list is empty.
        return; // Stop before showing the normal loaded message.
      } // Finish checking whether the D1 list is empty.
      setStatusMessage("Only games added through the Add Game page are shown here."); // Explain the protected deletion scope.
    } catch { // Handle a missing or unreachable Cloudflare backend.
      setStatusMessage("Unable to load added games from Cloudflare."); // Explain the connection problem.
    } // Finish protected game loading.
  } // Finish the protected game-list loader.

  // Check whether the browser already has a valid administrator session.
  useEffect(function () { // Run the session check when the page first opens.
    async function checkSession() { // Create the asynchronous session-status request.
      try { // Start protected session loading.
        const response = await fetch("/api/session", { credentials: "same-origin" }); // Ask Cloudflare whether the secure admin cookie is valid.
        if (response.ok === true) { // Check whether the session endpoint responded successfully.
          const data = await response.json(); // Read the session response.
          if (data.authenticated === true) { // Check whether Cloudflare confirmed the administrator session.
            setIsAuthenticated(true); // Reveal the protected Delete Game controls.
            await loadAddedGames(); // Load D1-added games after confirming administrator access.
          } // Finish checking the authentication state.
        } // Finish checking the session response.
      } catch { // Handle local development before Pages Functions are available.
        setStatusMessage("Admin login becomes available after the Cloudflare backend is configured."); // Explain why local login may not work.
      } // Finish protected session loading.
      setIsCheckingSession(false); // Mark the initial session check as complete.
    } // Finish the session-status request.
    checkSession(); // Check the existing administrator session.
  }, []); // Run the session check only once.

  // Update the administrator password field.
  function handlePasswordChange(event) { // Receive the password input change.
    setPassword(event.target.value); // Store the current password text.
  } // Finish the password field handler.

  // Submit the administrator password to the secure Cloudflare login endpoint.
  async function handleLogin(event) { // Receive the administrator login form submission.
    event.preventDefault(); // Keep the browser from reloading the page.
    setStatusMessage("Signing in..."); // Tell the administrator that login is in progress.
    try { // Start protected login handling.
      const response = await fetch("/api/login", { // Send the password to the server-side login endpoint.
        method: "POST", // Use POST so the password is not placed in the URL.
        headers: { "Content-Type": "application/json" }, // Tell Cloudflare that the request body contains JSON.
        credentials: "same-origin", // Allow the secure session cookie to be stored by the browser.
        body: JSON.stringify({ password: password }), // Send only the entered administrator password.
      }); // Finish sending the login request.
      const data = await response.json(); // Read the login response.
      if (response.ok === false) { // Check whether Cloudflare rejected the login.
        setStatusMessage(data.message); // Display the server-provided login error.
        return; // Stop before revealing protected controls.
      } // Finish checking the login result.
      setPassword(""); // Clear the password field after successful login.
      setIsAuthenticated(true); // Reveal the protected Delete Game controls.
      await loadAddedGames(); // Load D1-added games after successful login.
    } catch { // Handle a missing or unreachable Cloudflare backend.
      setStatusMessage("Unable to reach the administrator login endpoint."); // Explain the connection problem.
    } // Finish protected login handling.
  } // Finish the administrator login handler.

  // End the current administrator session.
  async function handleLogout() { // Handle the administrator logout button.
    try { // Start protected logout handling.
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" }); // Ask Cloudflare to clear the secure session cookie.
    } catch { // Handle a network problem during logout.
      setStatusMessage("The local session was cleared, but the logout endpoint could not be reached."); // Explain the partial logout result.
    } // Finish protected logout handling.
    setIsAuthenticated(false); // Hide the protected Delete Game controls.
    setGames([]); // Clear the private D1-added game list.
    setStatusMessage("Logged out."); // Confirm the logout state.
  } // Finish the administrator logout handler.

  // Permanently remove one D1-added game after confirmation.
  async function handleDelete(event) { // Receive the clicked Delete button.
    const gameId = Number(event.currentTarget.dataset.id); // Read the D1 row ID from the clicked button.
    const gameName = event.currentTarget.dataset.name; // Read the game title from the clicked button.
    const platform = event.currentTarget.dataset.platform; // Read the platform from the clicked button.
    const confirmed = window.confirm("Delete " + gameName + " on " + platform + "?"); // Ask for confirmation before permanent deletion.
    if (confirmed === false) { // Check whether the administrator cancelled the confirmation.
      return; // Stop without deleting anything.
    } // Finish checking the deletion confirmation.
    setDeletingId(gameId); // Track which D1 row is currently being removed.
    setStatusMessage("Deleting " + gameName + "..."); // Explain which game is being removed.
    try { // Start protected deletion.
      const response = await fetch("/api/admin-games?id=" + gameId, { // Send the requested D1 row ID to the protected delete endpoint.
        method: "DELETE", // Use DELETE for permanent game removal.
        credentials: "same-origin", // Send the secure administrator session cookie.
      }); // Finish sending the protected delete request.
      const data = await response.json(); // Read the deletion response.
      if (response.ok === false) { // Check whether Cloudflare rejected the deletion.
        setStatusMessage(data.message); // Display the server-provided deletion error.
        setDeletingId(0); // Clear the current deletion state.
        return; // Stop before changing the displayed list.
      } // Finish checking the deletion result.
      setGames(function (currentGames) { // Update the protected game list after successful deletion.
        return currentGames.filter(function (game) { // Filter the current D1-added games.
          return game.id !== gameId; // Keep every game except the deleted D1 row.
        }); // Finish filtering the protected game list.
      }); // Finish updating the protected game list.
      setStatusMessage(data.name + " on " + data.platform + " was deleted."); // Confirm which D1 entry was permanently removed.
    } catch { // Handle a missing or unreachable delete API.
      setStatusMessage("Unable to reach the Cloudflare delete API."); // Explain the connection problem.
    } // Finish protected deletion.
    setDeletingId(0); // Clear the current deletion state after the request finishes.
  } // Finish the protected delete handler.

  return ( // Return the complete Delete Game admin page.
    <main className="page-content delete-game-page"> {/* Create the main Delete Game page area. */}
      <section className="collection-hero"> {/* Introduce the protected Delete Game page. */}
        <p className="eyebrow">Admin Only</p> {/* Mark this page as a private site-management area. */}
        <h2>Delete Game</h2> {/* Display the page title. */}
        <p>Delete games that were added through the Add Game page. The original built-in game library cannot be deleted here.</p> {/* Explain the safe deletion scope. */}
      </section> {/* Finish the Delete Game introduction. */}
      {isCheckingSession === true && <section className="add-game-login-panel"><p>Checking admin session...</p></section>} {/* Show progress while Cloudflare checks the secure session cookie. */}
      {isCheckingSession === false && isAuthenticated === false && ( /* Show the login form only when no valid administrator session exists. */
        <section className="add-game-login-panel"> {/* Hold the administrator login controls. */}
          <h3>Administrator Login</h3> {/* Label the private login area. */}
          <p>Enter the same private password used on the Add Game page.</p> {/* Explain which administrator password to use. */}
          <form className="add-game-login-form" onSubmit={handleLogin}> {/* Create the administrator login form. */}
            <label className="add-game-field"> {/* Group the password label and field. */}
              <span>Password</span> {/* Label the administrator password field. */}
              <input type="password" value={password} onChange={handlePasswordChange} autoComplete="current-password" required /> {/* Let the administrator enter the private password. */}
            </label> {/* Finish the administrator password field. */}
            <button type="submit" className="add-game-primary-button">Sign In</button> {/* Submit the password to Cloudflare. */}
          </form> {/* Finish the administrator login form. */}
          <p className="add-game-status" aria-live="polite">{statusMessage}</p> {/* Display login feedback. */}
        </section> /* Finish the administrator login panel. */
      )} {/* Finish conditionally displaying the login panel. */}
      {isCheckingSession === false && isAuthenticated === true && ( /* Show protected controls only after successful authentication. */
        <section className="delete-game-panel"> {/* Hold the protected D1-added game list. */}
          <div className="delete-game-admin-bar"> {/* Group the session state and logout button. */}
            <div> {/* Group the protected-page heading and explanation. */}
              <h3>Added Games</h3> {/* Label the deletable game collection. */}
              <p>Only D1-added games appear below.</p> {/* Reinforce that original games are protected from deletion. */}
            </div> {/* Finish the protected-page heading group. */}
            <button type="button" className="add-game-secondary-button" onClick={handleLogout}>Log Out</button> {/* Let the administrator end the secure session. */}
          </div> {/* Finish the protected admin bar. */}
          <p className="delete-game-status" aria-live="polite">{statusMessage}</p> {/* Display protected loading and deletion feedback. */}
          <div className="delete-game-grid"> {/* Display administrator-added games in a responsive grid. */}
            {games.map(function (game) { /* Build one delete card for every D1-added game. */
              let buttonText = "Delete Game"; // Start with the normal delete button text.
              if (deletingId === game.id) { // Check whether this game is currently being deleted.
                buttonText = "Deleting..."; // Show deletion progress on the active button.
              } // Finish checking the deletion state.
              return ( // Return the current protected delete card.
                <article key={game.id} className="delete-game-card"> {/* Create one card for the current D1-added game. */}
                  <img src={game.cover} alt={game.name + " cover"} draggable="false" /> {/* Display the saved cover artwork. */}
                  <h4>{game.name}</h4> {/* Display the saved game title. */}
                  <p>{game.platform}</p> {/* Display the saved platform so mistakes are easy to identify. */}
                  <p>{game.genres.join(" • ")}</p> {/* Display every saved genre. */}
                  <p>★ {game.rating.toFixed(1)} / 5</p> {/* Display the saved personal rating. */}
                  <button type="button" className="delete-game-button" data-id={game.id} data-name={game.name} data-platform={game.platform} onClick={handleDelete} disabled={deletingId === game.id}>{buttonText}</button> {/* Permanently delete only this D1-added game after confirmation. */}
                </article> /* Finish the current delete card. */
              ); // Finish returning the current protected delete card.
            })} {/* Finish building the protected delete cards. */}
          </div> {/* Finish the protected delete-game grid. */}
        </section> /* Finish the protected Delete Game controls. */
      )} {/* Finish conditionally displaying the protected controls. */}
    </main> /* Finish the Delete Game page. */
  ); // Finish returning the Delete Game page.
} // Finish the DeleteGamePage component.

export default DeleteGamePage; // Allow the router to display the Delete Game page.
