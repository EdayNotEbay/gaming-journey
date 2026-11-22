// Display a reusable compact controller icon that matches the provided reference proportions.
function GamepadIcon({ className }) { // Receive a class name so the same controller can be sized in different locations.
  return ( // Return the reusable compact controller SVG.
    <svg className={className} viewBox="0 0 54 42" aria-hidden="true" focusable="false"> {/* Create a shorter controller shape with proportions closer to the provided reference. */}
      <path d="M16 11H38C42 11 45 14 47 19L50 29C51 33 49 36 46 36C43 36 41 34 39 31L36 27H18L15 31C13 34 11 36 8 36C5 36 3 33 4 29L7 19C9 14 12 11 16 11Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> {/* Draw the compact flat-top shell and shorter tapered grips. */}
      <path d="M16 18V25M12.5 21.5H19.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /> {/* Draw the compact directional pad on the left side. */}
      <circle cx="37" cy="19.5" r="1.9" fill="currentColor" /> {/* Draw the upper action button on the right side. */}
      <circle cx="41.5" cy="24" r="1.9" fill="currentColor" /> {/* Draw the lower action button on the right side. */}
      <circle cx="24" cy="21.5" r="1" fill="currentColor" /> {/* Draw the first small center button. */}
      <circle cx="29" cy="21.5" r="1" fill="currentColor" /> {/* Draw the second small center button. */}
    </svg> /* Finish the compact controller SVG. */
  ); // Finish returning the controller icon.
} // Finish the GamepadIcon component.

export default GamepadIcon; // Allow the website to reuse the same compact controller everywhere.
