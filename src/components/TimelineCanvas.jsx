import PlatformGroup from "./PlatformGroup.jsx"; // Import the reusable platform group component.
import useTimelineControls from "../hooks/useTimelineControls.js"; // Import the reusable timeline drag and zoom behavior.

// Keep the platform order and canvas positions in one place.
const platformLayouts = [ // Start the platform layout list.
  { name: "PS2", className: "platform-ps2", brandIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/3840px-Playstation_logo_colour.svg.png" }, // Position PS2 and use the PlayStation brand icon.
  { name: "PS3", className: "platform-ps3", brandIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/3840px-Playstation_logo_colour.svg.png" }, // Position PS3 and use the PlayStation brand icon.
  { name: "Xbox 360", className: "platform-xbox-360", brandIcon: "https://cdn.icon-icons.com/icons2/2699/PNG/512/xbox_logo_icon_169692.png" }, // Position Xbox 360 and use the Xbox brand icon.
  { name: "Wii", className: "platform-wii", brandIcon: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wii_logo.png" }, // Position Wii and use the Wii brand logo.
  { name: "Wii U", className: "platform-wii-u", brandIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/WiiU.svg/3840px-WiiU.svg.png" }, // Position Wii U and use the Wii U brand logo.
  { name: "Xbox One", className: "platform-xbox-one", brandIcon: "https://cdn.icon-icons.com/icons2/2699/PNG/512/xbox_logo_icon_169692.png" }, // Position Xbox One and use the Xbox brand icon.
  { name: "Oculus Quest 2", className: "platform-quest-2", brandIcon: "https://images.rawpixel.com/image_png_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjEwOTEtMDUucG5n.png" }, // Position Quest 2 and use the Meta brand icon.
  { name: "PC", className: "platform-pc", brandIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Windows_logo_-_2012.svg/2048px-Windows_logo_-_2012.svg.png" }, // Position PC and use the Windows brand icon.
]; // Finish the platform layout list.

// Return every game that belongs to one platform.
function getGamesForPlatform(games, platformName) { // Receive the full game list and one platform name.
  return games.filter(function (game) { // Filter the full list down to one platform.
    return game.platform === platformName; // Keep games that match the requested platform.
  }); // Finish filtering the games.
} // Finish the platform filtering helper.

// Read the four-digit year from one saved timeline date.
function getTimelineYear(timelineDate) { // Receive one saved timeline date string.
  if (typeof timelineDate !== "string") { // Check whether the timeline date is usable text.
    return ""; // Return no year when the value is missing or invalid.
  } // Finish checking the timeline date type.
  const yearMatch = timelineDate.match(/\b(19|20)\d{2}\b/); // Find a normal four-digit year inside dates such as October 30, 2012.
  if (yearMatch === null) { // Check whether the timeline date contains a year.
    return ""; // Return no year when the saved text does not contain one.
  } // Finish checking for a year match.
  return yearMatch[0]; // Return the four-digit timeline year.
} // Finish the timeline-year helper.

// Build the chronological list of years represented by saved timeline dates.
function getTimelineYears(games) { // Receive the complete game list.
  const years = []; // Start an empty unique year list.
  games.forEach(function (game) { // Inspect every game in the timeline.
    const year = getTimelineYear(game.timelineDate); // Read the year from the current game's saved timeline date.
    if (year !== "" && years.includes(year) === false) { // Check whether a usable year was found and has not already been added.
      years.push(year); // Add the unique timeline year.
    } // Finish checking the current timeline year.
  }); // Finish inspecting the game list.
  years.sort(function (firstYear, secondYear) { // Put the represented years into chronological order.
    return Number(firstYear) - Number(secondYear); // Sort earlier years before later years.
  }); // Finish sorting the represented years.
  return years; // Return the complete chronological year list.
} // Finish the timeline-year-list helper.

// Calculate the timeline summary numbers from the current game data.
function getTimelineStats(games) { // Receive the complete game list.
  const platforms = new Set(); // Store unique platform names.
  const genres = new Set(); // Store unique genre names.
  let favoriteCount = 0; // Start the favorite-game count at zero.

  games.forEach(function (game) { // Inspect every game in the timeline.
    platforms.add(game.platform); // Add the current platform to the unique platform set.
    game.genres.forEach(function (genreName) { // Inspect every genre assigned to the current game.
      genres.add(genreName); // Add the current genre to the unique genre set.
    }); // Finish inspecting the current game's genres.
    if (game.isFavorite === true) { // Check whether the current game is a favorite.
      favoriteCount = favoriteCount + 1; // Increase the favorite count for confirmed favorite games.
    } // Finish checking the favorite state.
  }); // Finish inspecting the game list.

  return { // Return all timeline summary values together.
    platformCount: platforms.size, // Return the number of unique platforms.
    gameCount: games.length, // Return the total number of game entries.
    favoriteCount: favoriteCount, // Return the number of favorite games.
    genreCount: genres.size, // Return the number of unique genres.
  }; // Finish returning the timeline statistics.
} // Finish the timeline statistics helper.

// Display the large two-dimensional timeline workspace.
function TimelineCanvas({ games }) { // Receive all timeline games from the page.
  const controls = useTimelineControls(); // Create the reusable drag, zoom, recenter, and keyboard controls.
  const stats = getTimelineStats(games); // Calculate the current timeline statistics from the game data.
  const timelineYears = getTimelineYears(games); // Build the chronological year guide from saved timeline dates.

  return ( // Return the complete draggable timeline interface.
    <section className="timeline-section"> {/* Group the timeline heading, canvas, and summary together. */}
      <div className="timeline-toolbar"> {/* Display the richer timeline heading and interaction controls. */}
        <div className="timeline-toolbar-main"> {/* Keep the timeline identity and interaction guide together. */}
          <div className="timeline-heading"> {/* Group the timeline icon, title, and description. */}
            <span className="timeline-heading-icon" aria-hidden="true">🎮</span> {/* Show a temporary gaming icon beside the timeline title. */}
            <div> {/* Group the timeline title and supporting description. */}
              <h2>Gaming Timeline</h2> {/* Name the interactive timeline. */}
              <p>Explore all the games I have played, organized by platform and time. Drag to move around freely in 2D.</p> {/* Explain the purpose and movement of the timeline. */}
            </div> {/* Finish the timeline heading text group. */}
          </div> {/* Finish the timeline heading group. */}
          <div className="timeline-interaction-guide" aria-label="Timeline controls guide"> {/* Explain the three main timeline interactions. */}
            <span className="interaction-guide-item"><span aria-hidden="true">✋</span> Drag: Move in any direction</span> {/* Explain dragging. */}
            <span className="interaction-guide-item"><span aria-hidden="true">☝</span> Click: View genre</span> {/* Explain normal clicking. */}
            <span className="interaction-guide-item"><span aria-hidden="true">✦</span> Double-click: Favorite game</span> {/* Explain favorite-game double clicking. */}
          </div> {/* Finish the interaction guide. */}
        </div> {/* Finish the main toolbar row. */}
        {timelineYears.length > 0 && ( /* Display the year guide only when at least one game has a saved timeline year. */
          <div className="timeline-year-guide" aria-label="Gaming timeline years"> {/* Display all represented timeline years in chronological order. */}
            <span className="timeline-year-guide-label">Years</span> {/* Label the chronological year guide. */}
            {timelineYears.map(function (year) { /* Build one visible year marker for every represented year. */
              return <span key={year} className="timeline-year-marker">{year}</span>; // Display the current chronological year marker.
            })} {/* Finish building the year markers. */}
          </div> /* Finish the chronological year guide. */
        )} {/* Finish conditionally displaying the chronological year guide. */}
        <div className="timeline-controls"> {/* Group the zoom and recenter controls. */}
          <button type="button" className="zoom-button" onClick={controls.zoomOut} aria-label="Zoom out">−</button> {/* Let visitors zoom outward without a mouse wheel. */}
          <span className="zoom-label" aria-live="polite">{controls.zoomLabel}</span> {/* Display the current zoom percentage. */}
          <button type="button" className="zoom-button" onClick={controls.zoomIn} aria-label="Zoom in">+</button> {/* Let visitors zoom inward without a mouse wheel. */}
          <button type="button" className="recenter-button" onClick={controls.recenterTimeline}>Recenter Timeline</button> {/* Let visitors return to the same logical timeline area at any zoom. */}
        </div> {/* Finish the timeline controls. */}
      </div> {/* Finish the timeline toolbar. */}
      <div className="timeline-viewport-wrapper"> {/* Position the favorite legend over the interactive canvas. */}
        <div className="favorite-legend"><span aria-hidden="true">☆</span> Purple glow = Favorite Game</div> {/* Explain the purple favorite-card effect. */}
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
      </div> {/* Finish the viewport wrapper. */}
      <div className="timeline-stats-bar"> {/* Summarize the current timeline data below the canvas. */}
        <div className="timeline-stat-item timeline-stat-title"><span aria-hidden="true">🎮</span><span>My Gaming Journey - At a Glance</span></div> {/* Label the timeline summary bar. */}
        <div className="timeline-stat-item"><span className="timeline-stat-icon" aria-hidden="true">▱</span><span>{stats.platformCount} Platforms</span></div> {/* Display the number of unique platforms. */}
        <div className="timeline-stat-item"><span className="timeline-stat-icon" aria-hidden="true">🎮</span><span>{stats.gameCount} Games</span></div> {/* Display the total number of games. */}
        <div className="timeline-stat-item"><span className="timeline-stat-icon" aria-hidden="true">★</span><span>{stats.favoriteCount} Favorite Games</span></div> {/* Display the number of confirmed favorites. */}
        <div className="timeline-stat-item"><span className="timeline-stat-icon" aria-hidden="true">▱</span><span>{stats.genreCount} Genres Explored</span></div> {/* Display the number of unique genres. */}
      </div> {/* Finish the timeline statistics bar. */}
    </section> /* Finish the timeline section. */
  ); // Finish returning the timeline interface.
} // Finish the TimelineCanvas component.

export default TimelineCanvas; // Allow the Timeline page to use this component.
