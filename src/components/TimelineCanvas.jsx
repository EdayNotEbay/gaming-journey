import { useEffect, useRef, useState } from "react"; // Import React tools for dragging and zooming the timeline.
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

// Keep the available zoom levels in one place.
const zoomClasses = [ // Start the zoom class list.
  "timeline-zoom-70", // Allow visitors to zoom far out.
  "timeline-zoom-85", // Allow visitors to zoom slightly out.
  "timeline-zoom-100", // Keep the normal timeline size.
  "timeline-zoom-115", // Allow visitors to zoom slightly in.
  "timeline-zoom-130", // Allow visitors to zoom farther in.
]; // Finish the zoom class list.

// Keep readable zoom labels beside the controls.
const zoomLabels = [ // Start the zoom label list.
  "70%", // Label the far zoomed-out view.
  "85%", // Label the slightly zoomed-out view.
  "100%", // Label the normal view.
  "115%", // Label the slightly zoomed-in view.
  "130%", // Label the farther zoomed-in view.
]; // Finish the zoom label list.

// Return every game that belongs to one platform.
function getGamesForPlatform(games, platformName) { // Receive the full game list and one platform name.
  return games.filter(function (game) { // Filter the full list down to one platform.
    return game.platform === platformName; // Keep games that match the requested platform.
  }); // Finish filtering the games.
} // Finish the platform filtering helper.

