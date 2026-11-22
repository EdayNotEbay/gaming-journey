// Keep the temporary timeline dates tied to each platform's first release.
const platformReleaseDates = { // Start the platform release-date lookup.
  PS2: "March 4, 2000", // Use the PlayStation 2 first release date in Japan.
  PS3: "November 11, 2006", // Use the PlayStation 3 first release date in Japan.
  "Xbox 360": "November 22, 2005", // Use the Xbox 360 first release date in North America.
  Wii: "November 19, 2006", // Use the Wii first release date in North America.
  "Wii U": "November 18, 2012", // Use the Wii U first release date in North America.
  "Xbox One": "November 22, 2013", // Use the Xbox One first release date across its launch markets.
  "Oculus Quest 2": "October 13, 2020", // Use the Oculus Quest 2 retail release date.
  PC: "August 12, 1981", // Use the IBM Personal Computer unveiling as the practical PC timeline starting point.
}; // Finish the platform release-date lookup.

// Return the temporary timeline date assigned to one platform.
function getPlatformReleaseDate(platformName) { // Receive one platform name.
  let releaseDate = ""; // Start with no release date for an unknown platform.
  if (Object.prototype.hasOwnProperty.call(platformReleaseDates, platformName) === true) { // Check whether the platform exists in the release-date lookup.
    releaseDate = platformReleaseDates[platformName]; // Read the saved platform release date.
  } // Finish checking the platform lookup.
  return releaseDate; // Return the platform release date or an empty string.
} // Finish the platform release-date helper.

export { getPlatformReleaseDate, platformReleaseDates }; // Allow the website and Cloudflare API to reuse the same release dates.
