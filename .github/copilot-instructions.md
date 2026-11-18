# My Gaming Journey — GitHub Copilot Project Instructions

> These repository-wide instructions describe the project's goals, requirements, design, architecture, current progress, and coding conventions. Follow them when suggesting, generating, modifying, or reviewing code in this repository.

## 1. Project identity and purpose

- **Project name:** My Gaming Journey
- **Course:** COMP 4005 Website Project
- **Repository:** https://github.com/EdayNotEbay/gaming-journey
- **Project type:** Personal, interactive gaming-history website.
- **Purpose:** Show how the creator's gaming interests evolved, including games played over the years, consoles/platforms, favorite games, genres, personal experiences, and rankings.
- **Intended audience:** Gamers, students, friends, and people interested in the creator's gaming history.
- **Goal:** A complete, attractive, accessible, responsive website that follows the approved site map and satisfies the course rubric. This is a personal portfolio/story, not a generic gaming news or store website.

### Authoritative project documents

The instructor's original assignment and the user's completed planning documents are:

1. **WebSiteProject (1).pdf** — COMP 4005 requirements, milestones, grading criteria, and final rubric.
2. **Project Topic Approval Completed (1).pdf** — approved concept, site purpose, audience, planned content, and similar websites.
3. **Project_ Site Map Completed.pdf** — approved seven-page navigation flowchart and page descriptions.

These PDFs were supplied to the project discussion but are **not currently tracked in the GitHub repository**. Their important requirements are transcribed here so Copilot has the context. If they become available in the workspace, review them before changing core scope or navigation. If instructions conflict, prioritize the instructor's assignment, then the approved topic/site map, then the creator's explicit later decisions. Do not silently change the approved structure.

**Additional instruction given by the professor in class:** Use **React and Node.js**, even though those technologies are not explicitly mentioned in the written PDFs.

## 2. Required technologies and developer environment

- **React** for the user interface; JavaScript with JSX, not TypeScript.
- **Node.js** for the local JavaScript development/build environment. An independent Node.js server has **not** been created yet. If a separate backend is required by the professor, implement and deploy it deliberately rather than pretending the Vite dev server is a production backend.
- **Vite** for React development and building.
- **React Router** for navigation between seven logical pages.
- **Plain external CSS** using actual .css files imported into React. Do **not** introduce Bootstrap, Tailwind, styled-components, inline styles, or embedded CSS by default.
- **Git** for local version control, **GitHub** for remote source hosting, and **Cloudflare** (planned: Cloudflare Pages) for Internet publishing.
- **VS Code**, running in **Ubuntu on WSL** on a Windows computer.
- When this guide was written, the local installation was Node.js 22.23.5, npm 10.9.9, and nvm 0.40.3.
- The current GitHub package.json specifies React 19, React Router 7, Vite 8, and ESLint 10. Read package.json and installed versions before using version-sensitive APIs.

### Local commands

From the existing project directory, `~/web-development/gaming-journey`:

```bash
# Install the current project dependencies.
npm install

# Run the local development server.
npm run dev

# Check the JavaScript and React code.
npm run lint

# Create the production build for Cloudflare.
npm run build

# Preview the production build locally.
npm run preview
```

The normal local preview address is http://localhost:5173/.

Do not scaffold another React/Vite app inside this repository; the project has already been created.

## 3. Approved website pages — exactly seven

The assignment requires **one home page and six to ten content pages** (seven to eleven pages in total). The approved plan uses **seven total pages**. All seven must contain real, meaningful content; empty route placeholders do not satisfy the finished-project requirement.

| Page | Current route | Required purpose and behavior |
| --- | --- | --- |
| **Gaming Timeline (Home)** | `/` | Show the creator's games throughout the years and the platform on which each was played. Click a game to see its genre. Purple-aura games are personal favorites. |
| **Genres** | `/genres` | Organize the timeline games by genre. Selecting a game should help visitors see other played games in the same genre. |
| **Favorite Genres** | `/favorite-genres` | Highlight favorite genre categories with examples from the creator's played games. Link into the fuller genre view. |
| **Favorite Games** | `/favorite-games` | Show only the creator's personal favorite games. Clicking a game leads to its genre and related games. |
| **My Gaming Journey** | `/my-gaming-journey` | Explain the creator's gaming story and changing preferences, from older consoles to current systems. |
| **Game Rankings** | `/game-rankings` | Display a real, accessible HTML **table** comparing games by platform, genre, and personal rating/rank. This fulfills the assignment table requirement. |
| **Recommend Me a Game** | `/recommend-me-a-game` | Provide a visitor recommendation **form**, including at least game title, genre, and reason. This fulfills the assignment form requirement. |

