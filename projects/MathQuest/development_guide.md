# Math Quest: Step-by-Step Development Guide

This document outlines a detailed development process for creating the Math Quest 2D platformer shooter game, focusing on a minimal tech stack (HTML, CSS, Vanilla JavaScript with Canvas API) and emphasizing asset reuse.

**Target Tech Stack:**

*   **Language:** JavaScript (ES6+)
*   **Rendering:** HTML5 Canvas API (2D Context)
*   **Styling:** CSS3
*   **Markup:** HTML5
*   **Version Control:** Git / GitHub
*   **(Optional) Level Editing:** Tiled Map Editor (exporting to JSON)
*   **(Optional) Asset Creation:** Aseprite/GIMP (Graphics), Audacity (Audio)

**Core Principles:**

*   **Iterative Development:** Build core mechanics first, then layer content and features.
*   **Asset Reuse:** Utilize the single textbook design per course prefix. Reuse platform tiles with thematic variations.
*   **Vanilla JS Focus:** Avoid external game frameworks initially to keep dependencies minimal, unless specific features (like advanced physics or particle effects) prove too complex later.

---

## Development Phases & Timeline

*Timeline estimates assume a small team or solo developer working part-time/focused effort. Adjust based on resources.*

---

### Phase 1: Project Setup & Basic Player Movement (Estimated Time: 1 Week)

1.  **[Day 1] Project Structure:**
    *   Create main project folder (`MathQuest`).
    *   Create subfolders: `css/`, `js/`, `assets/` (with subfolders `images/`, `audio/`).
    *   Initialize Git repository (`git init`).
2.  **[Day 1] Basic HTML (`index.html`):**
    *   Setup HTML5 document structure.
    *   Include a `<canvas>` element for the game.
    *   Link CSS file (`css/style.css`).
    *   Link main JavaScript file (`js/main.js`).
3.  **[Day 1] Basic CSS (`css/style.css`):**
    *   Basic page styling (body margin/padding reset).
    *   Style the canvas (border, dimensions - though JS will control size).
4.  **[Day 2] Game Loop & Canvas Setup (`js/main.js`, `js/game.js`):**
    *   Create a `Game` class to manage overall state, canvas context, and game loop.
    *   Implement the main game loop using `requestAnimationFrame` (clear, update, draw).
    *   Handle canvas resizing.
5.  **[Day 3-4] Player Class & Basic Physics (`js/player.js`):**
    *   Create a `Player` class with properties: position (x, y), velocity (vx, vy), size (width, height), state (idle, running, jumping).
    *   Implement basic gravity (add to `vy` each frame).
    *   Implement horizontal movement logic (update `vx` based on input).
    *   Implement jump logic (set negative `vy` on input, only if grounded).
    *   Update player position based on velocity (`x += vx`, `y += vy`).
    *   Implement basic ground collision (stop falling when `y` reaches floor level).
6.  **[Day 5] Input Handling (`js/input.js`):**
    *   Create an `InputHandler` class or functions to listen for keyboard events (`keydown`, `keyup`).
    *   Track state of relevant keys (left, right, jump, shoot).
    *   Pass input state to the `Player` class for movement updates.
7.  **[Day 6-7] Player Rendering & Placeholder (`js/player.js`, `js/game.js`):**
    *   Add a `draw` method to the `Player` class.
    *   Initially, draw the player as a simple rectangle on the canvas using the player's position and size.
    *   Integrate player update and draw calls into the main game loop.

---

### Phase 2: Core Combat & Problem Solving Loop (Estimated Time: 2 Weeks)

1.  **[Week 2 / Day 1-2] Study Station (`js/study_station.js`):**
    *   Create a `StudyStation` class (position, size, active state).
    *   Implement basic rendering (placeholder rectangle).
    *   Implement player collision/interaction detection (simple distance check or bounding box).
    *   Add logic to activate the station on player interaction (e.g., pressing an 'interact' key).
2.  **[Week 2 / Day 3-4] Problem Solving UI & Logic (`js/ui.js`, `js/questions.js`):**
    *   Design a simple HTML overlay (div) for displaying questions, hidden by default.
    *   Create a basic question bank (`questions.js`) - array of objects `{ question: "...", answers: ["A", "B", "C", "D"], correctAnswer: "A", subject: "MATH" }`.
    *   Implement UI logic (`ui.js`) to:
        *   Show the overlay when a Study Station is activated.
        *   Display a random question (initially, later filter by subject/level).
        *   Handle answer selection (button clicks).
        *   Check if the selected answer is correct.
        *   Hide the overlay after an answer is chosen.
