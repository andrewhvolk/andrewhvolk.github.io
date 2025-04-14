const STORAGE_KEY = 'prayerTracker_prayers';

/**
 * Loads prayers from localStorage.
 * @returns {Array} An array of prayer objects.
 */
function loadPrayers() {
    const prayersJson = localStorage.getItem(STORAGE_KEY);
    try {
        return prayersJson ? JSON.parse(prayersJson) : [];
    } catch (e) {
        console.error("Error parsing prayers from localStorage:", e);
        return []; // Return empty array on error
    }
}

/**
 * Saves prayers to localStorage.
 * @param {Array} prayers - The array of prayer objects to save.
 */
function savePrayers(prayers) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
    } catch (e) {
        console.error("Error saving prayers to localStorage:", e);
        // Consider notifying the user or implementing a fallback
    }
}

/**
 * Generates a unique ID.
 * Simple implementation using timestamp and random number.
 * @returns {string} A unique ID string.
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

export { loadPrayers, savePrayers, generateId };