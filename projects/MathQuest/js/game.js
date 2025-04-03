class Game {
    //Level
    level = new Level();

    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.input = new InputHandler();
        this.uiManager = new UIManager();
        this.projectiles = [];
        
        // Load level first
        this.level.loadTileset('assets/tileset_lecturehall.json');
        
        // Create game objects after level is loaded
        this.level.draw(document.createElement('canvas').getContext('2d')); // Force level to process spawn points
        
        // Create player at spawn point
        this.player = new Player(
            this.level.playerSpawn.x,
            this.level.playerSpawn.y,
            this.level
        );
        
        // Create enemies at spawn points
        this.enemies = this.level.enemySpawns.map(spawn =>
            new Enemy(spawn.x, spawn.y)
        );
        
        // Create study stations at spawn points
        this.studyStations = this.level.studyStationSpawns.map(spawn =>
            new StudyStation(spawn.x, spawn.y)
        );
        
        // Platforms are now defined in the level layout
        this.platforms = [];
    }

    update(deltaTime) {
        console.log('Game loop update running, deltaTime:', deltaTime);
        this.player.update(this.input, deltaTime, this.platforms); // Pass platforms for collision

        // Shooting
        if (this.input.keys.Space) {
            this.player.shoot();
        }

        // Add new projectiles to the game's projectile array
        this.player.projectiles.forEach(projectile => {
            if (!this.projectiles.includes(projectile)) {
                this.projectiles.push(projectile);
            }
        });
        this.player.projectiles = []; // Clear player's projectile array after adding them to the game

        this.enemies.forEach(enemy => enemy.update(deltaTime));

        // Update and check interaction for each study station
        this.studyStations.forEach(station => {
            station.update(deltaTime); // Update station (currently does nothing)
            // Check for player interaction (collision + 'E' key)
            if (station.checkInteraction(this.player) && this.input.keys['KeyE']) {
                if (!station.isActive) { // Only activate if not already active
                    station.activate();
                    // Select a random question from the globally available 'questions' array
                    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
                    // Show the problem overlay with the selected question
                    this.uiManager.showProblemOverlay(randomQuestion);
                }
            }
            // Optional: Add logic for deactivation if needed, e.g., player moves away
        });

        // Projectile collision detection
        for (let i = 0; i < this.projectiles.length; i++) {
            const projectile = this.projectiles[i];
            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                if (this.checkCollision(projectile, enemy)) {
                    enemy.takeDamage(projectile.damage);
                    this.projectiles.splice(i, 1);
                    i--; // Adjust index after removing projectile
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        j--; // Adjust index after removing enemy
                    }
                    break; // Break inner loop after collision
                }
            }
        }

        // Update projectiles
        this.projectiles.forEach(projectile => {
            projectile.update();
        });

        // Update ammo counter in UI
        this.uiManager.updateAmmoCounter();
    }

    draw(ctx) {
        console.log('Game loop draw running');
        // Example background fill
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Draw the level
        this.level.draw(ctx);

        // Draw platforms
        ctx.fillStyle = 'black';
        this.platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });


        this.player.draw(ctx);
        this.enemies.forEach(enemy => enemy.draw(ctx));
        // Draw study stations
        this.studyStations.forEach(station => {
            station.draw(ctx);
        });

        // Placeholder text to indicate game is running
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Math Quest is running', 20, 40);

        // Draw projectiles
        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });
    }

    checkCollision(rect1, rect2) { // Simple rectangle collision check
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
}