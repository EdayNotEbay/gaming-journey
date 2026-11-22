import { useCallback, useEffect, useRef, useState } from "react"; // Import React tools used by the timeline interaction hook.

// Keep every zoom setting together so class names, scales, and labels cannot get out of sync.
const zoomLevels = [ // Start the complete zoom configuration.
  { className: "timeline-zoom-30", scale: 0.3, label: "30%" }, // Store the thirty percent zoom level.
  { className: "timeline-zoom-50", scale: 0.5, label: "50%" }, // Store the fifty percent zoom level.
  { className: "timeline-zoom-70", scale: 0.7, label: "70%" }, // Store the seventy percent zoom level.
  { className: "timeline-zoom-85", scale: 0.85, label: "85%" }, // Store the eighty-five percent zoom level.
  { className: "timeline-zoom-100", scale: 1, label: "100%" }, // Store the normal zoom level.
  { className: "timeline-zoom-115", scale: 1.15, label: "115%" }, // Store the one hundred fifteen percent zoom level.
  { className: "timeline-zoom-130", scale: 1.3, label: "130%" }, // Store the one hundred thirty percent zoom level.
]; // Finish the complete zoom configuration.

const defaultZoomIndex = 4; // Start the timeline at one hundred percent zoom.
const dragThreshold = 6; // Require a small amount of movement before treating a press as a drag.
const recenterCanvasX = 980; // Keep the same logical horizontal canvas point centered at every zoom level.
const recenterCanvasY = 1440; // Center the viewport around the shifted main timeline after adding more top workspace.

// Keep one numeric value inside a minimum and maximum range.
function clamp(value, minimum, maximum) { // Receive the value and its legal range.
  return Math.min(maximum, Math.max(minimum, value)); // Return the value limited to the legal range.
} // Finish the clamp helper.

// Move the viewport while keeping its scroll position inside the current canvas bounds.
function setViewportScroll(viewport, left, top) { // Receive the viewport and requested scroll position.
  const maximumLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth); // Calculate the farthest legal horizontal scroll position.
  const maximumTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight); // Calculate the farthest legal vertical scroll position.
  viewport.scrollLeft = clamp(left, 0, maximumLeft); // Apply a legal horizontal scroll position.
  viewport.scrollTop = clamp(top, 0, maximumTop); // Apply a legal vertical scroll position.
} // Finish the viewport scroll helper.

// Center the same logical timeline area regardless of the current zoom level.
function centerViewport(viewport, scale) { // Receive the timeline viewport and current numeric scale.
  const targetLeft = recenterCanvasX * scale - viewport.clientWidth / 2; // Calculate the horizontal scroll needed to center the logical canvas point.
  const targetTop = recenterCanvasY * scale - viewport.clientHeight / 2; // Calculate the vertical scroll needed to center the logical canvas point.
  setViewportScroll(viewport, targetLeft, targetTop); // Move the viewport to the scale-aware centered position.
} // Finish the viewport centering helper.

