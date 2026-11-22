// Display a reusable controller icon that matches the provided simple outline reference.
function GamepadIcon({ className }) { // Receive a class name so the same controller can be sized in different locations.
  return ( // Return the reusable controller SVG.
    <svg className={className} viewBox="0 0 64 42" aria-hidden="true" focusable="false"> {/* Create the wide low-profile controller shape from the reference image. */}
      <path d="M18 11H46C50 11 53 14 55 19L59 30C60 34 58 37 55 37C52 37 50 35 48 32L44 27H20L16 32C14 35 12 37 9 37C6 37 4 34 5 30L9 19C11 14 14 11 18 11Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> {/* Draw the simple flat-top shell and tapered grips. */}
      <path d="M18 18V26M14 22H22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /> {/* Draw the reference-style directional pad. */}
      <circle cx="45" cy="19.5" r="2" fill="currentColor" /> {/* Draw the upper action button. */}
      <circle cx="50" cy="24.5" r="2" fill="currentColor" /> {/* Draw the lower action button. */}
      <circle cx="29" cy="22" r="1" fill="currentColor" /> {/* Draw the first small center button. */}
      <circle cx="35" cy="22" r="1" fill="currentColor" /> {/* Draw the second small center button. */}
    </svg> /* Finish the reusable controller SVG. */
  ); // Finish returning the controller icon.
} // Finish the GamepadIcon component.

export default GamepadIcon; // Allow the website to reuse the same controller everywhere.
