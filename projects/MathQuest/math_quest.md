# Math Quest: A 2D Platformer Shooter Concept

## 1. Core Concept

Math Quest is a 2D **platformer shooter** where the player navigates university-themed levels, solves math problems to generate "assignment" projectiles, and shoots these projectiles to defeat textbook-shaped enemies representing different courses. The game focuses on reinforcing basic arithmetic, algebra, and geometry concepts through active gameplay. The player takes on the role of a proactive mathematics student cleaning up the campus.

## 2. Player Character

*   **The Mathematician:** A character (male or female) with standard platformer movement (run, jump) and the ability to **generate and shoot "assignment" projectiles.**
*   **Abilities:**
    *   Platforming: Running, jumping, navigating levels.
    *   Problem Solving: Interacting with specific points in the level (e.g., "Study Stations") to solve math problems.
    *   **Shooting:** Firing generated "assignment" projectiles at enemies.

## 3. Gameplay Mechanics

*   **Core Loop:** Navigate Platforming Level -> Find & Activate Study Station -> Solve Math Problem -> Generate Assignment Ammo -> Shoot Textbook Enemies -> Defeat All Enemies -> Progress to Next Level.
*   **Platforming:** Standard 2D platforming controls. Levels feature platforms, obstacles, and collectibles.
*   **Ammo Generation ("Studying"):**
    *   Player must find and interact with "Study Stations" scattered throughout the level.
    *   Activating a station presents a math problem (e.g., multiple-choice, fill-in-the-blank) related to the semester's courses via a concise UI overlay.
    *   Solving the problem correctly generates a certain amount of "Assignment Ammo." The difficulty or type of problem might influence the amount of ammo generated.
    *   *(Optional Grading Mechanic):* Solving quickly or on the first try could generate "Grade A" ammo (more damage?) while subsequent tries yield "Grade B" or "C" ammo (less damage?). Failure might yield no ammo or require a cooldown.
*   **Combat ("Submitting Assignments"):**
    *   Player uses collected ammo to shoot projectiles (visually represented as rolled-up papers or assignments) at enemies.
    *   Enemies (Textbooks) have health points and are defeated after taking enough hits.
    *   Shooting mechanics involve aiming (potentially simple directional aiming) and firing.
*   **Level Progression:** The game is structured into 8 semesters (levels). Each semester focuses on different courses/subjects. Clearing all required enemies in a level allows progression.
*   **Power-ups/Collectibles:**
    *   **Formulas:** Could temporarily grant special ammo (e.g., rapid-fire, piercing) or auto-solve one problem at a Study Station.
    *   **Tools:** Could temporarily boost ammo generation rate or provide hints at Study Stations.
    *   **Points:** Used to unlock new levels or character customizations (if implemented).
*   **Boss Battles:** Larger, more complex textbook enemies (e.g., "Compendium of Calculus," "Physics Encyclopedia") with unique attack patterns or requiring specific ammo types/strategies to defeat. They might guard the exit of a semester.

## 4. Enemy Design (Course-Based Textbooks)

Enemies are visually represented as **cartoonish, possibly animated textbooks**, themed according to the course *prefix* (e.g., MATH, ENGL, PHYS). **There will be one unique textbook design per course prefix.**

*   **Appearance:** Each prefix (MATH, ENGL, etc.) has a distinct textbook design (color, cover symbols).
*   **Behavior:** Enemies might be stationary, patrol short platforms, or occasionally perform simple actions (e.g., flipping open briefly). They have health points.
*   **Spawning:** Enemies are placed strategically throughout the platforming levels.
*   **Subject Areas (based on Section 8):** MATH, ENGL, PHYS, BIBL, RLGN, UNIV, CSIS, EVAN, RSCH, THEO (approx. 10 unique designs based on explicit prefixes, plus potential designs for elective categories).

## 5. World & Level Design

*   **Level Structure:** Levels are designed as 2D platforming stages with varying layouts, platform types, hazards (e.g., pitfalls, simple environmental obstacles), and secrets. Enemy placement and "Study Station" locations are key design elements.
*   **Level Themes:** Each semester takes place in a different area of the university (Lecture Hall, Library, Science Lab, etc.), influencing the visual style of platforms, backgrounds, and decorative props.
    *   **Semester 1:** Lecture Hall
    *   **Semester 2:** Library
    *   *(Themes for Semesters 3-8 TBD, e.g., Science Lab, Dorm Quad, Gymnasium)*

