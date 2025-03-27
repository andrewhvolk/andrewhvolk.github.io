window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Instantiate the main game class (defined in game.js)
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    // Game loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update game state (will be implemented in Game class)
        game.update(deltaTime);

        // Draw the game (will be implemented in Game class)
        game.draw(ctx);

        // Request the next frame
        requestAnimationFrame(animate);
    }

    // Start the game loop
    animate(0);
});