Preserve these page names, routes, and meanings. Shorter labels in navigation (for example, “Timeline” and “My Journey”) are acceptable if they point to the correct pages.

### Approved interactions and site-map flow

1. **Timeline -> Genres:** A single click on a game's cover/card opens the matching genre view.
2. **Timeline -> Favorite Games:** Double-clicking a game marked with a **purple aura** opens Favorite Games.
3. **Genres -> Favorite Games:** Double-clicking a purple-aura favorite may open Favorite Games.
4. **Favorite Games -> Genres:** Clicking a favorite opens its genre and related games.
5. **Favorite Genres -> Genres:** Visitors can open the corresponding full genre.
6. **Every page:** Keep consistent main navigation, a visible way to return to Timeline/Home, and a Back action where appropriate.
7. **Genre selection:** Use a selected genre or another simple state/route mechanism so navigation actually focuses on the correct category; don't link every game to an unfiltered generic page.

Double-click handling must not accidentally trigger unwanted single-click navigation. Also provide an accessible, keyboard-friendly way to visit Favorite Games because double-click alone is not usable by everyone. Preserve the intended interaction while providing a clear fallback.

## 4. Homepage visual direction — especially important

The creator specifically rejected a generic vertical list as the main timeline layout.

- Build a **horizontal gaming timeline** running across the page.
- Organize content into recognizable **platform groupings/sections** aligned with that timeline.
- Each game should have a visible connector/line relating it to the timeline and its platform grouping. Genres should also be understandable from the grouping or tags.
- On narrow screens, allow a usable horizontally scrollable or thoughtfully reflowed experience; do not destroy the timeline relationships.
- Planned platform groupings: **PS2, PS3, Xbox 360, Wii, Wii U, Xbox One, Oculus Quest 2, and PC**.
- Show genuine game covers and labels where available. Use appropriately attributed/licensed assets. Maintain readable fallback labels where images are unavailable.
- Personal favorite games have an obvious **purple glowing aura** around their cards/covers.
- Favor a **modern royal blue and dark navy** visual identity, with purple accents for favorites. Existing starter colors include a navy background (`#08142e`) and royal-blue accents (`#4169e1`, `#6495ed`).
- Keep a consistent logo/banner area, navbar, content area, and footer across pages.
- Include smooth but restrained **CSS transitions** for hover/selection/favorite effects. CSS transition can satisfy the assignment's bonus feature.
- Keep typography readable, contrast strong, and interaction states visible; don't depend only on color to convey favorite status.

### Game content policy

**Never invent games the creator has played.** The creator specifically corrected a previous mockup containing **Baldur's Gate 3**, which the creator said they had never played. Do not add that title to the personal collection.

Games previously mentioned by the creator include the following; this is a **working reference list, not a fully approved database**:

- Skyrim; Ratchet & Clank
- Call of Duty: Black Ops; Call of Duty: Black Ops II; Call of Duty: Ghosts
- Dragon Ball Z: Budokai Tenkaichi 3; Dragon Ball: Raging Blast; Dragon Ball: Raging Blast 2
- Batman: Arkham Asylum; Batman: Arkham Origins
- WWE 2K17; Brütal Legend; Red Dead Redemption
- Halo: Reach; Halo 3
- Rainbow Six Siege; Grand Theft Auto V; Monster Hunter: World
- Helldivers 2; NieR: Automata; Ready or Not
- Monster Hunter Rise; Monster Hunter Wilds

Do not infer that every game above was played on every listed platform, or that any unconfirmed title is a favorite. Confirm uncertain platform associations, genre labels, game ranks, and favorite status with the creator. Store real game information in a small central data file so the timeline, genre page, favorite pages, and rankings remain consistent. The initial mockup should not fabricate personal gaming history.

## 5. Course rubric: mandatory functional checklist

The completed website must include:

- [ ] One home page plus **at least six** (no more than ten) substantive content pages — the approved seven pages satisfy the count.
- [ ] Site published publicly online using the selected **Cloudflare** platform.
- [ ] An **external CSS stylesheet** for text, color, and layout, with **no inline CSS**, embedded CSS, or HTML font tags.
- [ ] Appropriate **meta tags**, meaningful page titles, and description/keyword metadata.
- [ ] A proper **HTML table** used effectively to display game rankings.
- [ ] An actual **email hyperlink**, for example a valid `mailto:` link to an address the creator approves. Do not invent personal contact details.
- [ ] At least one actual **external hyperlink** to a related or useful website.
- [ ] A consistent visible **banner/logo area**.
- [ ] Consistent **main navigation** on every page.
- [ ] At least one **bonus feature**, preferably a CSS transition or CSS image gallery.
- [ ] One page with a meaningful **form containing at least three elements**.
- [ ] Form labels and meaningful input names, validation, feedback, and **server-side submission processing that sends the information by email** to fulfill the strongest final-rubric criterion. A static form with no processing is insufficient for full marks.
- [ ] Website looks and functions correctly in **Chrome, Edge, and Firefox**.
- [ ] Valid semantic HTML and valid CSS; test with suitable validators.
- [ ] Accessible layout and controls following **W3C accessibility guidance**, including keyboard access, focus indicators, alt text, form labels, and reasonable contrast.
- [ ] Attractive, audience-appropriate visuals and meaningful content.
- [ ] A sample **wireframe** showing logo, navigation, content, and footer areas, as required by a course milestone.
- [ ] Prepare for the class presentation, including purpose, design decisions, challenges, navigation, and demo.

