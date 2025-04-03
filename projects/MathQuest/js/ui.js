class UIManager {
    constructor(player) {
        this.player = player;
        this.problemOverlay = document.getElementById('problemOverlay');
        this.problemText = document.getElementById('problemText');
        this.answerInput = document.getElementById('answerInput');
        this.submitButton = document.getElementById('submitButton');
        this.currentQuestion = null; // To store the question object being displayed

        if (!this.problemOverlay || !this.problemText || !this.answerInput || !this.submitButton) {
            console.error("UI elements not found! Make sure IDs match the HTML.");
            return;
        }

        // Bind the method to the class instance
        this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);

        // Add event listener
        this.submitButton.addEventListener('click', this.handleAnswerSubmit);
    }

    showProblemOverlay(questionObject) {
        if (!questionObject) {
            console.error("No question object provided to showProblemOverlay.");
            return;
        }
        this.currentQuestion = questionObject;
        this.problemText.textContent = this.currentQuestion.question;
        this.answerInput.value = ''; // Clear previous answer
        this.problemOverlay.style.display = 'block'; // Show the overlay
        this.answerInput.focus(); // Focus the input field
    }

    hideProblemOverlay() {
        this.problemOverlay.style.display = 'none'; // Hide the overlay
        this.currentQuestion = null; // Clear the current question
    }

    handleAnswerSubmit() {
        if (!this.currentQuestion) {
            console.error("handleAnswerSubmit called but no current question is set.");
            return;
        }

        const userAnswer = this.answerInput.value.trim();
        const correctAnswer = this.currentQuestion.correctAnswer;

        // Simple comparison for now (case-sensitive)
        if (userAnswer === correctAnswer) {
            console.log("Correct!");
            this.player.addAmmo(5); // Award 5 ammo for correct answer
            document.getElementById('ammoCounter').textContent = `Ammo: ${this.player.ammo}`;
            // Potentially add feedback to the user later
        } else {
            console.log(`Incorrect. The correct answer was: ${correctAnswer}`);
            // Potentially add feedback to the user later
        }

        this.hideProblemOverlay();
    }

    updateAmmoCounter() {
        document.getElementById('ammoCounter').textContent = `Ammo: ${this.player.ammo}`;
    }
}

// Instantiate the UIManager globally or manage it within your game logic
// For simplicity here, let's assume it might be instantiated in game.js
// If using modules (ES6 import/export), uncomment the line below:
// export { UIManager };