3.  **[Week 2 / Day 5] Ammo Generation (`js/player.js`, `js/game.js`):**
    *   Add an `ammo` property to the `Player` class.
    *   When a question is answered correctly via the UI, increment the player's ammo count.
    *   Display the ammo count simply on the canvas (or basic HTML element).
4.  **[Week 3 / Day 1-2] Basic Enemy (Textbook) (`js/enemy.js`):**
    *   Create an `Enemy` class (position, size, health, prefix/type).
    *   Implement basic rendering (placeholder rectangle).
    *   Give enemies simple behavior (e.g., stationary).
    *   Instantiate a few enemies in the `Game` class for testing.
5.  **[Week 3 / Day 3] Projectile Class (`js/projectile.js`):**
    *   Create a `Projectile` class (position, velocity, size, damage).
    *   Implement `update` method (move based on velocity).
    *   Implement `draw` method (simple circle or small rectangle).
6.  **[Week 3 / Day 4-5] Shooting Mechanic (`js/player.js`, `js/game.js`):**
    *   Add a `shoot` method to the `Player` class.
    *   On 'shoot' input and if `ammo > 0`:
        *   Decrement ammo.
        *   Create a new `Projectile` instance at the player's position with appropriate velocity (based on player facing direction).
        *   Add the projectile to an array managed by the `Game` class.
    *   Update and draw all active projectiles in the game loop. Remove projectiles that go off-screen.
7.  **[Week 3 / Day 6-7] Collision & Damage (`js/game.js`, `js/enemy.js`):**
    *   Implement collision detection between projectiles and enemies (bounding box checks).
    *   When a collision occurs:
        *   Remove the projectile.
        *   Reduce enemy health by projectile damage.
        *   If enemy health <= 0, remove the enemy from the game.

---

### Phase 3: Level 1 Implementation (Estimated Time: 1.5 Weeks)

1.  **[Week 4 / Day 1] Theme & Tileset Design (Lecture Hall):**
    *   Conceptually design the look for Semester 1 (Lecture Hall).
    *   Create a basic tileset image (`tileset_lecturehall.png`) with essential platform tiles (e.g., floor, wall, single platform block) using Aseprite/GIMP. Keep it simple initially (e.g., 32x32 tiles).
2.  **[Week 4 / Day 2-3] Tilemap Loading & Rendering (`js/level.js`, `js/game.js`):**
    *   Define a simple level layout using a 2D array (e.g., `[[0,0,0,...], [0,1,1,...], ...]`) where numbers represent tile types. Store this in `level.js` or load from a simple JSON.
    *   Implement logic in `Game` or a new `Level` class to:
        *   Load the tileset image.
        *   Iterate through the level layout array.
        *   Draw the corresponding tile from the tileset at the correct position on the canvas.
3.  **[Week 4 / Day 4-5] Player-Tile Collision (`js/player.js`, `js/level.js`):**
    *   Refine player physics to handle collisions with solid tiles in the level map.
    *   Check potential player position against the tilemap data.
    *   Prevent movement into solid tiles (stop horizontal movement against walls, stop falling/allow jumping on floors).
4.  **[Week 5 / Day 1-2] Level 1 Design & Population:**
    *   Design the actual layout for Level 1 (Semester 1) using the tile system. Focus on basic platforming flow.
    *   Define spawn points for the player, enemies (Textbooks - use MATH prefix initially), and Study Stations within the level data.
    *   Update game logic to instantiate entities based on the level data.

---

### Phase 4: Assets & Polish (Semester 1) (Estimated Time: 2 Weeks)

1.  **[Week 5 / Day 3-5] Player Sprites & Animation (`js/player.js`, `assets/images/player/`):**
    *   Create spritesheets for player idle, run, jump, and shoot animations (Male/Female).
    *   Implement sprite animation logic in the `Player` class (cycle through frames based on state and timer).
    *   Replace the placeholder rectangle rendering with sprite rendering.
2.  **[Week 6 / Day 1-2] Enemy Sprites & Animation (MATH Textbook) (`js/enemy.js`, `assets/images/enemies/`):**
    *   Create spritesheet for the MATH textbook enemy (idle, hit, defeated).
    *   Implement animation logic in the `Enemy` class.
    *   Replace placeholder rendering.
