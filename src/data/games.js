// Keep all game information in one place so the timeline can later use Cloudflare D1 instead.
const games = [ // Start the complete game list.
  { id: 1, name: "Lego Batman", platform: "PS2", genre: "Action Adventure", timelineDate: "", isFavorite: false, cover: "" }, // Store Lego Batman.
  { id: 2, name: "Skyrim", platform: "PS3", genre: "RPG", timelineDate: "", isFavorite: false, cover: "" }, // Store Skyrim.
  { id: 3, name: "Ratchet and Clank", platform: "PS3", genre: "Platformer", timelineDate: "", isFavorite: false, cover: "" }, // Store Ratchet and Clank.
  { id: 4, name: "Call of Duty Black Ops", platform: "Xbox 360", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Call of Duty Black Ops.
  { id: 5, name: "Call of Duty Black Ops 2", platform: "Xbox 360", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Call of Duty Black Ops 2.
  { id: 6, name: "Dragon Ball Z Budokai Tenkaichi 3", platform: "Xbox 360", genre: "Fighting", timelineDate: "", isFavorite: false, cover: "" }, // Store Dragon Ball Z Budokai Tenkaichi 3.
  { id: 7, name: "Dragon Ball Raging Blast", platform: "Xbox 360", genre: "Fighting", timelineDate: "", isFavorite: false, cover: "" }, // Store Dragon Ball Raging Blast.
  { id: 8, name: "Dragon Ball Raging Blast 2", platform: "Xbox 360", genre: "Fighting", timelineDate: "", isFavorite: false, cover: "" }, // Store Dragon Ball Raging Blast 2.
  { id: 9, name: "Call of Duty Ghosts", platform: "Xbox 360", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Call of Duty Ghosts.
  { id: 10, name: "Batman Arkham Asylum", platform: "Xbox 360", genre: "Action", timelineDate: "", isFavorite: false, cover: "" }, // Store Batman Arkham Asylum.
  { id: 11, name: "Batman Arkham Origins", platform: "Xbox 360", genre: "Action", timelineDate: "", isFavorite: false, cover: "" }, // Store Batman Arkham Origins.
  { id: 12, name: "WWE 17", platform: "Xbox 360", genre: "Sports", timelineDate: "", isFavorite: false, cover: "" }, // Store WWE 17.
  { id: 13, name: "Brutal Legend", platform: "Xbox 360", genre: "Action Adventure", timelineDate: "", isFavorite: true, cover: "" }, // Store Brutal Legend as a favorite game.
  { id: 14, name: "Red Dead Redemption", platform: "Xbox 360", genre: "Open World", timelineDate: "", isFavorite: false, cover: "" }, // Store Red Dead Redemption.
  { id: 15, name: "Halo Reach", platform: "Xbox 360", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Halo Reach.
  { id: 16, name: "Halo 3", platform: "Xbox 360", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Halo 3.
  { id: 17, name: "Cars", platform: "Wii", genre: "Racing", timelineDate: "", isFavorite: false, cover: "" }, // Store Cars.
  { id: 18, name: "Cars 2", platform: "Wii", genre: "Racing", timelineDate: "", isFavorite: false, cover: "" }, // Store Cars 2.
  { id: 19, name: "Lego City Undercover", platform: "Wii U", genre: "Action Adventure", timelineDate: "", isFavorite: false, cover: "" }, // Store Lego City Undercover.
  { id: 20, name: "Disney Infinity", platform: "Wii U", genre: "Action Adventure", timelineDate: "", isFavorite: false, cover: "" }, // Store Disney Infinity.
  { id: 21, name: "Roblox", platform: "Xbox One", genre: "Sandbox", timelineDate: "", isFavorite: false, cover: "" }, // Store Roblox.
  { id: 22, name: "Destiny 1", platform: "Xbox One", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Destiny 1.
  { id: 23, name: "Evolve", platform: "Xbox One", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Evolve.
  { id: 24, name: "Lego Batman 3", platform: "Xbox One", genre: "Action Adventure", timelineDate: "", isFavorite: false, cover: "" }, // Store Lego Batman 3.
  { id: 25, name: "Rainbow Six Siege", platform: "Xbox One", genre: "Tactical Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Rainbow Six Siege.
  { id: 26, name: "GTA 5", platform: "Xbox One", genre: "Open World", timelineDate: "", isFavorite: false, cover: "" }, // Store GTA 5.
  { id: 27, name: "Monster Hunter World", platform: "Xbox One", genre: "Action RPG", timelineDate: "", isFavorite: false, cover: "" }, // Store Monster Hunter World.
  { id: 28, name: "Rec Room", platform: "Oculus Quest 2", genre: "Social", timelineDate: "", isFavorite: false, cover: "" }, // Store Rec Room.
  { id: 29, name: "Phasmophobia", platform: "Oculus Quest 2", genre: "Horror", timelineDate: "", isFavorite: false, cover: "" }, // Store Phasmophobia on Quest 2.
  { id: 30, name: "FOREWARNED", platform: "Oculus Quest 2", genre: "Horror", timelineDate: "", isFavorite: true, cover: "" }, // Store FOREWARNED as a favorite game.
  { id: 31, name: "Escape the Backrooms", platform: "PC", genre: "Horror", timelineDate: "", isFavorite: false, cover: "" }, // Store Escape the Backrooms.
  { id: 32, name: "Ark Survival Evolved", platform: "PC", genre: "Survival", timelineDate: "", isFavorite: false, cover: "" }, // Store Ark Survival Evolved.
  { id: 33, name: "Phasmophobia", platform: "PC", genre: "Horror", timelineDate: "", isFavorite: false, cover: "" }, // Store Phasmophobia on PC.
  { id: 34, name: "Battlefield 6", platform: "PC", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Battlefield 6.
  { id: 35, name: "Helldivers 2", platform: "PC", genre: "Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Helldivers 2.
  { id: 36, name: "NieR Automata", platform: "PC", genre: "Action RPG", timelineDate: "", isFavorite: false, cover: "" }, // Store NieR Automata.
  { id: 37, name: "Ready or Not", platform: "PC", genre: "Tactical Shooter", timelineDate: "", isFavorite: false, cover: "" }, // Store Ready or Not.
  { id: 38, name: "Monster Hunter Rise", platform: "PC", genre: "Action RPG", timelineDate: "", isFavorite: false, cover: "" }, // Store Monster Hunter Rise.
  { id: 39, name: "Monster Hunter Wilds", platform: "PC", genre: "Action RPG", timelineDate: "", isFavorite: false, cover: "" }, // Store Monster Hunter Wilds.
]; // Finish the complete game list.

export default games; // Allow pages and components to use the game data.
