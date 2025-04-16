/**
 * Gets the current date and time in ISO 8601 format.
 * Requires Day.js to be loaded globally.
 * @returns {string} The current date and time as an ISO string.
 */
function getCurrentISODate() {
    if (typeof dayjs === 'undefined') {
        console.error("Day.js is not loaded. Cannot get current ISO date.");
        // Fallback or throw error? For now, return a placeholder or null.
        return new Date().toISOString(); // Basic fallback
    }
    return dayjs().toISOString();
}

/**
 * Formats an ISO date string into a user-friendly format.
 * Requires Day.js to be loaded globally.
 * @param {string | null} isoDateString - The ISO date string to format.
 * @param {string} format - The desired format string (e.g., 'MM/DD/YYYY h:mm A'). Defaults to 'YYYY-MM-DD'.
 * @returns {string} The formatted date string, or 'N/A' if the input is null/invalid.
 */
function formatISODate(isoDateString, format = 'YYYY-MM-DD') {
    if (!isoDateString) {
        return 'N/A';
    }
    if (typeof dayjs === 'undefined') {
        console.error("Day.js is not loaded. Cannot format date.");
        return isoDateString; // Return original string as fallback
    }
    const date = dayjs(isoDateString);
    return date.isValid() ? date.format(format) : 'Invalid Date';
}

export { getCurrentISODate, formatISODate };