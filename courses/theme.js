// 1. Check local storage safely
let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    console.warn("localStorage is unavailable, defaulting to system preference.");
}

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set the theme before the DOM fully loads
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
}

// 2. Wait for the page to load, then attach the button click logic
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    // Function to update the emoji icon
    const updateIcon = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    };

    // Set initial icon
    updateIcon();

    // Listen for clicks
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save to local storage safely
        try {
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            console.warn("Could not save theme to localStorage.");
        }
        
        // Update the button icon
        updateIcon();
    });
});