// Keep all timeline movement and zoom behavior separate from timeline rendering.
function useTimelineControls() { // Create the reusable timeline interaction hook.
  const viewportRef = useRef(null); // Keep a reference to the scrollable timeline viewport.
  const dragState = useRef({ active: false, moved: false, captured: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 }); // Store drag values without rerendering the timeline.
  const pendingZoomRef = useRef(null); // Store the canvas point that should stay fixed while zoom changes.
  const zoomIndexRef = useRef(defaultZoomIndex); // Keep the current zoom available immediately inside browser event listeners.
  const [zoomIndex, setZoomIndex] = useState(defaultZoomIndex); // Store the current zoom so React updates the displayed timeline.
  const zoomLevel = zoomLevels[zoomIndex]; // Read the current class name, numeric scale, and label from one source.

  // Start the timeline centered on the same logical area used by the recenter button.
  useEffect(function () { // Run once after the timeline viewport is available.
    const viewport = viewportRef.current; // Read the current viewport element.
    if (viewport === null) { // Check whether the viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport.
    centerViewport(viewport, zoomLevels[defaultZoomIndex].scale); // Center the starting view using the normal zoom scale.
  }, []); // Keep the initial centering effect from repeating.

  // Restore the same canvas point under the mouse after React applies a new zoom level.
  useEffect(function () { // Run whenever React finishes changing the zoom scale.
    const viewport = viewportRef.current; // Read the current viewport element.
    const savedPoint = pendingZoomRef.current; // Read the point saved immediately before the zoom changed.
    if (viewport === null) { // Check whether the viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport.
    if (savedPoint === null) { // Check whether this zoom change has a saved focus point.
      return; // Stop when no zoom repositioning is needed.
    } // Finish checking the saved point.
    const targetLeft = savedPoint.canvasX * zoomLevel.scale - savedPoint.viewportX; // Calculate the horizontal scroll that keeps the same canvas point under the mouse.
    const targetTop = savedPoint.canvasY * zoomLevel.scale - savedPoint.viewportY; // Calculate the vertical scroll that keeps the same canvas point under the mouse.
    setViewportScroll(viewport, targetLeft, targetTop); // Apply the new clamped scroll position after zooming.
    pendingZoomRef.current = null; // Clear the saved zoom point after it has been restored.
  }, [zoomLevel.scale]); // Repeat only when the active numeric zoom scale changes.

  // Change zoom while preserving one chosen screen point.
  const changeZoom = useCallback(function changeZoomAtPoint(nextIndex, clientX, clientY) { // Receive the requested zoom index and focus point.
    if (nextIndex < 0) { // Check whether the requested zoom is below thirty percent.
      return; // Keep the current zoom when the minimum has been reached.
    } // Finish checking the minimum zoom.
    if (nextIndex >= zoomLevels.length) { // Check whether the requested zoom is above one hundred thirty percent.
      return; // Keep the current zoom when the maximum has been reached.
    } // Finish checking the maximum zoom.
    if (nextIndex === zoomIndexRef.current) { // Check whether the requested zoom is already active.
      return; // Stop when no zoom change is needed.
    } // Finish checking the current zoom.
    const viewport = viewportRef.current; // Read the current timeline viewport.
    if (viewport === null) { // Check whether the viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport.
    const bounds = viewport.getBoundingClientRect(); // Read the viewport position and dimensions on the screen.
    const viewportX = clientX - bounds.left; // Convert the screen X coordinate into a viewport X coordinate.
    const viewportY = clientY - bounds.top; // Convert the screen Y coordinate into a viewport Y coordinate.
    const currentScale = zoomLevels[zoomIndexRef.current].scale; // Read the numeric scale before changing zoom.
    const canvasX = (viewport.scrollLeft + viewportX) / currentScale; // Find the unscaled canvas X coordinate under the focus point.
    const canvasY = (viewport.scrollTop + viewportY) / currentScale; // Find the unscaled canvas Y coordinate under the focus point.
    pendingZoomRef.current = { canvasX: canvasX, canvasY: canvasY, viewportX: viewportX, viewportY: viewportY }; // Save the canvas and viewport coordinates for the next render.
    zoomIndexRef.current = nextIndex; // Update the immediate zoom reference for browser events.
    setZoomIndex(nextIndex); // Ask React to render the new zoom level.
  }, []); // Keep the zoom-change function stable for the native wheel listener.

  // Return the visible center of the timeline for zoom-button actions.
  function getViewportCenter() { // Calculate the center of the visible timeline viewport.
    const viewport = viewportRef.current; // Read the current timeline viewport.
    if (viewport === null) { // Check whether the viewport exists.
      return null; // Return no position when the viewport is unavailable.
    } // Finish checking the viewport.
    const bounds = viewport.getBoundingClientRect(); // Read the viewport position and size.
    const x = bounds.left + bounds.width / 2; // Calculate the horizontal screen center.
    const y = bounds.top + bounds.height / 2; // Calculate the vertical screen center.
    return { x: x, y: y }; // Return the visible center point.
  } // Finish the viewport center helper.

  // Increase zoom around the center of the visible timeline.
  function zoomIn() { // Handle the zoom-in button.
    const center = getViewportCenter(); // Find the visible center of the timeline.
    if (center === null) { // Check whether a center point was available.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the center point.
    changeZoom(zoomIndexRef.current + 1, center.x, center.y); // Move to the next larger zoom level around the viewport center.
  } // Finish the zoom-in helper.

  // Decrease zoom around the center of the visible timeline.
  function zoomOut() { // Handle the zoom-out button.
    const center = getViewportCenter(); // Find the visible center of the timeline.
    if (center === null) { // Check whether a center point was available.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the center point.
    changeZoom(zoomIndexRef.current - 1, center.x, center.y); // Move to the next smaller zoom level around the viewport center.
  } // Finish the zoom-out helper.

  // Return to the same logical canvas area at every zoom level.
  function recenterTimeline() { // Handle the timeline recenter button.
    const viewport = viewportRef.current; // Read the current timeline viewport.
    if (viewport === null) { // Check whether the viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport.
    centerViewport(viewport, zoomLevels[zoomIndexRef.current].scale); // Center the logical timeline area using the active zoom scale.
  } // Finish the recenter helper.

  // Start tracking a possible drag without capturing normal game-card clicks.
  function handlePointerDown(event) { // Receive a pointer press from anywhere inside the timeline.
    if (event.button !== 0) { // Check whether the user pressed something other than the primary mouse button.
      return; // Ignore non-primary mouse buttons.
    } // Finish checking the mouse button.
    const viewport = viewportRef.current; // Read the current timeline viewport.
    if (viewport === null) { // Check whether the viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport.
    dragState.current.active = true; // Mark the pointer press as a possible drag.
    dragState.current.moved = false; // Reset the drag movement flag.
    dragState.current.captured = false; // Wait to capture the pointer until movement becomes a real drag.
    dragState.current.startX = event.clientX; // Save the starting horizontal pointer coordinate.
    dragState.current.startY = event.clientY; // Save the starting vertical pointer coordinate.
    dragState.current.scrollLeft = viewport.scrollLeft; // Save the starting horizontal scroll position.
    dragState.current.scrollTop = viewport.scrollTop; // Save the starting vertical scroll position.
  } // Finish the pointer-down handler.

  // Pan the canvas after pointer movement passes the drag threshold.
  function handlePointerMove(event) { // Receive pointer movement inside the timeline.
    const viewport = viewportRef.current; // Read the current timeline viewport.
    if (viewport === null) { // Check whether the viewport exists.
      return; // Stop when the viewport is unavailable.
    } // Finish checking the viewport.
    if (dragState.current.active === false) { // Check whether a pointer press is active.
      return; // Ignore movement without an active pointer press.
    } // Finish checking the active pointer state.
    const movedX = event.clientX - dragState.current.startX; // Measure horizontal movement from the press point.
    const movedY = event.clientY - dragState.current.startY; // Measure vertical movement from the press point.
    const horizontalDistance = Math.abs(movedX); // Convert horizontal movement into a positive distance.
    const verticalDistance = Math.abs(movedY); // Convert vertical movement into a positive distance.
    if (horizontalDistance > dragThreshold || verticalDistance > dragThreshold) { // Check whether movement is large enough to count as a drag.
      dragState.current.moved = true; // Remember that this pointer press became a drag.
    } // Finish checking the drag threshold.
    if (dragState.current.moved === false) { // Check whether the pointer is still behaving like a normal click.
      return; // Keep normal clicks from moving the timeline.
    } // Finish checking the drag state.
    if (dragState.current.captured === false) { // Check whether pointer capture still needs to begin.
      viewport.setPointerCapture(event.pointerId); // Keep receiving pointer movement after a real drag starts.
      dragState.current.captured = true; // Remember that pointer capture is active.
    } // Finish checking pointer capture.
    viewport.classList.add("timeline-viewport-dragging"); // Show the closed-hand cursor while the canvas is moving.
    setViewportScroll(viewport, dragState.current.scrollLeft - movedX, dragState.current.scrollTop - movedY); // Pan the timeline while keeping scrolling inside canvas bounds.
  } // Finish the pointer-move handler.

  // End a pointer interaction while preserving drag information long enough to suppress the following click.
  function handlePointerUp() { // Handle a normal pointer release.
    dragState.current.active = false; // Mark the pointer interaction as finished.
    dragState.current.captured = false; // Reset pointer capture state for the next interaction.
    if (viewportRef.current !== null) { // Check whether the viewport still exists.
      viewportRef.current.classList.remove("timeline-viewport-dragging"); // Restore the normal grab cursor.
    } // Finish checking the viewport.
    window.setTimeout(function () { // Clear stale drag state after the browser has had a chance to fire its click event.
      dragState.current.moved = false; // Prevent a cancelled or unusual drag from blocking a later click.
    }, 0); // Run immediately after the current browser event sequence finishes.
  } // Finish the pointer-up handler.

  // Cancel a pointer interaction without allowing stale drag state to affect a later click.
  function handlePointerCancel() { // Handle a browser-cancelled pointer interaction.
    dragState.current.active = false; // Mark the pointer interaction as finished.
    dragState.current.moved = false; // Clear drag movement immediately because no click should follow a cancelled pointer.
    dragState.current.captured = false; // Reset pointer capture state for the next interaction.
    if (viewportRef.current !== null) { // Check whether the viewport still exists.
      viewportRef.current.classList.remove("timeline-viewport-dragging"); // Restore the normal grab cursor.
    } // Finish checking the viewport.
  } // Finish the pointer-cancel handler.

  // Suppress card navigation only when the same pointer interaction actually dragged the canvas.
  function handleClickCapture(event) { // Receive clicks before child game cards handle them.
    if (dragState.current.moved === false) { // Check whether the pointer interaction stayed a normal click.
      return; // Allow normal game-card clicks to continue.
    } // Finish checking whether a drag occurred.
    event.preventDefault(); // Cancel the normal click action after a drag.
    event.stopPropagation(); // Keep the dragged game card from navigating.
    dragState.current.moved = false; // Reset the drag flag after suppressing the drag-generated click.
  } // Finish the click-capture handler.

  // Attach native listeners for wheel zoom and Space-key blocking while the timeline is mounted.
  useEffect(function () { // Set up timeline-specific browser listeners.
    const viewport = viewportRef.current; // Read the current timeline viewport.
    if (viewport === null) { // Check whether the viewport exists.
      return undefined; // Stop setup when the viewport is unavailable.
    } // Finish checking the viewport.

    // Consume wheel movement and convert it into pointer-centered zoom.
    function handleWheel(event) { // Receive a native wheel event from the timeline.
      event.preventDefault(); // Stop native scrolling while the pointer is over the timeline.
      if (event.deltaY < 0) { // Check whether the wheel moved upward.
        changeZoom(zoomIndexRef.current + 1, event.clientX, event.clientY); // Zoom inward around the exact mouse position.
        return; // Stop after processing the upward wheel movement.
      } // Finish checking upward wheel movement.
      if (event.deltaY > 0) { // Check whether the wheel moved downward.
        changeZoom(zoomIndexRef.current - 1, event.clientX, event.clientY); // Zoom outward around the exact mouse position.
      } // Finish checking downward wheel movement.
    } // Finish the native wheel handler.

    // Keep Space from scrolling or activating controls while the Timeline page is mounted.
    function blockSpacebar(event) { // Receive keyboard events before focused controls handle them.
      if (event.code !== "Space") { // Check whether the pressed key is something other than Space.
        return; // Leave every non-Space key unchanged.
      } // Finish checking the key.
      event.preventDefault(); // Stop the browser's default Space-key action.
      event.stopPropagation(); // Stop Space from reaching a focused timeline control.
      const activeElement = document.activeElement; // Read the element that currently owns keyboard focus.
      if (activeElement !== null && activeElement.classList.contains("game-card")) { // Check whether a game card currently has focus.
        activeElement.blur(); // Remove focus from the game card so no focus border remains.
      } // Finish checking the focused element.
    } // Finish the Space-key blocker.

    viewport.addEventListener("wheel", handleWheel, { passive: false }); // Attach a non-passive wheel listener so native scrolling can be prevented.
    window.addEventListener("keydown", blockSpacebar, true); // Block Space keydown while this timeline hook is mounted.
    window.addEventListener("keyup", blockSpacebar, true); // Block Space keyup while this timeline hook is mounted.

    return function () { // Remove native listeners when the timeline component unmounts.
      viewport.removeEventListener("wheel", handleWheel); // Remove the timeline wheel listener.
      window.removeEventListener("keydown", blockSpacebar, true); // Remove the Timeline page Space keydown listener.
      window.removeEventListener("keyup", blockSpacebar, true); // Remove the Timeline page Space keyup listener.
    }; // Finish the listener cleanup function.
  }, [changeZoom]); // Reuse the stable zoom function while keeping the browser listener setup correct.

  return { // Return the small public interface needed by the timeline component.
    viewportRef: viewportRef, // Give TimelineCanvas access to the scrollable viewport reference.
    zoomClass: zoomLevel.className, // Give TimelineCanvas the CSS class for the active zoom level.
    zoomLabel: zoomLevel.label, // Give TimelineCanvas the visible label for the active zoom level.
    zoomIn: zoomIn, // Give TimelineCanvas the zoom-in button action.
    zoomOut: zoomOut, // Give TimelineCanvas the zoom-out button action.
    recenterTimeline: recenterTimeline, // Give TimelineCanvas the scale-aware recenter action.
    handlePointerDown: handlePointerDown, // Give TimelineCanvas the pointer-down drag handler.
    handlePointerMove: handlePointerMove, // Give TimelineCanvas the pointer-move drag handler.
    handlePointerUp: handlePointerUp, // Give TimelineCanvas the pointer-up drag handler.
    handlePointerCancel: handlePointerCancel, // Give TimelineCanvas the pointer-cancel drag handler.
    handleClickCapture: handleClickCapture, // Give TimelineCanvas the drag-generated click blocker.
  }; // Finish returning the timeline interaction interface.
} // Finish the timeline interaction hook.

export default useTimelineControls; // Allow TimelineCanvas to reuse the interaction behavior.
