// Display a reusable gamepad icon that closely matches the provided controller reference shape.
function GamepadIcon({ className }) { // Receive a class name so each page can size the same icon differently.
  return ( // Return the reusable SVG gamepad icon.
    <svg className={className} viewBox="0 0 64 42" aria-hidden="true" focusable="false"> {/* Create the wider flat-top controller silhouette from the reference image. */}
      <path d="M18 10H46C51 10 54 13 56 18L60 30C61 34 59 37 56 38C53 39 51 37 49 34L45 28H19L15 34C13 37 11 39 8 38C5 37 3 34 4 30L8 18C10 13 13 10 18 10Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /> {/* Draw the flatter reference-style controller shell with tapered grips. */}
      <path d="M18 18V26M14 22H22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /> {/* Draw the compact directional pad on the left side. */}
      <circle cx="45.5" cy="19.5" r="2.2" fill="currentColor" /> {/* Draw the upper action button on the right side. */}
      <circle cx="50.5" cy="24.5" r="2.2" fill="currentColor" /> {/* Draw the lower action button on the right side. */}
      <circle cx="29" cy="22" r="1.25" fill="currentColor" /> {/* Draw the first small center button from the reference design. */}
      <circle cx="35" cy="22" r="1.25" fill="currentColor" /> {/* Draw the second small center button from the reference design. */}
    </svg> /* Finish the reusable reference-style gamepad drawing. */
  ); // Finish returning the gamepad icon.
} // Finish the GamepadIcon component.

export default GamepadIcon; // Allow the website to reuse the reference-style gamepad icon.
