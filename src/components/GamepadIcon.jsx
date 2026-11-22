// Display a reusable neon-outline gamepad icon inspired by the provided reference image.
function GamepadIcon({ className }) { // Receive a class name so each page can size the same icon differently.
  return ( // Return the reusable SVG gamepad icon.
    <svg className={className} viewBox="0 0 64 40" aria-hidden="true" focusable="false"> {/* Create a compact gamepad drawing that scales cleanly. */}
      <path d="M19 9h26c6 0 10 4 12 10l4 12c1 4-1 7-4 8c-3 1-6 0-8-3l-5-7H20l-5 7c-2 3-5 4-8 3c-3-1-5-4-4-8l4-12c2-6 6-10 12-10Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> {/* Draw the glowing gamepad body. */}
      <path d="M18 18v10M13 23h10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /> {/* Draw the directional pad. */}
      <circle cx="44" cy="20" r="2.5" fill="currentColor" /> {/* Draw the upper action button. */}
      <circle cx="50" cy="25" r="2.5" fill="currentColor" /> {/* Draw the lower action button. */}
    </svg> /* Finish the reusable gamepad drawing. */
  ); // Finish returning the gamepad icon.
} // Finish the GamepadIcon component.

export default GamepadIcon; // Allow the website to reuse the modern gamepad icon.
