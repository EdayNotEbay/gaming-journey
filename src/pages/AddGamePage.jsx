import { useState } from "react"; // Import React state so the admin form can store draft game information.

// Keep the empty Add Game form values together.
const emptyGameForm = { // Start the empty form object.
  name: "", // Store the game title field.
  platform: "", // Store the platform field.
  genres: "", // Store comma-separated genres before converting them to an array.
  rating: "5", // Store the personal rating field as form text.
  timelineDate: "", // Store the optional timeline date field.
  cover: "", // Store the game cover URL field.
  isFavorite: false, // Store whether the game should receive the favorite glow.
}; // Finish the empty form object.

// Convert comma-separated genre text into the array used by games.js.
function parseGenres(genreText) { // Receive the raw genre input text.
  const genreParts = genreText.split(","); // Split the text wherever the user typed a comma.
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
  const [formData, setFormData] = useState(emptyGameForm); // Store the current form values.
  const [previewGame, setPreviewGame] = useState(null); // Store the latest submitted preview without writing to the database.
  const [statusMessage, setStatusMessage] = useState(""); // Store feedback shown after the form is submitted.

  // Update any text or select field in the form.
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

  // Build a preview using the same shape as the shared game data.
  function handleSubmit(event) { // Receive the Add Game form submission.
    event.preventDefault(); // Keep the browser from reloading the page.
    const genreList = parseGenres(formData.genres); // Convert the typed genres into an array.

    if (genreList.length === 0) { // Check whether at least one valid genre was entered.
      setStatusMessage("Enter at least one genre before previewing the game."); // Explain what needs to be fixed.
      return; // Stop before building an invalid preview.
    } // Finish validating the genre list.

    const newPreviewGame = { // Build the preview using the same fields as games.js.
      name: formData.name.trim(), // Store the cleaned game title.
      platform: formData.platform, // Store the selected platform.
      genres: genreList, // Store the completed genre array.
      rating: Number(formData.rating), // Convert the rating field into a number.
      timelineDate: formData.timelineDate.trim(), // Store the optional timeline date.
      cover: formData.cover.trim(), // Store the cleaned cover URL.
      isFavorite: formData.isFavorite, // Store the favorite boolean.
    }; // Finish building the preview game.

    setPreviewGame(newPreviewGame); // Display the submitted game preview below the form.
    setStatusMessage("Preview ready. Permanent saving will be connected to the protected Cloudflare backend."); // Explain the current save status clearly.
  } // Finish the form submission handler.

  // Clear the current form and preview.
  function resetForm() { // Reset the Add Game page.
    setFormData(emptyGameForm); // Restore every form field to its empty value.
    setPreviewGame(null); // Remove the current preview.
    setStatusMessage(""); // Clear the current status message.
  } // Finish the reset helper.

  return ( // Return the complete Add Game admin page.
    <main className="page-content add-game-page"> {/* Create the main Add Game page area. */}
      <section className="collection-hero"> {/* Introduce the protected admin page. */}
        <p className="eyebrow">Admin Only</p> {/* Mark this page as the private site-management area. */}
        <h2>Add Game</h2> {/* Display the page title. */}
        <p>This page is for adding games to My Gaming Journey. Cloudflare Access will protect this route so only the approved administrator can reach it.</p> {/* Explain the purpose and planned protection. */}
      </section> {/* Finish the Add Game introduction. */}
      <section className="add-game-panel"> {/* Hold the Add Game form and preview together. */}
        <form className="add-game-form" onSubmit={handleSubmit}> {/* Create the game-entry form. */}
          <label className="add-game-field"> {/* Group the game title label and input. */}
            <span>Game Name</span> {/* Label the game title input. */}
            <input type="text" name="name" value={formData.name} onChange={handleFieldChange} required /> {/* Let the administrator enter the game title. */}
          </label> {/* Finish the game title field. */}
          <label className="add-game-field"> {/* Group the platform label and input. */}
            <span>Platform</span> {/* Label the platform input. */}
            <input type="text" name="platform" value={formData.platform} onChange={handleFieldChange} placeholder="PC, Xbox One, PS5" required /> {/* Let the administrator enter the platform. */}
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
            <input type="text" name="timelineDate" value={formData.timelineDate} onChange={handleFieldChange} placeholder="Optional" /> {/* Let the administrator enter the timeline date later. */}
          </label> {/* Finish the timeline date field. */}
          <label className="add-game-field add-game-field-wide"> {/* Give the cover URL field the full form width. */}
            <span>Cover Image URL</span> {/* Label the cover artwork input. */}
            <input type="url" name="cover" value={formData.cover} onChange={handleFieldChange} placeholder="https://example.com/game-cover.jpg" required /> {/* Let the administrator enter the game cover URL. */}
          </label> {/* Finish the cover URL field. */}
          <label className="add-game-favorite-field"> {/* Group the favorite checkbox and its text. */}
            <input type="checkbox" checked={formData.isFavorite} onChange={handleFavoriteChange} /> {/* Let the administrator mark the game as a favorite. */}
            <span>Mark as Favorite Game</span> {/* Explain the favorite checkbox. */}
          </label> {/* Finish the favorite checkbox field. */}
          <div className="add-game-actions"> {/* Group the form action buttons. */}
            <button type="submit" className="add-game-primary-button">Preview Game</button> {/* Validate the form and build the preview. */}
            <button type="button" className="add-game-secondary-button" onClick={resetForm}>Clear</button> {/* Reset the complete form. */}
          </div> {/* Finish the form actions. */}
          <p className="add-game-status" aria-live="polite">{statusMessage}</p> {/* Display form feedback without interrupting the page. */}
        </form> {/* Finish the Add Game form. */}
        <section className="add-game-preview"> {/* Display the current game preview beside the form. */}
          <h3>Game Preview</h3> {/* Label the preview section. */}
          {previewGame === null && <p className="add-game-preview-empty">Complete the form and select Preview Game to check the data before it is saved.</p>} {/* Explain how to create a preview when no preview exists. */}
          {previewGame !== null && ( /* Display the preview only after the form has been submitted successfully. */
            <div className="add-game-preview-card"> {/* Create the game preview card. */}
              <img src={previewGame.cover} alt={previewGame.name + " cover"} /> {/* Display the entered game cover. */}
              <h4>{previewGame.name}</h4> {/* Display the entered game title. */}
              <p>{previewGame.platform}</p> {/* Display the entered platform. */}
              <p>{previewGame.genres.join(" • ")}</p> {/* Display every entered genre. */}
              <p>★ {previewGame.rating.toFixed(1)} / 5</p> {/* Display the entered personal rating. */}
            </div> /* Finish the game preview card. */
          )} {/* Finish conditionally displaying the game preview. */}
        </section> {/* Finish the Add Game preview. */}
      </section> {/* Finish the Add Game panel. */}
    </main> /* Finish the Add Game page. */
  ); // Finish returning the Add Game page.
} // Finish the AddGamePage component.

export default AddGamePage; // Allow the router to display the Add Game page.
