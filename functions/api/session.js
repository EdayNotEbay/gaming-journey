import { isAdminAuthenticated } from "../../src/server/auth.js"; // Import the reusable administrator-session checker.

// Report whether the visitor currently has a valid administrator session.
export async function onRequestGet(context) { // Receive the Cloudflare Pages Function context.
  const authenticated = await isAdminAuthenticated(context); // Check the signed administrator session cookie.
  return Response.json({ authenticated: authenticated }); // Return the current authentication state.
} // Finish the session-status handler.