## 6. Potential Features

*   **Difficulty Levels:** Adjust complexity/frequency of math problems, enemy health/placement, platforming difficulty.
*   **Ammo Types:** Different ammo based on grades (A/B/C) or subjects, having different effects (damage, fire rate, spread).
*   **Timed Challenges:** Defeat enemies or reach the end within a time limit, possibly linked to ammo generation speed.

## 7. Art Style and Visual Presentation

*   **Visual Style:** Simple, clean 2D graphics suitable for a static browser game. Cartoonish and expressive.
*   **Character Design:** Player character is approachable student type. Enemies are distinct, animated textbooks.
*   **UI Design:** Clear and intuitive interface for health, ammo count, score, and the pop-up problem-solving interface at Study Stations.

## 8. Math BS Course Sequence (LU)

*(Content remains the same - serves as inspiration for problem content and progression)*
... (Course list omitted for brevity) ...

## 9. Development Process Outline

*(Phases remain similar, but task details within phases need adjustment)*

1.  **Phase 1: Foundation & Core Mechanics**
    *   ... Project Setup ...
    *   **HTML Structure:** Canvas, UI container (Health, Ammo, Score), Problem Solving Overlay.
    *   ... CSS Styling ...
    *   **Game Loop & Rendering:** Basic loop, canvas setup.
    *   **Player Controller:** Implement platforming movement (run, jump).
    *   **Shooting Mechanic:** Basic projectile firing logic.
    *   **Basic Enemy:** Simple textbook enemy placeholder.
2.  **Phase 2: Core Gameplay Loop**
    *   **Study Stations:** Implement interactable objects.
    *   **Problem Solving UI:** Create overlay for displaying/answering questions.
    *   **Ammo Generation:** Link correct answers to ammo gain.
    *   **Enemy Health & Damage:** Implement health system for enemies, damage from projectiles.
    *   **Basic Level Structure:** Create a simple test level with platforms, study station, and enemies.
3.  **Phase 3: Content & Systems**
    *   **Player Animations:** Add idle, run, jump, *shoot* animations.
    *   **Enemy Designs & Animations:** Implement textbook designs per prefix, add hit/defeated animations.
    *   **Projectile Asset:** Create assignment projectile sprite and impact effect.
    *   **Level Design:** Build out initial levels (Semester 1) with platforming challenges and enemy placement.
    *   **Question Bank:** Populate with questions tied to courses/semesters.
    *   **Grading/Ammo Type Logic:** (If implementing variations).
4.  **Phase 4: Features & Polish**
    *   **Power-ups & Collectibles:** Implement items and effects.
    *   **Boss Battles:** Design and implement boss encounters.
    *   **UI Refinement:** Polish ammo counter, health display, feedback.
    *   **Sound Integration:** Add shooting, impact, study station, BGM, etc.
    *   **More Levels:** Design levels for subsequent semesters.
5.  **Phase 5: Balancing, Testing & Deployment**
    *   **Balancing:** Adjust ammo generation rate, enemy health, problem difficulty, platforming challenges.
    *   **Testing:** Thorough playtesting for bugs, fun factor, difficulty curve.
    *   **Deployment:** Optimize assets, deploy static files.

## 10. Feasibility Review (Static HTML/JS)

Creating Math Quest as a **2D platformer shooter remains feasible** with HTML, CSS, and JavaScript using the Canvas API. The core mechanics (platforming, simple shooting, state management, UI overlays) are well within the capabilities of client-side web technologies. Asset management and performance optimization (especially with potentially many projectiles or enemies) will be important considerations.

## 11. Required Assets (Detailed - Updated for Platformer Shooter)

... (General Format/Dimensions notes remain similar) ...

**A. Visual Assets**

*   **Player Character ("The Mathematician"):**
    *   ... (Description, Idle, Run, Jump animations remain similar) ...
    *   **NEW:** `player_shoot_m.png`, `player_shoot_f.png`: Animation for firing a projectile (e.g., 2-4 frames, character aiming/throwing paper). Dimensions per frame: ~48x64px.
    *   *(Optional)* `player_interact_m.png`, `player_interact_f.png`: Animation for activating Study Station.
    *   ... (Optional Hurt animation remains) ...
