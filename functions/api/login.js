import { createSessionToken } from "../../src/server/auth.js"; // Import the reusable session-token creator.

// Handle administrator login requests.
export async function onRequestPost(context) { // Receive the Cloudflare Pages Function context.
  const configuredPassword = context.env.ADMIN_PASSWORD; // Read the private administrator password from Cloudflare.
  const sessionSecret = context.env.SESSION_SECRET; // Read the private session-signing secret from Cloudflare.
  if (typeof configuredPassword !== "string" || configuredPassword === "" || typeof sessionSecret !== "string" || sessionSecret === "") { // Check whether both required secrets exist.
    return Response.json({ message: "Admin login is not configured yet." }, { status: 503 }); // Explain that Cloudflare secrets still need configuration.
  } // Finish checking the required secrets.
  const body = await context.request.json(); // Read the submitted login data.
  if (body.password !== configuredPassword) { // Check whether the submitted password matches the private password.
    return Response.json({ message: "Incorrect password." }, { status: 401 }); // Reject an incorrect administrator password.
  } // Finish checking the administrator password.
  const token = await createSessionToken(sessionSecret); // Create a signed one-day administrator session.
  const cookie = "gaming_admin=" + token + "; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400"; // Build the protected administrator session cookie.
  return Response.json({ authenticated: true }, { headers: { "Set-Cookie": cookie } }); // Save the secure cookie and confirm successful login.
} // Finish the administrator login handler.
