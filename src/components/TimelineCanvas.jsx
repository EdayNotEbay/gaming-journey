import { useEffect, useRef } from "react"; // Import React tools for the draggable scroll canvas.
import PlatformGroup from "./PlatformGroup.jsx"; // Import the reusable platform group component.

// Keep the platform order and canvas positions in one place.
const platformLayouts = [ // Start the platform layout list.
  { name: "PS2", className: "platform-ps2" }, // Position the PS2 group above the timeline.
  { name: "PS3", className: "platform-ps3" }, // Position the PS3 group above the timeline.
  { name: "Xbox 360", className: "platform-xbox-360" }, // Position the larger Xbox 360 group above the timeline.
  { name: "Wii", className: "platform-wii" }, // Position the Wii group below the timeline.
  { name: "Wii U", className: "platform-wii-u" }, // Position the Wii U group below the timeline.
  { name: "Xbox One", className: "platform-xbox-one" }, // Position the Xbox One group below the timeline.
  { name: "Oculus Quest 2", className: "platform-quest-2" }, // Position the Quest 2 group below the timeline.
  { name: "PC", className: "platform-pc" }, // Position the larger PC group below the timeline.
]; // Finish the platform layout list.

// Return every game that belongs to one platform.
function getGamesForPlatform(games, platformName) { // Receive the full game list and one platform name.
  return games.filter(function (game) { // Filter the full list down to one platform.
    return game.platform === platformName; // Keep games that match the requested platform.
  }); // Finish filtering the games.
} // Finish the platform filtering helper.

// Display the large two-dimensional timeline workspace.
function TimelineCanvas({ games }) { // Receive all timeline games from the page.
  const viewportRef = useRef(null); // Keep a reference to the scrollable viewport.
  const dragState = useRef({ active: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 }); // Store mouse-drag values without rerendering the page.

  // Place the view near the middle of the canvas when the page first loads.
  useEffect(function () { // Run once after the timeline viewport is available.
    if (viewportRef.current !== null) { // Make sure the viewport exists before setting its starting position.
      viewportRef.current.scrollLeft = 260; // Start slightly to the right so the first platform groups are visible.
      viewportRef.current.scrollTop = 300; // Start vertically centered around the main timeline.
    } // Finish checking the viewport reference.
  }, []); // Keep the setup effect from repeating.

  // Return the viewport to the preferred starting area.
  function recenterTimeline() { // Recenter the two-dimensional timeline.
    if (viewportRef.current === null) { // Make sure the viewport exists before using it.
      return; // Stop when the viewport is not ready yet.
    } // Finish checking the viewport reference.
    viewportRef.current.scrollLeft = 260; // Start slightly to the right so the first platform groups are visible.
    viewportRef.current.scrollTop = 300; // Start vertically centered around the main timeline.
  } // Finish the recenter helper.

  // Start dragging when the pointer presses empty canvas space.
  function handlePointerDown(event) { // Receive the pointer-down event from the viewport.
    if (event.target.closest(".game-card") !== null) { // Keep game cards clickable instead of starting a drag.
      return; // Stop before beginning a canvas drag.
    } // Finish protecting game-card clicks.
    dragState.current.active = true; // Mark the canvas as actively dragging.
    dragState.current.startX = event.clientX; // Save the pointer's starting horizontal position.
    dragState.current.startY = event.clientY; // Save the pointer's starting vertical position.
    dragState.current.scrollLeft = viewportRef.current.scrollLeft; // Save the starting horizontal scroll position.
    dragState.current.scrollTop = viewportRef.current.scrollTop; // Save the starting vertical scroll position.
    viewportRef.current.setPointerCapture(event.pointerId); // Keep receiving movement while the pointer is held down.
    viewportRef.current.classList.add("timeline-viewport-dragging"); // Change the cursor while dragging.
  } // Finish the pointer-down handler.

  // Move the canvas horizontally and vertically with the pointer.
  function handlePointerMove(event) { // Receive pointer movement from the viewport.
    if (dragState.current.active === false) { // Check whether a drag is currently active.
      return; // Ignore movement when the user is not dragging.
    } // Finish checking the drag state.
    const movedX = event.clientX - dragState.current.startX; // Measure horizontal pointer movement.
    const movedY = event.clientY - dragState.current.startY; // Measure vertical pointer movement.
    viewportRef.current.scrollLeft = dragState.current.scrollLeft - movedX; // Pan left or right based on pointer movement.
    viewportRef.current.scrollTop = dragState.current.scrollTop - movedY; // Pan up or down based on pointer movement.
  } // Finish the pointer-move handler.

  // Stop dragging and restore the normal cursor.
  function stopDragging() { // End the current drag interaction.
    dragState.current.active = false; // Mark the canvas as no longer dragging.
    if (viewportRef.current !== null) { // Make sure the viewport still exists.
      viewportRef.current.classList.remove("timeline-viewport-dragging"); // Restore the normal grab cursor.
    } // Finish checking the viewport reference.
  } // Finish the drag-stop helper.

  return ( // Return the complete draggable timeline interface.
    <section className="timeline-section"> {/* Group the timeline heading and canvas together. */}
      <div className="timeline-toolbar"> {/* Display timeline instructions and the recenter control. */}
        <div> {/* Group the timeline heading and description. */}
          <h2>Gaming Timeline</h2> {/* Name the interactive timeline. */}
          <p>Drag empty space left, right, up, or down to explore my gaming history.</p> {/* Explain the two-dimensional interaction. */}
        </div> {/* Finish the timeline heading group. */}
        <button type="button" className="recenter-button" onClick={recenterTimeline}>Recenter Timeline</button> {/* Let visitors return to the starting view. */}
      </div> {/* Finish the timeline toolbar. */}
      <div ref={viewportRef} className="timeline-viewport" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging}> {/* Create the scrollable window into the larger canvas. */}
        <div className="timeline-canvas"> {/* Create the oversized two-dimensional timeline workspace. */}
          <div className="timeline-main-line"></div> {/* Draw the main horizontal timeline line. */}
          {platformLayouts.map(function (layout) { /* Build one positioned platform group for each platform. */
            const platformGames = getGamesForPlatform(games, layout.name); // Get only the games for the current platform.
            return <PlatformGroup key={layout.name} platform={layout.name} games={platformGames} className={layout.className} />; // Display the current platform group.
          })} {/* Finish building all platform groups. */}
        </div> {/* Finish the large timeline canvas. */}
      </div> {/* Finish the visible timeline viewport. */}
    </section> /* Finish the timeline section. */
  ); // Finish returning the timeline interface.
} // Finish the TimelineCanvas component.

export default TimelineCanvas; // Allow the Timeline page to use this component.
