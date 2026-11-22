// Keep the temporary timeline year for every supported platform in one place.
const platformTimelineYears = { // Start the shared platform-year map.
  PS2: "2000", // Use the PlayStation 2 first-release year.
  "Xbox 360": "2005", // Use the Xbox 360 first-release year.
  PS3: "2006", // Use the PlayStation 3 first-release year.
  Wii: "2006", // Use the Wii first-release year.
  "Wii U": "2012", // Use the Wii U first-release year.
  "Xbox One": "2013", // Use the Xbox One first-release year.
  PC: "2019", // Use 2019 because this is when the user's PC gaming timeline begins.
  "Oculus Quest 2": "2020", // Use the Oculus Quest 2 first-release year.
}; // Finish the shared platform-year map.

// Return the temporary timeline year for one platform.
function getPlatformTimelineYear(platformName) { // Receive one supported platform name.
  let timelineYear = ""; // Start with no timeline year.
  if (Object.prototype.hasOwnProperty.call(platformTimelineYears, platformName) === true) { // Check whether the platform exists in the shared year map.
    timelineYear = platformTimelineYears[platformName]; // Read the configured platform timeline year.
  } // Finish checking the shared year map.
  return timelineYear; // Return the configured year or an empty value for an unknown platform.
} // Finish the platform timeline-year helper.

export { getPlatformTimelineYear, platformTimelineYears }; // Allow the frontend and Cloudflare Functions to share the same platform-year rule.
