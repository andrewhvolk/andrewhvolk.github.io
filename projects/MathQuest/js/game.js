class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.player = new Player(gameWidth, gameHeight);
        this.input = new InputHandler();
        this.enemy = new Enemy(400, gameHeight - 100); // Instantiate enemy
        this.studyStation = new StudyStation(150, gameHeight - 150); // Instantiate study station
        this.platforms = [ // Array of platforms
            { x: 0, y: gameHeight - 50, width: gameWidth, height: 50 }, // Ground platform
            { x: 200, y: gameHeight - 200, width: 200, height: 20 }, // Example platform 1
            { x: 500, y: gameHeight - 300, width: 150, height: 20 }  // Example platform 2
        ];
    }

    update(deltaTime) {
        this.player.update(this.input, deltaTime, this.studyStation); // Pass studyStation to player.update
        this.enemy.update(deltaTime); // Update enemy
        this.studyStation.update(deltaTime); // Update study station

        // Projectile collision detection
        this.player.projectiles.forEach((projectile, projectileIndex) => {
            if (this.checkCollision(projectile, this.enemy)) {
                this.enemy.takeDamage(20); // Example damage value
                this.player.projectiles.splice(projectileIndex, 1); // Remove projectile on collision
            }
        });
    }

    draw(ctx) {
        // Example background fill
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Draw platforms
        ctx.fillStyle = 'black';
        this.platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });


        this.player.draw(ctx);
        this.enemy.draw(ctx); // Draw enemy
        this.studyStation.draw(ctx); // Draw study station

        // Placeholder text to indicate game is running
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Math Quest is running', 20, 40);
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