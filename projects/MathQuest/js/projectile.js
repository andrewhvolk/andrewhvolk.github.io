class Projectile {
    constructor(x, y, velocityX) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.width = 10;
        this.height = 5;
    }

    update(deltaTime) {
        this.x += this.velocityX;
    }

    draw(ctx) {
        ctx.fillStyle = 'green'; // Changed to green for visibility
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2); // Draw circle
        ctx.fill();
    }
}