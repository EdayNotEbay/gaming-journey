// Clear the administrator session cookie.
export function onRequestPost() { // Handle an administrator logout request.
  const cookie = "gaming_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"; // Expire the administrator cookie immediately.
  return Response.json({ authenticated: false }, { headers: { "Set-Cookie": cookie } }); // Clear the cookie and confirm logout.
} // Finish the logout handler.
