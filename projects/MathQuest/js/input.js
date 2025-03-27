class InputHandler {
    constructor() {
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false,
            f: false, // For shooting
            e: false  // For interact
        };

        window.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') this.keys.ArrowLeft = true;
            if (event.key === 'ArrowRight') this.keys.ArrowRight = true;
            if (event.key === ' ') this.keys.Space = true;
            if (event.key === 'f' || event.key === 'F') this.keys.f = true; // Shooting key
            if (event.key === 'e' || event.key === 'E') this.keys.e = true; // Interact key
        });

        window.addEventListener('keyup', event => {
            if (event.key === 'ArrowLeft') this.keys.ArrowLeft = false;
            if (event.key === 'ArrowRight') this.keys.ArrowRight = false;
            if (event.key === ' ') this.keys.Space = false;
            if (event.key === 'f' || event.key === 'F') this.keys.f = false; // Shooting key
            if (event.key === 'e' || event.key === 'E') this.keys.e = false; // Interact key
        });
    }
}