3.  **[Week 6 / Day 3] Projectile & Effects Sprites (`js/projectile.js`, `assets/images/effects/`):**
    *   Create sprite for the "Assignment" projectile.
    *   Create spritesheet for the impact effect.
    *   Update rendering and add impact effect instantiation on collision.
4.  **[Week 6 / Day 4] Study Station Sprite (`js/study_station.js`, `assets/images/objects/`):**
    *   Create sprite for the Study Station.
    *   Update rendering.
5.  **[Week 6 / Day 5-7] Basic UI Implementation (`js/ui.js`, `index.html`, `css/style.css`):**
    *   Use HTML elements overlaid on the canvas (or draw directly to canvas) for:
        *   Player Health (simple bar or hearts).
        *   Ammo Count.
    *   Style the UI elements using CSS.
    *   Update UI values from the `Game` state.
6.  **[Week 7 / Day 1-3] Basic Sound Effects (`js/audio.js`, `assets/audio/sfx/`):**
    *   Create/find basic SFX for: jump, shoot, projectile impact, enemy hit, enemy defeated, answer correct, answer incorrect.
    *   Implement a simple `AudioManager` (`audio.js`) to load and play sounds using the Web Audio API.
    *   Trigger sounds at appropriate points in the game logic.

---

### Phase 5: Expanding Content (Semester 2+) (Estimated Time: 3-4 Weeks per Semester)

*(Repeat/Adapt steps for each new semester/level)*

1.  **[Ongoing] New Enemy Sprites:** Create textbook spritesheets for other course prefixes (ENGL, PHYS, etc.) as needed for the semester's courses. **Reuse the core textbook animation logic.**
2.  **[Ongoing] New Level Theme & Tileset:** Design theme (e.g., Library), create/adapt tileset. **Reuse basic tile types where possible.**
3.  **[Ongoing] New Level Design:** Design and build Level 2 layout, place enemies/stations.
4.  **[Ongoing] Expand Question Bank:** Add more questions relevant to Semester 2 courses. Refine logic to pull questions based on the encountered enemy's prefix/course context.
5.  **[Ongoing] Power-ups & Collectibles (`js/items.js`):**
    *   Implement basic versions of Formula/Tool/Points items (simple sprites, collision, effect logic - e.g., temporary ammo boost, score increase).
6.  **[Ongoing] Boss Battle (End of Semester 1):**
    *   Design a simple boss (e.g., larger textbook, slightly different behavior/more health).
    *   Implement boss logic and place at the end of Level 1 or in a separate small arena.
7.  **[Ongoing] Add Level Backgrounds:** Create and integrate background images for completed levels.

---

### Phase 6: Refinement, Balancing & Testing (Estimated Time: 2-3 Weeks)

1.  **[Ongoing] Sound Polish:** Add background music (BGM) per level theme, refine existing SFX, add missing SFX (UI clicks, landings, etc.).
2.  **[Ongoing] UI Polish:** Improve visual design of UI elements, add feedback (e.g., screen shake on hit, ammo gain confirmation). Add Start/Game Over screens.
3.  **[Ongoing] Control Tuning:** Refine player jump height, speed, friction based on playtesting feedback.
4.  **[Ongoing] Difficulty Balancing:** Adjust:
    *   Enemy health and placement.
    *   Ammo generation rate vs. usage.
    *   Problem frequency and difficulty.
    *   Platforming challenge difficulty.
5.  **[Ongoing] Bug Fixing:** Address issues found during development and playtesting.
6.  **[Ongoing] Playtesting:** Conduct thorough playtesting sessions with target users (if possible) to gather feedback on fun, difficulty, and clarity.

---

### Phase 7: Deployment (Estimated Time: 1 Week)

1.  **[Day 1-2] Code Cleanup & Optimization:** Refactor code, remove unused assets, ensure code is commented.
2.  **[Day 3] Asset Optimization:** Compress images (e.g., using TinyPNG), ensure audio files are reasonably sized.
3.  **[Day 4-5] Final Testing:** Cross-browser testing (Chrome, Firefox, Safari, Edge).
4.  **[Day 6-7] Deployment:** Upload the static files (`index.html`, `css/`, `js/`, `assets/`) to a web host (e.g., GitHub Pages, Netlify, Vercel).

---

**Total Estimated Time:** Approx. 11-15 Weeks (can vary significantly based on scope additions, team size, and experience).