// Display the large two-dimensional timeline workspace.
function TimelineCanvas({ games }) { // Receive all timeline games from the page.
  const viewportRef = useRef(null); // Keep a reference to the scrollable viewport.
  const dragState = useRef({ active: false, moved: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 }); // Store mouse-drag values without rerendering the page.
  const [zoomIndex, setZoomIndex] = useState(2); // Start the timeline at the normal 100 percent zoom level.
  const zoomClass = zoomClasses[zoomIndex]; // Read the CSS class for the current zoom level.
  const zoomLabel = zoomLabels[zoomIndex]; // Read the text label for the current zoom level.

  // Place the view near the beginning of the timeline when the page first loads.
  useEffect(function () { // Run once after the timeline viewport is available.
    if (viewportRef.current !== null) { // Make sure the viewport exists before setting its starting position.
      viewportRef.current.scrollLeft = 280; // Start far enough right to center the early platform groups.
      viewportRef.current.scrollTop = 620; // Start vertically around the main timeline line.
    } // Finish checking the viewport reference.
  }, []); // Keep the setup effect from repeating.

  // Return the viewport to the preferred starting area.
  function recenterTimeline() { // Recenter the two-dimensional timeline.
    if (viewportRef.current === null) { // Make sure the viewport exists before using it.
      return; // Stop when the viewport is not ready yet.
    } // Finish checking the viewport reference.
    viewportRef.current.scrollLeft = 280; // Return to the early platform groups.
    viewportRef.current.scrollTop = 620; // Return to the main timeline area.
  } // Finish the recenter helper.

  // Increase the timeline zoom by one preset level.
  function zoomIn() { // Zoom the timeline inward.
    setZoomIndex(function (currentIndex) { // Update the zoom from the current level.
      if (currentIndex >= zoomClasses.length - 1) { // Check whether the maximum zoom is already active.
        return currentIndex; // Keep the current level when no larger level exists.
      } // Finish checking the maximum zoom.
      return currentIndex + 1; // Move to the next larger zoom level.
    }); // Finish updating the zoom level.
  } // Finish the zoom-in helper.

  // Decrease the timeline zoom by one preset level.
  function zoomOut() { // Zoom the timeline outward.
    setZoomIndex(function (currentIndex) { // Update the zoom from the current level.
      if (currentIndex <= 0) { // Check whether the minimum zoom is already active.
        return currentIndex; // Keep the current level when no smaller level exists.
      } // Finish checking the minimum zoom.
      return currentIndex - 1; // Move to the next smaller zoom level.
    }); // Finish updating the zoom level.
  } // Finish the zoom-out helper.

  // Use the mouse wheel to zoom when the pointer is over the timeline.
  function handleWheel(event) { // Receive the wheel event from the timeline viewport.
    event.preventDefault(); // Keep the page itself from scrolling while the pointer is over the timeline.
    if (event.deltaY < 0) { // Check whether the wheel moved upward.
      zoomIn(); // Zoom inward when the wheel moves upward.
      return; // Stop after handling the upward wheel movement.
    } // Finish checking the upward wheel movement.
    if (event.deltaY > 0) { // Check whether the wheel moved downward.
      zoomOut(); // Zoom outward when the wheel moves downward.
    } // Finish checking the downward wheel movement.
  } // Finish the wheel zoom handler.

  // Start dragging from canvas space, platform groups, or game cards.
  function handlePointerDown(event) { // Receive the pointer-down event from anywhere inside the viewport.
    dragState.current.active = true; // Mark the canvas as ready to drag.
    dragState.current.moved = false; // Reset the drag movement flag for this pointer press.
    dragState.current.startX = event.clientX; // Save the pointer's starting horizontal position.
    dragState.current.startY = event.clientY; // Save the pointer's starting vertical position.
    dragState.current.scrollLeft = viewportRef.current.scrollLeft; // Save the starting horizontal scroll position.
    dragState.current.scrollTop = viewportRef.current.scrollTop; // Save the starting vertical scroll position.
    viewportRef.current.setPointerCapture(event.pointerId); // Keep receiving movement while the pointer is held down.
  } // Finish the pointer-down handler.

  // Move the canvas horizontally and vertically with the pointer.
  function handlePointerMove(event) { // Receive pointer movement from the viewport.
    if (dragState.current.active === false) { // Check whether a pointer press is currently active.
      return; // Ignore movement when the user is not holding the pointer down.
    } // Finish checking the drag state.
    const movedX = event.clientX - dragState.current.startX; // Measure horizontal pointer movement.
    const movedY = event.clientY - dragState.current.startY; // Measure vertical pointer movement.
    const horizontalDistance = Math.abs(movedX); // Convert horizontal movement into a positive distance.
    const verticalDistance = Math.abs(movedY); // Convert vertical movement into a positive distance.

    if (horizontalDistance > 6 || verticalDistance > 6) { // Treat movement beyond a few pixels as a drag instead of a click.
      dragState.current.moved = true; // Remember that this pointer press became a drag.
      viewportRef.current.classList.add("timeline-viewport-dragging"); // Change the cursor while the canvas is moving.
    } // Finish checking the drag threshold.

    if (dragState.current.moved === false) { // Keep tiny pointer movement from shifting the canvas during a normal click.
      return; // Wait until the pointer has moved far enough to count as a drag.
    } // Finish checking whether the pointer has become a drag.

    viewportRef.current.scrollLeft = dragState.current.scrollLeft - movedX; // Pan left or right based on pointer movement.
    viewportRef.current.scrollTop = dragState.current.scrollTop - movedY; // Pan up or down based on pointer movement.
  } // Finish the pointer-move handler.

  // Stop dragging and restore the normal cursor.
  function stopDragging() { // End the current drag interaction.
    dragState.current.active = false; // Mark the pointer press as finished.
    if (viewportRef.current !== null) { // Make sure the viewport still exists.
      viewportRef.current.classList.remove("timeline-viewport-dragging"); // Restore the normal cursor after dragging.
    } // Finish checking the viewport reference.
  } // Finish the drag-stop helper.

  // Stop a game-card click from navigating when the same pointer press was used to drag.
  function handleClickCapture(event) { // Receive click events before child game cards handle them.
    if (dragState.current.moved === true) { // Check whether the pointer press moved the canvas.
      event.preventDefault(); // Cancel the normal click action after a drag.
      event.stopPropagation(); // Keep the game card from navigating after a drag.
      dragState.current.moved = false; // Reset the movement flag after the drag click is cancelled.
    } // Finish checking whether the click followed a drag.
  } // Finish the click-capture handler.

  return ( // Return the complete draggable timeline interface.
    <section className="timeline-section"> {/* Group the timeline heading and canvas together. */}
      <div className="timeline-toolbar"> {/* Display timeline instructions and timeline controls. */}
        <div> {/* Group the timeline heading and description. */}
          <h2>Gaming Timeline</h2> {/* Name the interactive timeline. */}
          <p>Drag anywhere to move. Use the mouse wheel or zoom buttons to zoom in and out.</p> {/* Explain the drag and zoom interactions. */}
        </div> {/* Finish the timeline heading group. */}
        <div className="timeline-controls"> {/* Group the zoom and recenter controls. */}
          <button type="button" className="zoom-button" onClick={zoomOut} aria-label="Zoom out">−</button> {/* Let visitors zoom outward without a mouse wheel. */}
          <span className="zoom-label" aria-live="polite">{zoomLabel}</span> {/* Display the current zoom percentage. */}
          <button type="button" className="zoom-button" onClick={zoomIn} aria-label="Zoom in">+</button> {/* Let visitors zoom inward without a mouse wheel. */}
          <button type="button" className="recenter-button" onClick={recenterTimeline}>Recenter Timeline</button> {/* Let visitors return to the starting view. */}
        </div> {/* Finish the timeline controls. */}
      </div> {/* Finish the timeline toolbar. */}
      <div ref={viewportRef} className="timeline-viewport" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging} onClickCapture={handleClickCapture}> {/* Create the draggable and zoomable window into the larger canvas. */}
        <div className={"timeline-canvas-shell " + zoomClass}> {/* Resize the scrollable area to match the selected zoom level. */}
          <div className="timeline-canvas"> {/* Create the oversized two-dimensional timeline workspace. */}
            <div className="timeline-main-line"></div> {/* Draw the main horizontal timeline line. */}
            {platformLayouts.map(function (layout) { /* Build one positioned platform group for each platform. */
              const platformGames = getGamesForPlatform(games, layout.name); // Get only the games for the current platform.
              return <PlatformGroup key={layout.name} platform={layout.name} games={platformGames} className={layout.className} />; // Display the current platform group.
            })} {/* Finish building all platform groups. */}
          </div> {/* Finish the large timeline canvas. */}
        </div> {/* Finish the zoom-sized scrollable canvas shell. */}
      </div> {/* Finish the visible timeline viewport. */}
    </section> /* Finish the timeline section. */
  ); // Finish returning the timeline interface.
} // Finish the TimelineCanvas component.

export default TimelineCanvas; // Allow the Timeline page to use this component.
