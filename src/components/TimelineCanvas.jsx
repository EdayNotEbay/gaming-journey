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
  "timeline-zoom-50", // Allow visitors to zoom far enough out to see most of the full timeline.
  "timeline-zoom-70", // Allow visitors to zoom farther out.
  "timeline-zoom-85", // Allow visitors to zoom slightly out.
  "timeline-zoom-100", // Keep the normal timeline size.
  "timeline-zoom-115", // Allow visitors to zoom slightly in.
  "timeline-zoom-130", // Allow visitors to zoom farther in.
]; // Finish the zoom class list.

// Keep the numeric zoom values in one place for pointer-centered zoom calculations.
const zoomScales = [ // Start the zoom scale list.
  0.5, // Scale the timeline to fifty percent.
  0.7, // Scale the timeline to seventy percent.
  0.85, // Scale the timeline to eighty-five percent.
  1, // Keep the timeline at one hundred percent.
  1.15, // Scale the timeline to one hundred fifteen percent.
  1.3, // Scale the timeline to one hundred thirty percent.
]; // Finish the zoom scale list.

// Keep readable zoom labels beside the controls.
const zoomLabels = [ // Start the zoom label list.
  "50%", // Label the far zoomed-out view.
  "70%", // Label the seventy percent view.
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
  const pendingZoomRef = useRef(null); // Store the canvas point that must remain under the mouse after zooming.
  const zoomIndexRef = useRef(3); // Keep the current zoom index available immediately inside wheel events.
  const [zoomIndex, setZoomIndex] = useState(3); // Start the timeline at the normal 100 percent zoom level.
  const zoomClass = zoomClasses[zoomIndex]; // Read the CSS class for the current zoom level.
  const zoomLabel = zoomLabels[zoomIndex]; // Read the text label for the current zoom level.

  // Place the view near the beginning of the timeline when the page first loads.
  useEffect(function () { // Run once after the timeline viewport is available.
    if (viewportRef.current !== null) { // Make sure the viewport exists before setting its starting position.
      viewportRef.current.scrollLeft = 280; // Start far enough right to center the early platform groups.
      viewportRef.current.scrollTop = 620; // Start vertically around the main timeline line.
    } // Finish checking the viewport reference.
  }, []); // Keep the setup effect from repeating.

  // Use native browser listeners so the wheel and Space key cannot trigger normal scrolling or button activation.
  useEffect(function () { // Attach browser-level interaction controls while the timeline page is mounted.
    const viewport = viewportRef.current; // Store the timeline viewport for the native wheel listener.
    if (viewport === null) { // Make sure the viewport exists before attaching listeners.
      return undefined; // Stop setup when the viewport is unavailable.
    } // Finish checking the viewport reference.

    // Zoom around the exact mouse position and fully consume the wheel event.
    function handleNativeWheel(event) { // Receive the browser wheel event directly.
      event.preventDefault(); // Stop native vertical or horizontal scrolling inside the timeline.
      let nextIndex = zoomIndexRef.current; // Start with the currently active zoom level.
      if (event.deltaY < 0) { // Check whether the wheel moved upward.
        nextIndex = nextIndex + 1; // Move one level closer to the canvas.
      } // Finish checking upward wheel movement.
      if (event.deltaY > 0) { // Check whether the wheel moved downward.
        nextIndex = nextIndex - 1; // Move one level farther from the canvas.
      } // Finish checking downward wheel movement.
      if (event.deltaY === 0) { // Check whether the wheel event contains no vertical zoom movement.
        return; // Stop when there is no zoom direction.
      } // Finish checking for zero wheel movement.
      if (nextIndex < 0) { // Check whether the requested zoom is below fifty percent.
        return; // Keep the current zoom and keep native scrolling disabled.
      } // Finish checking the minimum zoom.
      if (nextIndex >= zoomClasses.length) { // Check whether the requested zoom is above one hundred thirty percent.
        return; // Keep the current zoom and keep native scrolling disabled.
      } // Finish checking the maximum zoom.
      const bounds = viewport.getBoundingClientRect(); // Read the visible viewport position on the screen.
      const viewportX = event.clientX - bounds.left; // Find the mouse's horizontal position inside the viewport.
      const viewportY = event.clientY - bounds.top; // Find the mouse's vertical position inside the viewport.
      const currentScale = zoomScales[zoomIndexRef.current]; // Read the scale before changing zoom.
      const canvasX = (viewport.scrollLeft + viewportX) / currentScale; // Find the unscaled canvas X coordinate under the mouse.
      const canvasY = (viewport.scrollTop + viewportY) / currentScale; // Find the unscaled canvas Y coordinate under the mouse.
      pendingZoomRef.current = { canvasX: canvasX, canvasY: canvasY, viewportX: viewportX, viewportY: viewportY }; // Save the point that should stay under the mouse.
      zoomIndexRef.current = nextIndex; // Update the immediate zoom reference for the next wheel event.
      setZoomIndex(nextIndex); // Apply the new zoom level through React.
    } // Finish the native wheel handler.

    // Block Space so it cannot scroll the page, scroll the canvas, or activate a focused button.
    function blockSpacebar(event) { // Receive keyboard events before focused controls handle them.
      if (event.code !== "Space") { // Check whether the pressed key is something other than Space.
        return; // Leave every non-Space key alone.
      } // Finish checking the pressed key.
      event.preventDefault(); // Stop the browser's normal Space-key action.
      event.stopPropagation(); // Stop Space from reaching game cards or other timeline controls.
      const activeElement = document.activeElement; // Read the element that currently has keyboard focus.
      if (activeElement !== null && activeElement.classList.contains("game-card")) { // Check whether a game card currently has focus.
        activeElement.blur(); // Remove game-card focus so no keyboard focus border remains after Space.
      } // Finish checking the focused element.
    } // Finish the Space-key blocker.

    viewport.addEventListener("wheel", handleNativeWheel, { passive: false }); // Attach a non-passive wheel listener so preventDefault always works.
    window.addEventListener("keydown", blockSpacebar, true); // Block Space before a focused control receives keydown.
    window.addEventListener("keyup", blockSpacebar, true); // Block Space before a focused control receives keyup.

    return function () { // Remove the browser listeners when the timeline page unmounts.
      viewport.removeEventListener("wheel", handleNativeWheel); // Remove the native wheel listener.
      window.removeEventListener("keydown", blockSpacebar, true); // Remove the Space keydown blocker.
      window.removeEventListener("keyup", blockSpacebar, true); // Remove the Space keyup blocker.
    }; // Finish the cleanup function.
  }, []); // Attach these native listeners only once.

  // Restore the point under the mouse after React applies a new zoom level.
  useEffect(function () { // Run whenever the zoom level changes.
    if (pendingZoomRef.current === null) { // Check whether this zoom change needs pointer-centered repositioning.
      return; // Stop when there is no saved zoom focus point.
    } // Finish checking the saved zoom focus point.
    if (viewportRef.current === null) { // Make sure the timeline viewport still exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport reference.
    const viewport = viewportRef.current; // Store the viewport for the zoom positioning calculations.
    const savedPoint = pendingZoomRef.current; // Read the saved canvas and viewport coordinates.
    const newScale = zoomScales[zoomIndex]; // Read the numeric scale for the new zoom level.
    const targetScrollLeft = savedPoint.canvasX * newScale - savedPoint.viewportX; // Calculate the horizontal position that keeps the mouse over the same canvas point.
    const targetScrollTop = savedPoint.canvasY * newScale - savedPoint.viewportY; // Calculate the vertical position that keeps the mouse over the same canvas point.
    const maximumScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth); // Calculate the farthest legal horizontal scroll position.
    const maximumScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight); // Calculate the farthest legal vertical scroll position.
    viewport.scrollLeft = Math.min(maximumScrollLeft, Math.max(0, targetScrollLeft)); // Clamp horizontal zoom scrolling inside the canvas bounds.
    viewport.scrollTop = Math.min(maximumScrollTop, Math.max(0, targetScrollTop)); // Clamp vertical zoom scrolling inside the canvas bounds.
    pendingZoomRef.current = null; // Clear the saved zoom focus after repositioning.
  }, [zoomIndex]); // Repeat this adjustment only when the zoom level changes.

  // Return the viewport to the preferred starting area.
  function recenterTimeline() { // Recenter the two-dimensional timeline.
    if (viewportRef.current === null) { // Make sure the viewport exists before using it.
      return; // Stop when the viewport is not ready yet.
    } // Finish checking the viewport reference.
    viewportRef.current.scrollLeft = 280; // Return to the early platform groups.
    viewportRef.current.scrollTop = 620; // Return to the main timeline area.
  } // Finish the recenter helper.

  // Save the canvas location under a specific point before changing zoom.
  function saveZoomFocus(clientX, clientY) { // Receive the viewport-center position used by zoom buttons.
    if (viewportRef.current === null) { // Make sure the timeline viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport reference.
    const viewport = viewportRef.current; // Store the viewport element for shorter calculations.
    const bounds = viewport.getBoundingClientRect(); // Read the viewport position on the screen.
    const viewportX = clientX - bounds.left; // Find the focus point's horizontal position inside the viewport.
    const viewportY = clientY - bounds.top; // Find the focus point's vertical position inside the viewport.
    const currentScale = zoomScales[zoomIndexRef.current]; // Read the numeric scale before the zoom changes.
    const canvasX = (viewport.scrollLeft + viewportX) / currentScale; // Find the unscaled canvas X coordinate under the focus point.
    const canvasY = (viewport.scrollTop + viewportY) / currentScale; // Find the unscaled canvas Y coordinate under the focus point.
    pendingZoomRef.current = { canvasX: canvasX, canvasY: canvasY, viewportX: viewportX, viewportY: viewportY }; // Save the point that should stay visually fixed.
  } // Finish saving the zoom focus.

  // Change to a specific zoom index while keeping a chosen screen point stable.
  function changeZoom(nextIndex, clientX, clientY) { // Receive the requested zoom level and focus point.
    if (nextIndex < 0) { // Check whether the requested zoom is below the minimum.
      return; // Stop before going below fifty percent.
    } // Finish checking the minimum zoom.
    if (nextIndex >= zoomClasses.length) { // Check whether the requested zoom is above the maximum.
      return; // Stop before going above one hundred thirty percent.
    } // Finish checking the maximum zoom.
    if (nextIndex === zoomIndexRef.current) { // Check whether the requested zoom is already active.
      return; // Stop when no zoom change is needed.
    } // Finish checking the current zoom.
    saveZoomFocus(clientX, clientY); // Save the canvas point that should remain visually fixed.
    zoomIndexRef.current = nextIndex; // Update the immediate zoom reference.
    setZoomIndex(nextIndex); // Ask React to apply the new zoom class and label.
  } // Finish the zoom-change helper.

  // Return the center of the visible viewport for zoom-button actions.
  function getViewportCenter() { // Calculate the visible center of the timeline viewport.
    if (viewportRef.current === null) { // Make sure the timeline viewport exists.
      return null; // Return no point when the viewport is unavailable.
    } // Finish checking the viewport reference.
    const bounds = viewportRef.current.getBoundingClientRect(); // Read the viewport position and size.
    const centerX = bounds.left + bounds.width / 2; // Find the horizontal center of the viewport.
    const centerY = bounds.top + bounds.height / 2; // Find the vertical center of the viewport.
    return { x: centerX, y: centerY }; // Return the center point for button-controlled zooming.
  } // Finish calculating the viewport center.

  // Increase the timeline zoom by one preset level.
  function zoomIn() { // Zoom the timeline inward around the viewport center.
    const center = getViewportCenter(); // Find the center point used by the zoom button.
    if (center === null) { // Make sure a center point was available.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the center point.
    changeZoom(zoomIndexRef.current + 1, center.x, center.y); // Move to the next larger zoom while keeping the center stable.
  } // Finish the zoom-in helper.

  // Decrease the timeline zoom by one preset level.
  function zoomOut() { // Zoom the timeline outward around the viewport center.
    const center = getViewportCenter(); // Find the center point used by the zoom button.
    if (center === null) { // Make sure a center point was available.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the center point.
    changeZoom(zoomIndexRef.current - 1, center.x, center.y); // Move to the next smaller zoom while keeping the center stable.
  } // Finish the zoom-out helper.

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
      <div ref={viewportRef} className="timeline-viewport" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging} onClickCapture={handleClickCapture}> {/* Create the draggable and zoomable window into the larger canvas. */}
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
