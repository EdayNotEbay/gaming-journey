const textEncoder = new TextEncoder(); // Create one encoder for session-signing text.

// Convert binary signature bytes into readable hexadecimal text.
function bytesToHex(bytes) { // Receive signature bytes from Web Crypto.
  let hexText = ""; // Start an empty hexadecimal string.
  bytes.forEach(function (byte) { // Inspect every signature byte.
    hexText = hexText + byte.toString(16).padStart(2, "0"); // Add the current byte as two hexadecimal characters.
  }); // Finish converting signature bytes.
  return hexText; // Return the complete hexadecimal signature.
} // Finish the byte conversion helper.

// Create an HMAC signature for one session value.
async function signValue(value, secret) { // Receive the value and private session secret.
  const key = await crypto.subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); // Create the private HMAC signing key.
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value)); // Sign the session value.
  return bytesToHex(new Uint8Array(signature)); // Return the signature as hexadecimal text.
} // Finish the signing helper.

// Create a signed session token that lasts for one day.
export async function createSessionToken(secret) { // Receive the Cloudflare session secret.
  const expiresAt = Date.now() + 86400000; // Set the session expiration to twenty-four hours from now.
  const value = String(expiresAt); // Convert the expiration time into signable text.
  const signature = await signValue(value, secret); // Sign the expiration time with the private secret.
  return value + "." + signature; // Return the expiration time and signature together.
} // Finish the session-token creator.

// Verify that a signed session token is valid and has not expired.
export async function verifySessionToken(token, secret) { // Receive the session token and private secret.
  if (typeof token !== "string") { // Check whether a usable token was supplied.
    return false; // Reject missing or invalid token values.
  } // Finish validating the token type.
  const tokenParts = token.split("."); // Separate the expiration time from the signature.
  if (tokenParts.length !== 2) { // Check whether the token contains both required parts.
    return false; // Reject malformed session tokens.
  } // Finish checking token structure.
  const expiresAt = Number(tokenParts[0]); // Convert the expiration value back into a number.
  if (Number.isFinite(expiresAt) === false) { // Check whether the expiration value is valid.
    return false; // Reject invalid expiration values.
  } // Finish checking the expiration value.
  if (Date.now() > expiresAt) { // Check whether the session has already expired.
    return false; // Reject expired sessions.
  } // Finish checking session expiration.
  const expectedSignature = await signValue(tokenParts[0], secret); // Recreate the correct signature for the expiration value.
  return expectedSignature === tokenParts[1]; // Accept only a signature that matches exactly.
} // Finish the session-token verifier.

// Read one named cookie from the incoming request.
export function getCookie(request, cookieName) { // Receive the request and desired cookie name.
  const cookieHeader = request.headers.get("Cookie"); // Read the complete Cookie header.
  if (cookieHeader === null) { // Check whether the request contains any cookies.
    return ""; // Return an empty value when no cookies exist.
  } // Finish checking for the Cookie header.
  const cookieParts = cookieHeader.split(";"); // Separate every cookie in the request.
  let cookieValue = ""; // Start with an empty result.
  cookieParts.forEach(function (cookiePart) { // Inspect every cookie entry.
    const trimmedCookie = cookiePart.trim(); // Remove extra spaces around the cookie.
    const prefix = cookieName + "="; // Build the expected cookie-name prefix.
    if (trimmedCookie.startsWith(prefix) === true) { // Check whether this is the requested cookie.
      cookieValue = trimmedCookie.slice(prefix.length); // Store the requested cookie value.
    } // Finish checking the current cookie.
  }); // Finish inspecting cookies.
  return cookieValue; // Return the requested cookie value.
} // Finish the cookie-reading helper.

// Check whether the current request contains a valid admin session.
export async function isAdminAuthenticated(context) { // Receive the Cloudflare Pages Function context.
  const secret = context.env.SESSION_SECRET; // Read the private session secret from Cloudflare.
  if (typeof secret !== "string" || secret === "") { // Check whether the session secret has been configured.
    return false; // Reject authentication when the required secret is missing.
  } // Finish checking the session secret.
  const token = getCookie(context.request, "gaming_admin"); // Read the admin session cookie.
  return verifySessionToken(token, secret); // Return whether the signed session is valid.
} // Finish the admin-authentication helper.