*   **Enemies (Course Prefix Textbooks):**
    *   **Description:** Cartoonish **Textbooks**, one unique design per course prefix (approx. 10+). Cover design reflects subject (MATH: numbers/graphs, ENGL: quill/letters, PHYS: atom/gears).
    *   **Animations (Spritesheet Frames per Prefix Design):**
        *   `enemy_[prefix]_idle.png`: Idle animation (e.g., slight wobble, page riffle, 4-6 frames). Dimensions e.g., 48x48px or 64x48px.
        *   **NEW:** `enemy_[prefix]_hit.png`: Reaction to being hit (e.g., brief flash, shake, 2-3 frames). Dimensions match idle.
        *   `enemy_[prefix]_defeated.png`: Defeated animation (e.g., falling apart, pages scattering, 4-6 frames). Dimensions match idle.
*   **Projectile ("Assignment"):**
    *   **NEW:** `projectile_assignment.png`: Sprite for the fired projectile (e.g., rolled/folded paper, paper airplane). Dimensions: ~16x16px or 24x16px.
    *   **NEW:** `effect_impact.png`: Spritesheet for projectile hitting an enemy (e.g., small spark, paper shred effect, 3-5 frames). Dimensions per frame: ~24x24px.
*   **Bosses:**
    *   **Description:** Larger, more imposing **Textbook** designs (e.g., giant tome, encyclopedia). Unique per boss.
    *   **Animations:** Idle, **Hit Reaction**, Defeated, *(Optional)* Attack (e.g., spawning smaller enemies, firing page projectiles). Dimensions significantly larger.
*   **Level Backgrounds:**
    *   ... (Remains the same - Lecture Hall, Library themes etc.) ...
*   **Level Elements (Tileset):**
    *   ... (Remains the same - Platforms, walls, props) ...
    *   **NEW:** `object_studystation.png`: Sprite for the interactable Study Station object (e.g., a glowing desk, a special podium). Dimensions: ~32x48px or 64x64px.
*   **Power-ups/Collectibles:**
    *   ... (Remains similar - Formula, Tool, Points icons) ...
*   **UI Elements:**
    *   **NEW:** Ammo Counter display elements (icon + number).
    *   Health display elements (hearts or bar).
    *   Score display elements.
    *   **REVISED:** `ui_panel_problemsolving.png`: Background panel for the Study Station problem overlay (might replace `ui_panel_challenge`).
    *   Buttons for answer choices (if using multiple choice). Input field style (if using fill-in-the-blank).
    *   Feedback indicators (Correct/Incorrect) for problem solving.
    *   *(Optional)* Grade display graphics (A, B, C) if tying grade to ammo type.
    *   ... (Title screen, Pause menu remain optional) ...
    *   ... (Font choice remains) ...

**B. Audio Assets**

*   ... (General Format/Characteristics notes remain similar) ...
*   **Sound Effects (SFX):**
    *   `sfx_player_jump.ogg/.mp3`
    *   `sfx_player_land.ogg/.mp3`
    *   **NEW:** `sfx_player_shoot.ogg/.mp3`: Sound of firing an assignment (e.g., paper rustle, 'thwip'). (~0.2s).
    *   **NEW:** `sfx_projectile_impact.ogg/.mp3`: Sound of assignment hitting textbook enemy (e.g., paper hit, thud). (~0.3s).
    *   `sfx_item_collect_[type].ogg/.mp3`
    *   **NEW:** `sfx_studystation_activate.ogg/.mp3`: Sound for interacting with study station. (~0.5s).
    *   `sfx_answer_correct.ogg/.mp3`: Positive chime (triggers ammo gain).
    *   `sfx_answer_incorrect.ogg/.mp3`: Negative buzzer (no ammo gain).
    *   **NEW:** `sfx_enemy_hit.ogg/.mp3`: Sound for enemy taking damage. (~0.3s).
    *   `sfx_enemy_defeated.ogg/.mp3`: Textbook falling apart sound. (~0.5-1s).
    *   `sfx_ui_click.ogg/.mp3`
    *   `sfx_level_start.ogg/.mp3`
    *   *(Optional)* `sfx_player_hurt.ogg/.mp3`
    *   *(Optional)* `sfx_boss_intro.ogg/.mp3`
    *   *(Optional)* `sfx_ammo_pickup.ogg/.mp3`: If ammo can be picked up directly.
*   **Music (BGM):**
    *   ... (Remains the same - Title, Level themes, Boss theme, etc.) ...