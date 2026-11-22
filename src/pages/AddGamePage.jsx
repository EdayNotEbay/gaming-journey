import { useEffect, useState } from "react"; // Import React tools used by the admin login and game form.

// Keep the supported timeline platforms together.
const platformNames = [ // Start the supported platform list.
  "PS2", // Allow PS2 games.
  "PS3", // Allow PS3 games.
  "Xbox 360", // Allow Xbox 360 games.
  "Wii", // Allow Wii games.
  "Wii U", // Allow Wii U games.
  "Xbox One", // Allow Xbox One games.
  "Oculus Quest 2", // Allow Oculus Quest 2 games.
  "PC", // Allow PC games.
]; // Finish the supported platform list.

// Keep the empty Add Game form values together.
const emptyGameForm = { // Start the empty form object.
  name: "", // Store the game title field.
  platform: "PC", // Start the platform field with PC selected.
  genres: "", // Store comma-separated genres before converting them to an array.
  rating: "5", // Store the personal rating field as form text.
  timelineDate: "", // Store the optional timeline date field.
  cover: "", // Store the game cover URL field.
  isFavorite: false, // Store whether the game should receive the favorite glow.
}; // Finish the empty form object.

// Convert comma-separated genre text into the array stored by the API.
function parseGenres(genreText) { // Receive the raw genre input text.
  const genreParts = genreText.split(","); // Split the text wherever the administrator typed a comma.
  const cleanedGenres = []; // Start an empty list for cleaned genre names.
  genreParts.forEach(function (genreName) { // Inspect every typed genre value.
    const cleanedGenre = genreName.trim(); // Remove extra spaces around the genre name.
    if (cleanedGenre !== "") { // Check whether the cleaned genre still contains text.
      cleanedGenres.push(cleanedGenre); // Add the cleaned genre to the final array.
    } // Finish checking the cleaned genre.
  }); // Finish cleaning the typed genres.
  return cleanedGenres; // Return the completed genre array.
} // Finish the genre parsing helper.

