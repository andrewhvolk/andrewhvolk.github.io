class StudyStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.isActive = false; // Flag to track if station is active/problem is open
        this.problemOverlay = document.getElementById('problemOverlay'); // Get problem overlay element
        this.problemTextElement = document.getElementById('problemText'); // Get problem text element
        this.answerInputElement = document.getElementById('answerInput'); // Get answer input element
        this.submitButtonElement = document.getElementById('submitButton'); // Get submit button element
        this.ammoCounterElement = document.getElementById('ammoCounter'); // Get ammo counter element
        this.correctAnswer = "4"; // Correct answer for the problem
        this.ammoGainedOnCorrectAnswer = 10; // Ammo gained for correct answer
        this.currentAmmo = 0; // Current ammo count - will eventually be moved to Player or Game class
        this.initProblem(); // Initialize problem when study station is created
        this.setupSubmitButton(); // Setup submit button event listener
    }

    update(deltaTime) {
        // Study station doesn't need to update for now
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    activate() {
        this.isActive = true;
        this.problemOverlay.style.display = 'flex'; // Show problem overlay
        console.log('Study Station Activated'); // Placeholder for problem UI
    }

    deactivate() {
        this.isActive = false;
        this.problemOverlay.style.display = 'none'; // Hide problem overlay
    }

    initProblem() {
        this.problemTextElement.textContent = "What is 2 + 2?"; // Set problem text
    }

    setupSubmitButton() {
        this.submitButtonElement.addEventListener('click', () => {
            const userAnswer = this.answerInputElement.value;
            if (userAnswer === this.correctAnswer) {
                console.log('Correct Answer!');
                this.currentAmmo += this.ammoGainedOnCorrectAnswer; // Increment ammo
                this.ammoCounterElement.textContent = `Ammo: ${this.currentAmmo}`; // Update ammo counter
            } else {
                console.log('Incorrect Answer!');
            }
            this.deactivate(); // Deactivate study station and hide overlay after submission
        });
    }
}