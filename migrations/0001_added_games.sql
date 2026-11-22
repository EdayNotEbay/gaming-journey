CREATE TABLE IF NOT EXISTS added_games ( -- Create the table that stores games added after the built-in library.
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- Give every added game its own database ID.
  name TEXT NOT NULL, -- Store the game title.
  platform TEXT NOT NULL, -- Store the platform name.
  genres TEXT NOT NULL, -- Store the genre array as JSON text.
  rating REAL NOT NULL, -- Store the personal rating out of five.
  timeline_date TEXT NOT NULL DEFAULT '', -- Store optional timeline text.
  is_favorite INTEGER NOT NULL DEFAULT 0, -- Store zero for normal games and one for favorites.
  cover TEXT NOT NULL -- Store the cover image URL.
); -- Finish creating the added-games table.
CREATE UNIQUE INDEX IF NOT EXISTS added_games_name_platform_unique ON added_games (LOWER(name), LOWER(platform)); -- Prevent duplicate administrator-added games on the same platform.
