window.addEventListener('load', function() {
    // Diagnostic check 1: Verify canvas exists in DOM
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found in DOM');
        return;
    }
    console.log('Canvas found in DOM with dimensions:', canvas.width, 'x', canvas.height);

    // Diagnostic check 2: Get context and test drawing
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context');
        return;
    }
    
    // Draw test rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 50, 50);
    console.log('Test rectangle drawn successfully');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    console.log('Canvas dimensions set to:', canvas.width, 'x', canvas.height);

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