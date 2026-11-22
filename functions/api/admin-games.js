import { isAdminAuthenticated } from "../../src/server/auth.js"; // Import the reusable administrator-session checker.

// Convert one D1 row into the shape used by the Delete Game page.
function mapAdminGame(row) { // Receive one administrator-added D1 row.
  return { // Return the delete-page game object.
    id: row.id, // Keep the real D1 row ID for deletion.
    name: row.name, // Return the stored game title.
    platform: row.platform, // Return the stored platform.
    genres: JSON.parse(row.genres), // Convert stored genre JSON back into an array.
    rating: row.rating, // Return the personal rating.
    timelineDate: row.timeline_date, // Return the optional timeline date.
    isFavorite: row.is_favorite === 1, // Convert the stored favorite number into a boolean.
    cover: row.cover, // Return the stored cover image URL.
  }; // Finish returning the delete-page game object.
} // Finish the administrator game mapper.

// Return only games that were added through the administrator page.
export async function onRequestGet(context) { // Handle the protected administrator game-list request.
  const authenticated = await isAdminAuthenticated(context); // Check the signed administrator session cookie.
  if (authenticated === false) { // Check whether the visitor is allowed to manage D1 games.
    return Response.json({ message: "Administrator login required." }, { status: 401 }); // Reject unauthenticated access.
  } // Finish checking administrator access.
  if (context.env.DB === undefined) { // Check whether the D1 binding exists.
    return Response.json({ message: "D1 database binding is not configured." }, { status: 503 }); // Explain the missing database binding.
  } // Finish checking the D1 binding.
  const result = await context.env.DB.prepare("SELECT id, name, platform, genres, rating, timeline_date, is_favorite, cover FROM added_games ORDER BY id DESC").all(); // Load only administrator-added games.
  const games = result.results.map(mapAdminGame); // Convert every D1 row into delete-page data.
  return Response.json({ games: games }); // Return the protected D1-added game list.
} // Finish the protected administrator game-list handler.

// Delete one administrator-added game by its D1 row ID.
export async function onRequestDelete(context) { // Handle the protected administrator delete request.
  const authenticated = await isAdminAuthenticated(context); // Check the signed administrator session cookie.
  if (authenticated === false) { // Check whether the visitor is allowed to delete D1 games.
    return Response.json({ message: "Administrator login required." }, { status: 401 }); // Reject unauthenticated deletion.
  } // Finish checking administrator access.
  if (context.env.DB === undefined) { // Check whether the D1 binding exists.
    return Response.json({ message: "D1 database binding is not configured." }, { status: 503 }); // Explain the missing database binding.
  } // Finish checking the D1 binding.
  const requestUrl = new URL(context.request.url); // Read the current request URL.
  const idText = requestUrl.searchParams.get("id"); // Read the requested D1 row ID from the query string.
  const gameId = Number(idText); // Convert the requested ID into a number.
  if (Number.isInteger(gameId) === false || gameId < 1) { // Validate the requested D1 row ID.
    return Response.json({ message: "A valid game ID is required." }, { status: 400 }); // Reject an invalid delete request.
  } // Finish validating the requested game ID.
  const existingGame = await context.env.DB.prepare("SELECT id, name, platform FROM added_games WHERE id = ? LIMIT 1").bind(gameId).first(); // Confirm that the requested D1 game exists.
  if (existingGame === null) { // Check whether the requested game was found.
    return Response.json({ message: "That added game was not found." }, { status: 404 }); // Explain that nothing can be deleted.
  } // Finish checking whether the game exists.
  await context.env.DB.prepare("DELETE FROM added_games WHERE id = ?").bind(gameId).run(); // Permanently remove the requested D1-added game.
  return Response.json({ deleted: true, name: existingGame.name, platform: existingGame.platform }); // Confirm which game was removed.
} // Finish the protected administrator delete handler.
