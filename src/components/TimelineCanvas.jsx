import PlatformGroup from "./PlatformGroup.jsx"; // Import the reusable platform group component.
import useTimelineControls from "../hooks/useTimelineControls.js"; // Import the reusable timeline drag and zoom behavior.

// Keep the platform order and canvas positions in one place.
const platformLayouts = [ // Start the platform layout list.
  { name: "PS2", className: "platform-ps2", brandIcon: "PS" }, // Position PS2 and provide its temporary PlayStation icon label.
  { name: "PS3", className: "platform-ps3", brandIcon: "PS" }, // Position PS3 and provide its temporary PlayStation icon label.
  { name: "Xbox 360", className: "platform-xbox-360", brandIcon: "X" }, // Position Xbox 360 and provide its temporary Xbox icon label.
  { name: "Wii", className: "platform-wii", brandIcon: "W" }, // Position Wii and provide its temporary Wii icon label.
  { name: "Wii U", className: "platform-wii-u", brandIcon: "WU" }, // Position Wii U and provide its temporary Wii U icon label.
  { name: "Xbox One", className: "platform-xbox-one", brandIcon: "X" }, // Position Xbox One and provide its temporary Xbox icon label.
  { name: "Oculus Quest 2", className: "platform-quest-2", brandIcon: "VR" }, // Position Quest 2 and provide its temporary VR icon label.
  { name: "PC", className: "platform-pc", brandIcon: "PC" }, // Position PC and provide its temporary PC icon label.
]; // Finish the platform layout list.

// Return every game that belongs to one platform.
function getGamesForPlatform(games, platformName) { // Receive the full game list and one platform name.
  return games.filter(function (game) { // Filter the full list down to one platform.
    return game.platform === platformName; // Keep games that match the requested platform.
  }); // Finish filtering the games.
} // Finish the platform filtering helper.

// Display the large two-dimensional timeline workspace.
function TimelineCanvas({ games }) { // Receive all timeline games from the page.
  const controls = useTimelineControls(); // Create the reusable drag, zoom, recenter, and keyboard controls.

  return ( // Return the complete draggable timeline interface.
    <section className="timeline-section"> {/* Group the timeline heading and canvas together. */}
      <div className="timeline-toolbar"> {/* Display timeline instructions and timeline controls. */}
        <div> {/* Group the timeline heading and description. */}
          <h2>Gaming Timeline</h2> {/* Name the interactive timeline. */}
          <p>Drag anywhere to move. Use the mouse wheel or zoom buttons to zoom in and out.</p> {/* Explain the drag and zoom interactions. */}
        </div> {/* Finish the timeline heading group. */}
        <div className="timeline-controls"> {/* Group the zoom and recenter controls. */}
          <button type="button" className="zoom-button" onClick={controls.zoomOut} aria-label="Zoom out">−</button> {/* Let visitors zoom outward without a mouse wheel. */}
          <span className="zoom-label" aria-live="polite">{controls.zoomLabel}</span> {/* Display the current zoom percentage. */}
          <button type="button" className="zoom-button" onClick={controls.zoomIn} aria-label="Zoom in">+</button> {/* Let visitors zoom inward without a mouse wheel. */}
          <button type="button" className="recenter-button" onClick={controls.recenterTimeline}>Recenter Timeline</button> {/* Let visitors return to the same logical timeline area at any zoom. */}
        </div> {/* Finish the timeline controls. */}
      </div> {/* Finish the timeline toolbar. */}
      <div ref={controls.viewportRef} className="timeline-viewport" onPointerDown={controls.handlePointerDown} onPointerMove={controls.handlePointerMove} onPointerUp={controls.handlePointerUp} onPointerCancel={controls.handlePointerCancel} onClickCapture={controls.handleClickCapture}> {/* Create the draggable and zoomable window into the larger canvas. */}
        <div className={"timeline-canvas-shell " + controls.zoomClass}> {/* Resize the scrollable area to match the selected zoom level. */}
          <div className="timeline-canvas"> {/* Create the oversized two-dimensional timeline workspace. */}
            <div className="timeline-main-line"></div> {/* Draw the main horizontal timeline line. */}
            {platformLayouts.map(function (layout) { /* Build one positioned platform group for each platform. */
              const platformGames = getGamesForPlatform(games, layout.name); // Get only the games for the current platform.
              return <PlatformGroup key={layout.name} platform={layout.name} brandIcon={layout.brandIcon} games={platformGames} className={layout.className} />; // Display the current platform group with its temporary brand icon.
            })} {/* Finish building all platform groups. */}
          </div> {/* Finish the large timeline canvas. */}
        </div> {/* Finish the zoom-sized scrollable canvas shell. */}
      </div> {/* Finish the visible timeline viewport. */}
    </section> /* Finish the timeline section. */
  ); // Finish returning the timeline interface.
} // Finish the TimelineCanvas component.

export default TimelineCanvas; // Allow the Timeline page to use this component.
