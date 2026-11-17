// Keep the site's page names, addresses, and descriptions in one place.
const pages = [
  // Start with the home timeline.
  { path: "/", label: "Timeline", title: "My Gaming Timeline", description: "Explore the games and platforms that shaped my gaming journey." },
  // Group played games by genre.
  { path: "/genres", label: "Genres", title: "Genres", description: "Explore the different genres of games I have played." },
  // Highlight the types of games I enjoy most.
  { path: "/favorite-genres", label: "Favorite Genres", title: "Favorite Genres", description: "Discover the genres that have become my favorites." },
  // Show the games I consider personal favorites.
  { path: "/favorite-games", label: "Favorite Games", title: "Favorite Games", description: "See the games that stand out most in my gaming history." },
  // Explain how my gaming interests changed over time.
  { path: "/my-gaming-journey", label: "My Journey", title: "My Gaming Journey", description: "Learn how my gaming interests have changed from older consoles to today." },
  // Reserve a page for the required game ranking table.
  { path: "/game-rankings", label: "Game Rankings", title: "Game Rankings", description: "Compare games by platform, genre, and my personal rating." },
  // Reserve a page for the required game recommendation form.
  { path: "/recommend-me-a-game", label: "Recommend a Game", title: "Recommend Me a Game", description: "Suggest a game you think I would enjoy." },
]; // Finish the approved list of seven pages.

// Share the page list with the navigation and routing components.
export default pages;
