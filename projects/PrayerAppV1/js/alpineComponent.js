import { loadPrayers, savePrayers, generateId } from './localStorageStore.js';
import { getCurrentISODate, formatISODate } from './dateUtils.js';

function prayerApp() {
    return {
        prayers: [],
        newPrayerTitle: '',
        newPrayerDescription: '',
        editingPrayer: null, // { id: '', title: '', description: '' }
        editTitle: '',
        editDescription: '',
        currentView: 'all', // 'all', 'unanswered', 'answered'

        // Initialization
        init() {
            this.prayers = loadPrayers();
            // Add watcher to save prayers whenever they change
            this.$watch('prayers', (newValue) => {
                savePrayers(newValue);
            }, { deep: true }); // Use deep watch for array mutations
        },

        // Computed property for filtered prayers based on the current view
        get filteredPrayers() {
            switch (this.currentView) {
                case 'answered':
                    return this.prayers.filter(p => p.isAnswered);
                case 'unanswered':
                    return this.prayers.filter(p => !p.isAnswered);
                case 'all':
                default:
                    return this.prayers;
            }
        },

        // Methods
        addPrayer() {
            const title = this.newPrayerTitle.trim();
            const description = this.newPrayerDescription.trim();
            if (!title) {
                alert('Prayer title cannot be empty.');
                return;
            }

            const newPrayer = {
                id: generateId(),
                title: title,
                description: description, // Initial description
                isAnswered: false,
                dateAdded: getCurrentISODate(),
                dateAnswered: null,
            };

            // Feature 2: Add Creation Log
            const creationDate = formatISODate(newPrayer.dateAdded, 'YYYY-MM-DD');
            const creationLog = `Prayer added on ${creationDate}.`;
            if (newPrayer.description) {
                newPrayer.description = creationLog + '\n' + newPrayer.description;
            } else {
                newPrayer.description = creationLog;
            }

            // Add to the beginning of the array for newest first
            this.prayers.unshift(newPrayer);
            this.prayers = [...this.prayers]; // Explicitly trigger reactivity

            // Clear input fields
            this.newPrayerTitle = '';
            this.newPrayerDescription = '';
        },

        toggleAnswered(prayerId) {
            const prayerIndex = this.prayers.findIndex(p => p.id === prayerId);
            if (prayerIndex > -1) {
                const prayer = this.prayers[prayerIndex];
                const changingToAnswered = !prayer.isAnswered; // Check if we are marking as answered

                prayer.isAnswered = changingToAnswered;
                prayer.dateAnswered = prayer.isAnswered ? getCurrentISODate() : null;

                // Feature 1: Answered Prayer Description
                if (prayer.isAnswered) {
                    const answerDesc = window.prompt("How was this prayer answered?");
                    if (answerDesc && answerDesc.trim() !== '') {
                        const answeredDateFormatted = formatISODate(prayer.dateAnswered, 'YYYY-MM-DD');
                        const answerLog = `\n---\nAnswered on ${answeredDateFormatted}: ${answerDesc.trim()}`;
                        // Ensure description exists before appending
                        prayer.description = (prayer.description || '') + answerLog;
                    }
                }
                // else: If marking as unanswered, we don't need to remove the log,
                // it serves as a historical record within the description.

                // Trigger reactivity by replacing the item or the array
                // A deep watcher should handle this, but explicit update can be safer
                this.prayers = [...this.prayers];
            }
        },

        startEditing(prayer) {
            // Clone the prayer object to avoid modifying the original directly
            this.editingPrayer = { ...prayer };
            this.editTitle = prayer.title;
            this.editDescription = prayer.description;
        },

        saveEdit() {
            if (!this.editingPrayer) return;

            const title = this.editTitle.trim();
            if (!title) {
                alert('Prayer title cannot be empty.');
                return;
            }

            const prayerIndex = this.prayers.findIndex(p => p.id === this.editingPrayer.id);
            if (prayerIndex > -1) {
                this.prayers[prayerIndex].title = title;
                this.prayers[prayerIndex].description = this.editDescription.trim();
                // Trigger reactivity
                this.prayers = [...this.prayers];
            }
            this.cancelEdit(); // Clear editing state
        },

        cancelEdit() {
            this.editingPrayer = null;
            this.editTitle = '';
            this.editDescription = '';
        },

        deletePrayer(prayerId) {
            if (confirm('Are you sure you want to delete this prayer?')) {
                this.prayers = this.prayers.filter(p => p.id !== prayerId);
            }
        },

        deleteAllAnswered() {
            if (confirm('Are you sure you want to delete ALL answered prayers? This cannot be undone.')) {
                this.prayers = this.prayers.filter(p => !p.isAnswered);
            }
        }, // Correct closing brace for deleteAllAnswered

        // Feature 3: Log when prayed for
        logPrayerPrayed(prayerId) {
            const prayerIndex = this.prayers.findIndex(p => p.id === prayerId);
            if (prayerIndex > -1) {
                const prayer = this.prayers[prayerIndex];
                const prayedDate = formatISODate(getCurrentISODate(), 'YYYY-MM-DD');
                const prayedLog = `\nPrayed for on ${prayedDate}.`;
                // Ensure description exists before appending
                prayer.description = (prayer.description || '') + prayedLog;
                // Trigger reactivity
                this.prayers = [...this.prayers];
            }
        }, // Added closing brace and comma here

        // Utility for formatting dates in the template
        formatDate(isoDateString, format = 'MM/DD/YYYY') {
            return formatISODate(isoDateString, format);
        },

        // Set the current view filter
        setView(view) {
            this.currentView = view;
        },

        // Helper to check if a view is active for styling tabs
        isViewActive(view) {
            return this.currentView === view;
        }
,

        // Import/Export Functionality
        exportPrayers() {
            try {
                const dataStr = JSON.stringify(this.prayers, null, 2); // Pretty print JSON
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'prayers_backup.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error exporting prayers:', error);
                alert('Failed to export prayers. See console for details.');
            }
        },

        importPrayers() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const importedPrayers = JSON.parse(event.target.result);
                        // Basic validation: check if it's an array
                        if (Array.isArray(importedPrayers)) {
                            // Optional: Add more robust validation here (check prayer structure)
                            const merge = window.confirm('Click OK to merge imported prayers with existing ones.\nClick Cancel to replace all current prayers.');
                            if (merge) {
                                const existingPrayers = this.prayers;
                                const existingIds = new Map();
                                existingPrayers.forEach(prayer => existingIds.set(prayer.id, prayer));

                                const mergedPrayers = [...existingPrayers];

                                importedPrayers.forEach(importedPrayer => {
                                    // Basic validation for imported prayer structure
                                    if (typeof importedPrayer !== 'object' || importedPrayer === null || !importedPrayer.id || typeof importedPrayer.title !== 'string') {
                                        console.warn('Skipping invalid prayer object during import:', importedPrayer);
                                        return; // Skip this invalid entry
                                    }

                                    const existingPrayer = existingIds.get(importedPrayer.id);
                                    if (!existingPrayer) {
                                        mergedPrayers.push(importedPrayer);
                                    } else {
                                        // Check if titles are different to decide on merging with new ID
                                        if (existingPrayer.title !== importedPrayer.title) {
                                            // Generate new unique ID using the imported function
                                            importedPrayer.id = generateId();
                                            mergedPrayers.push(importedPrayer);
                                        } // else: If ID and title match, skip (assume duplicate)
                                    }
                                });

                                this.prayers = mergedPrayers;
                            } else {
                                // Replace: Basic validation before replacing
                                const validImportedPrayers = importedPrayers.filter(p =>
                                    typeof p === 'object' && p !== null && p.id && typeof p.title === 'string'
                                );
                                if (validImportedPrayers.length !== importedPrayers.length) {
                                    alert('Some imported prayers had invalid format and were skipped during replacement.');
                                }
                                this.prayers = validImportedPrayers;
                            }
                            // Save and trigger reactivity (savePrayers is already watched)
                            this.prayers = [...this.prayers]; // Trigger reactivity explicitly
                            alert('Prayers imported successfully!');
                        } else {
                            alert('Invalid file format. Please select a valid JSON array file exported from this app.');
                        }
                    } catch (error) {
                        console.error('Error parsing JSON file:', error);
                        alert('Error reading or parsing the file. Please ensure it is a valid JSON file.');
                    }
                };
                reader.onerror = error => {
                    console.error('Error reading file:', error);
                    alert('Error reading the file.');
                };
                reader.readAsText(file);
            };
            input.click();
        }
    };
}

export default prayerApp;