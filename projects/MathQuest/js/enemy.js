class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.health = 100; // Example health
    }

    update(deltaTime) {
        // Basic enemy doesn't move for now
    }

    draw(ctx) {
        console.log('Drawing enemy at:', this.x, this.y, 'health:', this.health);
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0; // Ensure health doesn't go below 0
            console.log('Enemy Defeated!'); // Placeholder for enemy death logic
        } else {
            console.log('Enemy took damage, health: ' + this.health); // Using string concatenation instead of template literal
        }
    }
}