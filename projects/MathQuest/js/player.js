class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 50;
        this.height = 50;
        this.x = 50;
        this.y = gameHeight - this.height - 50; // Start near the bottom
        this.velocityY = 0;
        this.gravity = 1;
        this.speed = 5;
        this.isJumping = false;
        this.lastShotTime = 0;
        this.shootInterval = 500; // Increased shoot interval to 500ms
        this.isShooting = false; // Flag to indicate shooting state
        this.isInteracting = false; // Flag to indicate interacting state
        this.projectiles = []; // Array to hold projectiles - re-introduced
        this.idleImage = new Image(); // Load idle sprite
        this.idleImage.src = 'assets/images/player_idle.png'; // Assuming placeholder image exists
        this.runImage = new Image(); // Load run sprite
        this.runImage.src = 'assets/images/player_run.png';   // Assuming placeholder image exists
    }

    update(input, deltaTime, studyStation) { // Pass studyStation as argument
        // Horizontal movement
        if (input.keys.ArrowLeft) {
            this.x -= this.speed;
        }
        if (input.keys.ArrowRight) {
            this.x += this.speed;
        }

        // Jumping
        if (input.keys.Space && !this.isJumping) {
            this.velocityY = -20; // Initial jump velocity
            this.isJumping = true;
        }

        // Shooting
        if (input.keys.f && (Date.now() - this.lastShotTime > this.shootInterval)) {
            this.shoot();
            this.lastShotTime = Date.now();
            this.isShooting = true; // Set shooting flag
            setTimeout(() => { this.isShooting = false; }, 100); // Reset after 100ms
        }

        // Interaction with Study Station
        if (input.keys.e && !this.isInteracting && this.isCollidingWithStation(studyStation)) { // Check for 'E' key and collision
            this.interactWithStation(studyStation);
            this.isInteracting = true;
            setTimeout(() => { this.isInteracting = false; }, 200); // Prevent rapid interaction
        }


        // Gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Keep player within game bounds (horizontal)
        if (this.x < 0) this.x = 0;
        if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

        // Ground collision (simple)
        if (this.y > this.gameHeight - this.height - 50) {
            this.y = this.gameHeight - this.height - 50;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Projectile update - re-introduced
        this.projectiles.forEach(projectile => projectile.update(deltaTime));
        this.projectiles = this.projectiles.filter(projectile => projectile.x < this.gameWidth); // Remove projectiles that go off screen
    }

    shoot() {
        console.log('Shoot method called'); // Just log to console for now
        const projectile = new Projectile(this.x + this.width, this.y + this.height/2, 10); // Create projectile at player position
        this.projectiles.push(projectile); // Projectile creation re-introduced
    }

    draw(ctx) {
        const isMovingHorizontally = this.speedX !== 0; // Check if player is moving horizontally
        const image = isMovingHorizontally ? this.runImage : this.idleImage; // Choose sprite based on movement

        ctx.drawImage(image, this.x, this.y, this.width, this.height); // Draw player sprite

        // Projectile drawing - re-introduced
        this.projectiles.forEach(projectile => projectile.draw(ctx));
    }

    isCollidingWithStation(station) { // Collision detection with study station
        return (
            this.x < station.x + station.width &&
            this.x + this.width > station.x &&
            this.y < station.y + station.height &&
            this.y + this.height > station.y
        );
    }

    interactWithStation(station) {
        station.activate(); // Call activate method of study station
    }
}