**Assignment milestones:** Topic Approval; Planning Analysis Sheet; Site Map; Wireframe; Update Meeting 1 (at least three pages, site URL, table sketch); Update Meeting 2 (at least six published pages, site URL, form sketch); Publish & Discuss Project. Don't claim any milestone is submitted or approved unless confirmed.

The topic-approval document cited Proquestinations (https://proquestinations.com/) and Solo Play Guide (https://www.soloplayguide.com/) as similar websites. They are references, not sources of the creator's personal game list.

## 6. Current GitHub project status (verified 2026-11-18)

- Repository: `EdayNotEbay/gaming-journey`
- Default branch: `main`
- Latest commit at the time of writing: `696b255` — “Add navigation and routes for seven gaming pages.”
- Earlier commits: `3596ada` initial Vite setup; `79db13e` homepage foundation.
- Existing files include `index.html`, `src/main.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css`, `src/pages.js`, `package.json`, and Vite/ESLint configuration.
- The existing `src/pages.js` centralizes the approved routes, titles, and brief descriptions.
- The existing `src/App.jsx` uses `BrowserRouter`, `NavLink`, `Routes`, and a simple `PageContent` placeholder for the seven route views, plus a shared header/footer.
- `src/App.css` and `src/index.css` provide the dark navy/royal blue foundation.
- React Router is already installed. Do not reinstall or change routing libraries without a real reason.
- **Not implemented yet:** actual timeline and platform/game cards, real page-specific content, game dataset, favorite interactions, populated rankings table, functional form, form backend/email processing, full accessibility testing, deployment, and documentation of completed milestone deliverables.
- **Not deployed yet:** Cloudflare deployment is planned, not complete. No Cloudflare production URL is confirmed.

Read the current repository state before changing anything. This status section is a snapshot and may become outdated as the site develops.

## 7. Suggested architecture (extend existing files, don't overengineer)

Preserve the current Vite React application and expand it only as needed.

```text
gaming-journey/
  .github/
    copilot-instructions.md       (this file)
  public/
    ...                           (public game images and icons)
  src/
    components/                   (add as needed for reusable UI)
      Navbar.jsx                  (optional: extract existing header)
      GameCard.jsx                (when game cards are implemented)
      GamingTimeline.jsx          (when the timeline is implemented)
    pages/                        (add as real page views are built)
      Home.jsx
      Genres.jsx
      FavoriteGenres.jsx
      FavoriteGames.jsx
      MyJourney.jsx
      GameRankings.jsx
      RecommendGame.jsx
    data/
      games.js                    (central verified game data)
    App.jsx                       (routes and shared layout)
    App.css                       (shared site styling)
    index.css                     (global styling)
    main.jsx                      (React entry point)
    pages.js                      (approved page labels and routes)
  index.html
  package.json
  vite.config.js
```

This is a **future organization suggestion**, not a claim that every listed file already exists. Start with fewer files when possible and refactor only when it improves clarity. Reuse components rather than duplicating page headers, footers, or game-card UI.

Possible data fields for games: stable id, title, platform, genre, favorite status, cover path, timeline order, optional personal rating, and optional short personal story. Use only verified data. Avoid duplicating the game list across components.

## 8. Coding style — firm creator preferences

Follow these rules when generating code for this project:

1. **Keep code as simple, clear, concise, and beginner-readable as possible.** The creator is learning React and wants to understand each change.
2. **Comment every line of code to explain what it does.** Use `//` for JavaScript, `{/* ... */}` for JSX, and `/* ... */` for CSS. If the syntax does not allow an inline comment, add an explanatory comment immediately above that line. Keep explanations short and meaningful; do not introduce syntax errors.
3. **Never use the JavaScript ternary operator** (`condition ? a : b`). Prefer an ordinary `if` statement.
4. **Avoid unnecessary question marks and exclamation marks in code**, including optional chaining and non-null assertions when simpler alternatives work. Do not rely on clever truthiness tricks.
5. **Prefer named `function` declarations and straightforward React function components** over arrow functions. Arrow functions may be used only when necessary for a library/API or async workflow.
6. **Always follow functional programming principles** when writing functions: use small, predictable functions, immutable data where practical, reusable transformations, and isolated side effects.
7. **Try to use object-oriented programming (OOP) and prefer classes** where they make sense for data models or domain behavior. Keep classes small, encapsulated, and easy to understand. For React UI, use function components because the existing application and React hooks are built around them.
8. Respect **high cohesion, low coupling, encapsulation, and abstraction**. Keep each component focused; pass simple props; centralize shared data.
9. Avoid deep nesting, unnecessary packages, excessive hooks, abstractions for their own sake, and needless files.
10. Give **full updated file contents** when the creator asks for code to paste, rather than fragments with missing placeholders.
11. **Test after each small part** before implementing the next feature.
12. **Commit progress in small, meaningful Git commits**; preserve the existing history and don't force-push or rewrite it.
13. Maintain the approved design and functionality unless the creator explicitly requests a change.
14. Use readable accessible semantic HTML in JSX. Use `className`, not `class`; put styles in external CSS, not JSX `style` props.

## 9. Navigation and React behavior guidance

- Keep route definitions central and easy to inspect.
- Use the existing React Router version and its current patterns rather than replacing the router.
- The home link and navigation should work from every route.
- For the Back action, use an understandable route-aware fallback so directly loaded pages still have a path back to the timeline.
- Genre navigation should focus a real genre, not simply show a generic heading.
- Make favorite interactions obvious with purple visual treatments and accessible labels.
- If the timeline includes scrollable content, use keyboard-operable controls or a standard scroll region that does not trap focus.
- Use stable IDs when mapping game cards, and provide meaningful image alt text.
- Keep the mobile navbar usable without covering content.

## 10. Forms, processing, and hosting

The **Recommend Me a Game** page needs game title, genre, and reason, with proper field labels, validation, and success/error feedback.

The professor's final rubric explicitly values a form that sends the submitted information by email through **server-side processing**. This is not implemented yet.

- Do not claim the form is complete if it only updates browser state or logs input.
- Do not put private mail API keys or passwords in client-side React code or the public repository.
- Decide on a Cloudflare-compatible server-side solution before implementing email delivery; Cloudflare Pages Functions or Workers may be appropriate, but verify current compatibility and provider setup.
- A normal Node.js Express server is **not** automatically hosted by static Cloudflare Pages. If a standalone Node server is truly required, plan its separate runtime and hosting explicitly.
- Protect the form against accidental repeated submissions and common automated spam.
- Do not invent the recipient email address; ask the creator or use a configuration value when the real address is supplied.

### Cloudflare publishing plan

- Planned host: **Cloudflare Pages**, linked to the existing GitHub repository.
- Build command: `npm run build`
- Output folder: `dist`
- Production branch: `main`
- Confirm that deep links and browser refreshes work with React Router after deployment.
- Verify all assets, styling, table, navigation, and form submission in production.
- Do not state the site is published until a live public URL is successfully tested.

## 11. Implementation order

Build in small, verifiable increments. Suggested order:

1. Confirm all seven placeholder routes work locally and the new header is responsive.
2. Create a minimal shared game dataset using **only confirmed played titles** and verified platform assignments.
3. Implement the distinct **horizontal timeline with grouped platforms and connected games**.
4. Add purple-aura favorite styling and correct single-click/double-click behavior.
5. Build Genres and Favorite Genres, including genre-focused navigation.
6. Build Favorite Games, reusing the same game data and cards.
7. Write the personal My Gaming Journey narrative using creator-supplied facts.
8. Populate the Game Rankings **table** with genuine personal ratings.
9. Build and validate Recommend Me a Game form; add secure server-side email processing.
10. Add approved email link, outside link, site metadata, real imagery, CSS transition bonus, and any missing rubric items.
11. Test responsive behavior, accessibility, browsers, HTML/CSS validation, and production build.
12. Publish on Cloudflare and test live URLs.
13. Finish wireframe/milestone evidence and prepare the class presentation.

At every step, communicate what changed, which files changed, how to test it, and what remains unfinished. Never present an unfinished placeholder as a completed requirement.

## 12. Final acceptance criteria

The finished site should feel like **this specific person's gaming history**, not a generic template. Visitors should be able to explore a horizontal timeline of genuine games grouped by platform, jump into genres, recognize purple-aura favorites, inspect personal rankings in a table, read the gaming journey, and submit a real game recommendation. All seven pages should be consistently navigable, styled with external CSS, accessible, and published through Cloudflare.

When in doubt, **preserve the approved site map, keep the code understandable, avoid inventing content, and ask for missing personal information rather than guessing.**