// Display the protected Add Game admin page.
function AddGamePage() { // Create the Add Game page component.
  const [formData, setFormData] = useState(emptyGameForm); // Store the current game form values.
  const [previewGame, setPreviewGame] = useState(null); // Store the latest validated game preview.
  const [statusMessage, setStatusMessage] = useState(""); // Store feedback shown below the form.
  const [password, setPassword] = useState(""); // Store the administrator password field.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track whether the administrator session is active.
  const [isCheckingSession, setIsCheckingSession] = useState(true); // Track the initial session-status request.
  const [isSaving, setIsSaving] = useState(false); // Track whether a game save request is running.

  // Check whether the browser already has a valid administrator session.
  useEffect(function () { // Run the session check when the page first opens.
    async function checkSession() { // Create the asynchronous session-status request.
      try { // Start protected session loading.
        const response = await fetch("/api/session", { credentials: "same-origin" }); // Ask Cloudflare whether the secure admin cookie is valid.
        if (response.ok === true) { // Check whether the session endpoint responded successfully.
          const data = await response.json(); // Read the session response.
          if (data.authenticated === true) { // Check whether Cloudflare confirmed the administrator session.
            setIsAuthenticated(true); // Reveal the protected Add Game controls.
          } // Finish checking the authentication state.
        } // Finish checking the session response.
      } catch (error) { // Handle local development before Pages Functions are available.
        setStatusMessage("Admin login becomes available after the Cloudflare backend is configured."); // Explain why local login may not work yet.
      } // Finish protected session loading.
      setIsCheckingSession(false); // Mark the initial session check as complete.
    } // Finish the session-status request.
    checkSession(); // Check the existing administrator session.
  }, []); // Run the session check only once.

  // Update any text or select field in the game form.
  function handleFieldChange(event) { // Receive the changed form control.
    const fieldName = event.target.name; // Read the field name from the changed control.
    const fieldValue = event.target.value; // Read the new field value.
    setFormData(function (currentFormData) { // Update the form using the latest stored values.
      return { // Return the complete updated form object.
        ...currentFormData, // Keep every form field that did not change.
        [fieldName]: fieldValue, // Replace only the field that changed.
      }; // Finish returning the updated form object.
    }); // Finish updating the form state.
  } // Finish the text and select field handler.

  // Update the administrator password field.
  function handlePasswordChange(event) { // Receive the password input change.
    setPassword(event.target.value); // Store the current password text.
  } // Finish the password field handler.

  // Update the favorite checkbox separately because it stores a boolean.
  function handleFavoriteChange(event) { // Receive the favorite checkbox change.
    const favoriteValue = event.target.checked; // Read whether the checkbox is currently selected.
    setFormData(function (currentFormData) { // Update the form using the latest stored values.
      return { // Return the complete updated form object.
        ...currentFormData, // Keep every form field that did not change.
        isFavorite: favoriteValue, // Store the new favorite boolean.
      }; // Finish returning the updated form object.
    }); // Finish updating the favorite field.
  } // Finish the favorite checkbox handler.

  // Submit the administrator password to the secure Cloudflare login endpoint.
  async function handleLogin(event) { // Receive the admin login form submission.
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
      setIsAuthenticated(true); // Reveal the protected Add Game controls.
      setStatusMessage("Admin login successful."); // Confirm that the secure session is active.
    } catch (error) { // Handle a missing or unreachable Cloudflare backend.
      setStatusMessage("Unable to reach the admin login endpoint."); // Explain the connection problem.
    } // Finish protected login handling.
  } // Finish the administrator login handler.

  // End the current administrator session.
  async function handleLogout() { // Handle the admin logout button.
    try { // Start protected logout handling.
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" }); // Ask Cloudflare to clear the secure session cookie.
    } catch (error) { // Handle a network problem during logout.
      setStatusMessage("The local session was cleared, but the logout endpoint could not be reached."); // Explain the partial logout result.
    } // Finish protected logout handling.
    setIsAuthenticated(false); // Hide the protected Add Game controls.
    setPreviewGame(null); // Remove any private game preview.
    setStatusMessage("Logged out."); // Confirm the logout state.
  } // Finish the administrator logout handler.

  // Build a preview using the same shape as the public game data.
  function handlePreview(event) { // Receive the Add Game form submission.
    event.preventDefault(); // Keep the browser from reloading the page.
    const genreList = parseGenres(formData.genres); // Convert the typed genres into an array.
    if (genreList.length === 0) { // Check whether at least one valid genre was entered.
      setStatusMessage("Enter at least one genre before previewing the game."); // Explain what needs to be fixed.
      return; // Stop before building an invalid preview.
    } // Finish validating the genre list.
    const newPreviewGame = { // Build the preview using the same fields as the public API.
      name: formData.name.trim(), // Store the cleaned game title.
      platform: formData.platform, // Store the selected platform.
      genres: genreList, // Store the completed genre array.
      rating: Number(formData.rating), // Convert the rating field into a number.
      timelineDate: formData.timelineDate.trim(), // Store the optional timeline date.
      cover: formData.cover.trim(), // Store the cleaned cover URL.
      isFavorite: formData.isFavorite, // Store the favorite boolean.
    }; // Finish building the preview game.
    setPreviewGame(newPreviewGame); // Display the validated game preview.
    setStatusMessage("Preview ready. Save the game when everything looks correct."); // Explain the next administrator action.
  } // Finish the preview handler.

  // Permanently save the previewed game to Cloudflare D1.
  async function handleSaveGame() { // Handle the permanent game save action.
    if (previewGame === null) { // Check whether a validated preview exists.
      setStatusMessage("Preview the game before saving it."); // Explain the required step.
      return; // Stop before sending an empty save request.
    } // Finish checking for a preview.
    setIsSaving(true); // Disable repeated save attempts while the request runs.
    setStatusMessage("Saving game to Cloudflare D1..."); // Tell the administrator that saving is in progress.
    try { // Start protected D1 saving.
      const response = await fetch("/api/games", { // Send the validated game to the protected server endpoint.
        method: "POST", // Use POST to create the new D1 game row.
        headers: { "Content-Type": "application/json" }, // Tell Cloudflare that the body contains JSON.
        credentials: "same-origin", // Send the secure administrator session cookie.
        body: JSON.stringify(previewGame), // Send the validated game preview to Cloudflare.
      }); // Finish sending the D1 save request.
      const data = await response.json(); // Read the D1 save response.
      if (response.ok === false) { // Check whether the server rejected the save.
        setStatusMessage(data.message); // Display the server-provided save error.
        setIsSaving(false); // Allow another save attempt after the error.
        return; // Stop before clearing the form.
      } // Finish checking the save result.
      setFormData(emptyGameForm); // Clear the form after a successful permanent save.
      setPreviewGame(null); // Remove the saved game preview.
      setStatusMessage("Game saved. It will now appear across the website."); // Confirm that D1 now contains the new game.
    } catch (error) { // Handle a missing or unreachable game API.
      setStatusMessage("Unable to reach the Cloudflare game API."); // Explain the connection problem.
    } // Finish protected D1 saving.
    setIsSaving(false); // Re-enable the save button after the request finishes.
  } // Finish the permanent save handler.

  // Clear the current game form and preview.
  function resetForm() { // Reset the Add Game form.
    setFormData(emptyGameForm); // Restore every game field to its empty value.
    setPreviewGame(null); // Remove the current preview.
    setStatusMessage(""); // Clear the current status message.
  } // Finish the reset helper.

  return ( // Return the complete Add Game admin page.
    <main className="page-content add-game-page"> {/* Create the main Add Game page area. */}
      <section className="collection-hero"> {/* Introduce the protected admin page. */}
        <p className="eyebrow">Admin Only</p> {/* Mark this page as the private site-management area. */}
        <h2>Add Game</h2> {/* Display the page title. */}
        <p>Sign in as the administrator to add a game. Saved games are stored in Cloudflare D1 and are loaded across the public site.</p> {/* Explain the secure D1 workflow. */}
      </section> {/* Finish the Add Game introduction. */}
      {isCheckingSession === true && <section className="add-game-login-panel"><p>Checking admin session...</p></section>} {/* Show progress while Cloudflare checks the secure session cookie. */}
      {isCheckingSession === false && isAuthenticated === false && ( /* Show the login form only when no valid admin session exists. */
        <section className="add-game-login-panel"> {/* Hold the administrator login controls. */}
          <h3>Administrator Login</h3> {/* Label the private login area. */}
          <p>Enter the private password configured in Cloudflare.</p> {/* Explain where the password comes from. */}
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
        <section className="add-game-panel"> {/* Hold the protected Add Game form and preview together. */}
          <form className="add-game-form" onSubmit={handlePreview}> {/* Create the protected game-entry form. */}
            <div className="add-game-admin-bar"> {/* Group the admin-session label and logout action. */}
              <span>Administrator session active</span> {/* Confirm that the private session is active. */}
              <button type="button" className="add-game-secondary-button" onClick={handleLogout}>Log Out</button> {/* Let the administrator end the secure session. */}
            </div> {/* Finish the admin-session bar. */}
            <label className="add-game-field"> {/* Group the game title label and input. */}
              <span>Game Name</span> {/* Label the game title input. */}
              <input type="text" name="name" value={formData.name} onChange={handleFieldChange} required /> {/* Let the administrator enter the game title. */}
            </label> {/* Finish the game title field. */}
            <label className="add-game-field"> {/* Group the platform label and dropdown. */}
              <span>Platform</span> {/* Label the platform dropdown. */}
              <select name="platform" value={formData.platform} onChange={handleFieldChange}> {/* Keep added games on platforms supported by the current timeline layout. */}
                {platformNames.map(function (platformName) { /* Build one option for every supported timeline platform. */
                  return <option key={platformName} value={platformName}>{platformName}</option>; // Display the current platform option.
                })} {/* Finish building platform options. */}
              </select> {/* Finish the platform dropdown. */}
            </label> {/* Finish the platform field. */}
            <label className="add-game-field add-game-field-wide"> {/* Give the genres field the full form width. */}
              <span>Genres</span> {/* Label the multiple-genre input. */}
              <input type="text" name="genres" value={formData.genres} onChange={handleFieldChange} placeholder="Action RPG, Open World, Adventure" required /> {/* Let the administrator enter multiple comma-separated genres. */}
            </label> {/* Finish the genres field. */}
            <label className="add-game-field"> {/* Group the rating label and dropdown. */}
              <span>My Personal Rating</span> {/* Label the personal rating dropdown. */}
              <select name="rating" value={formData.rating} onChange={handleFieldChange}> {/* Let the administrator select a rating out of five. */}
                <option value="5">5.0 / 5</option> {/* Offer the highest rating. */}
                <option value="4.5">4.5 / 5</option> {/* Offer a four-and-a-half rating. */}
                <option value="4">4.0 / 5</option> {/* Offer a four-star rating. */}
                <option value="3.5">3.5 / 5</option> {/* Offer a three-and-a-half rating. */}
                <option value="3">3.0 / 5</option> {/* Offer a three-star rating. */}
                <option value="2.5">2.5 / 5</option> {/* Offer a two-and-a-half rating. */}
                <option value="2">2.0 / 5</option> {/* Offer a two-star rating. */}
                <option value="1.5">1.5 / 5</option> {/* Offer a one-and-a-half rating. */}
                <option value="1">1.0 / 5</option> {/* Offer a one-star rating. */}
              </select> {/* Finish the rating dropdown. */}
            </label> {/* Finish the rating field. */}
            <label className="add-game-field"> {/* Group the timeline date label and input. */}
              <span>Timeline Date</span> {/* Label the optional timeline date input. */}
              <input type="text" name="timelineDate" value={formData.timelineDate} onChange={handleFieldChange} placeholder="Optional" /> {/* Let the administrator enter timeline text later. */}
            </label> {/* Finish the timeline date field. */}
            <label className="add-game-field add-game-field-wide"> {/* Give the cover URL field the full form width. */}
              <span>Cover Image URL</span> {/* Label the cover artwork input. */}
              <input type="url" name="cover" value={formData.cover} onChange={handleFieldChange} placeholder="https://example.com/game-cover.jpg" required /> {/* Let the administrator enter the game cover URL. */}
            </label> {/* Finish the cover URL field. */}
            <label className="add-game-favorite-field"> {/* Group the favorite checkbox and its text. */}
              <input type="checkbox" checked={formData.isFavorite} onChange={handleFavoriteChange} /> {/* Let the administrator mark the game as a favorite. */}
              <span>Mark as Favorite Game</span> {/* Explain the favorite checkbox. */}
            </label> {/* Finish the favorite checkbox field. */}
            <div className="add-game-actions"> {/* Group the game form action buttons. */}
              <button type="submit" className="add-game-primary-button">Preview Game</button> {/* Validate the form and build the preview. */}
              <button type="button" className="add-game-secondary-button" onClick={resetForm}>Clear</button> {/* Reset the complete game form. */}
            </div> {/* Finish the game form actions. */}
            <p className="add-game-status" aria-live="polite">{statusMessage}</p> {/* Display game form feedback. */}
          </form> {/* Finish the protected Add Game form. */}
          <section className="add-game-preview"> {/* Display the current game preview beside the form. */}
            <h3>Game Preview</h3> {/* Label the preview section. */}
            {previewGame === null && <p className="add-game-preview-empty">Complete the form and select Preview Game to check the data before saving it.</p>} {/* Explain how to create a preview when no preview exists. */}
            {previewGame !== null && ( /* Display the preview only after the form has been validated. */
              <div className="add-game-preview-card"> {/* Create the game preview card. */}
                <img src={previewGame.cover} alt={previewGame.name + " cover"} /> {/* Display the entered game cover. */}
                <h4>{previewGame.name}</h4> {/* Display the entered game title. */}
                <p>{previewGame.platform}</p> {/* Display the selected platform. */}
                <p>{previewGame.genres.join(" • ")}</p> {/* Display every entered genre. */}
                <p>★ {previewGame.rating.toFixed(1)} / 5</p> {/* Display the entered personal rating. */}
                <button type="button" className="add-game-primary-button" onClick={handleSaveGame} disabled={isSaving}>Save Game</button> {/* Permanently save the validated preview to Cloudflare D1. */}
              </div> /* Finish the game preview card. */
            )} {/* Finish conditionally displaying the game preview. */}
          </section> {/* Finish the Add Game preview. */}
        </section> /* Finish the protected Add Game panel. */
      )} {/* Finish conditionally displaying the protected controls. */}
    </main> /* Finish the Add Game page. */
  ); // Finish returning the Add Game page.
} // Finish the AddGamePage component.

export default AddGamePage; // Allow the router to display the Add Game page.
