import baseGames from "../../src/data/games.js"; // Import the built-in game library that ships with the website.
import { isAdminAuthenticated } from "../../src/server/auth.js"; // Import the reusable administrator-session checker.

// Convert one D1 row into the same shape used by the React website.
function mapDatabaseGame(row) { // Receive one game row from D1.
  return { // Return the React-friendly game object.
    id: 100000 + row.id, // Keep D1-added IDs separate from the built-in game IDs.
    name: row.name, // Return the stored game title.
    platform: row.platform, // Return the stored platform.
    genres: JSON.parse(row.genres), // Convert the stored JSON genre text back into an array.
    rating: row.rating, // Return the personal rating.
    timelineDate: row.timeline_date, // Return the optional timeline date.
    isFavorite: row.is_favorite === 1, // Convert the stored favorite number into a boolean.
    cover: row.cover, // Return the stored cover image URL.
  }; // Finish returning the mapped game.
} // Finish the D1 game mapper.

// Return the built-in games plus every game added through the admin page.
export async function onRequestGet(context) { // Handle public game-library requests.
  let addedGames = []; // Start with no D1-added games.
  let databaseReady = false; // Track whether the D1 database is connected and initialized.
  if (context.env.DB !== undefined) { // Check whether the D1 binding exists.
    try { // Start protected D1 loading.
      const result = await context.env.DB.prepare("SELECT id, name, platform, genres, rating, timeline_date, is_favorite, cover FROM added_games ORDER BY id ASC").all(); // Load every administrator-added game.
      addedGames = result.results.map(mapDatabaseGame); // Convert every D1 row into website game data.
      databaseReady = true; // Confirm that the database binding and table are working.
    } catch { // Handle a missing table during initial Cloudflare setup.
      addedGames = []; // Keep the public site using only the built-in games.
    } // Finish protected D1 loading.
  } // Finish checking the D1 binding.
  return Response.json({ games: baseGames.concat(addedGames), databaseReady: databaseReady }); // Return the complete public game library.
} // Finish the public game-library handler.

// Save one new game after verifying the administrator session.
export async function onRequestPost(context) { // Handle administrator game-creation requests.
  const authenticated = await isAdminAuthenticated(context); // Check the signed administrator session cookie.
  if (authenticated === false) { // Check whether the visitor is allowed to add games.
    return Response.json({ message: "Administrator login required." }, { status: 401 }); // Reject unauthenticated game creation.
  } // Finish checking administrator access.
  if (context.env.DB === undefined) { // Check whether the D1 binding exists.
    return Response.json({ message: "D1 database binding is not configured yet." }, { status: 503 }); // Explain the missing Cloudflare binding.
  } // Finish checking the D1 binding.
  const body = await context.request.json(); // Read the submitted game data.
  if (typeof body.name !== "string" || body.name.trim() === "") { // Validate the game title.
    return Response.json({ message: "Game name is required." }, { status: 400 }); // Reject an empty game title.
  } // Finish validating the game title.
  if (typeof body.platform !== "string" || body.platform.trim() === "") { // Validate the platform.
    return Response.json({ message: "Platform is required." }, { status: 400 }); // Reject an empty platform.
  } // Finish validating the platform.
  if (Array.isArray(body.genres) === false || body.genres.length === 0) { // Validate the genre array.
    return Response.json({ message: "At least one genre is required." }, { status: 400 }); // Reject an empty genre array.
  } // Finish validating the genres.
  const rating = Number(body.rating); // Convert the submitted rating into a number.
  if (Number.isFinite(rating) === false || rating < 1 || rating > 5) { // Validate the rating range.
    return Response.json({ message: "Rating must be between 1 and 5." }, { status: 400 }); // Reject an invalid rating.
  } // Finish validating the rating.
  if (typeof body.cover !== "string" || body.cover.trim() === "") { // Validate the cover image URL.
    return Response.json({ message: "Cover image URL is required." }, { status: 400 }); // Reject an empty cover URL.
  } // Finish validating the cover image URL.
  const duplicate = await context.env.DB.prepare("SELECT id FROM added_games WHERE LOWER(name) = LOWER(?) AND LOWER(platform) = LOWER(?) LIMIT 1").bind(body.name.trim(), body.platform.trim()).first(); // Check whether this title and platform were already added through D1.
  if (duplicate !== null) { // Check whether a matching D1 game already exists.
    return Response.json({ message: "That game is already saved for this platform." }, { status: 409 }); // Prevent duplicate D1 game entries.
  } // Finish checking for duplicates.
  const favoriteValue = 0; // Start the favorite database value as false.
  let storedFavoriteValue = favoriteValue; // Create the mutable favorite value used by D1.
  if (body.isFavorite === true) { // Check whether the submitted game is a favorite.
    storedFavoriteValue = 1; // Store favorites as one in SQLite.
  } // Finish checking the favorite state.
  const timelineDate = ""; // Start the optional timeline date as empty text.
  let storedTimelineDate = timelineDate; // Create the mutable timeline date used by D1.
  if (typeof body.timelineDate === "string") { // Check whether the request included timeline text.
    storedTimelineDate = body.timelineDate.trim(); // Store the cleaned timeline text.
  } // Finish checking the timeline date.
  const genresText = JSON.stringify(body.genres); // Convert the genre array into JSON text for SQLite storage.
  const result = await context.env.DB.prepare("INSERT INTO added_games (name, platform, genres, rating, timeline_date, is_favorite, cover) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(body.name.trim(), body.platform.trim(), genresText, rating, storedTimelineDate, storedFavoriteValue, body.cover.trim()).run(); // Insert the validated game into D1.
  return Response.json({ saved: true, id: result.meta.last_row_id }, { status: 201 }); // Confirm that the new game was permanently saved.
} // Finish the administrator game-creation handler.
