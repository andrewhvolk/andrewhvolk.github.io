// Import stores
import { authStore } from './authStore.js';
import { prayerStore } from './prayerStore.js';
import { viewStore } from './viewStore.js';

// Import date utility functions
import { getCurrentISODate, formatISODate } from './dateUtils.js';

function prayerApp() {
    return {
        // --- State Variables ---
        newPrayerTitle: '',
        newPrayerDescription: '',
        email: '',              // Bound to login/signup email input
        password: '',           // Bound to login/signup password input

        // --- Store References ---
        authStore,
        prayerStore,
        viewStore,

        // --- Initialization ---
        init() {
            console.log("Alpine component initializing...");
            // Initialize auth listener
            authStore.initializeAuthListener();
            
            // React to auth changes
            this.$watch('authStore.currentUser', (user) => {
                if (user) {
                    console.log("User logged in:", user.uid);
                    prayerStore.initializePrayersListener();
                } else {
                    console.log("User logged out");
                    prayerStore.cleanup();
                }
            });
        },

                // --- Computed Property ---
                // Filters prayers based on the current view ('all', 'unanswered', 'answered')
                get filteredPrayers() {
                    return viewStore.getFilteredPrayers();
                },
        // --- Authentication Methods ---
        signUp() {
            if (!this.email || !this.password) {
                viewStore.setError("Please enter both email and password.");
                return;
            }
            authStore.signUp(this.email, this.password)
                .then(() => {
                    this.email = '';
                    this.password = '';
                })
                .catch(() => {
                    // Error handled by authStore
                });
        },

        logIn() {
            if (!this.email || !this.password) {
                viewStore.setError("Please enter both email and password.");
                return;
            }
            authStore.signIn(this.email, this.password)
                .then(() => {
                    this.email = '';
                    this.password = '';
                })
                .catch(() => {
                    // Error handled by authStore
                });
        },

        logOut() {
            authStore.signOutUser()
                .catch(() => {
                    // Error handled by authStore
                });
        },

        // --- Prayer Methods ---
        async addPrayer() {
            const title = this.newPrayerTitle.trim();
            const description = this.newPrayerDescription.trim();

            if (!title) {
                viewStore.setError('Prayer title cannot be empty.');
                return;
            }

            try {
                await prayerStore.addPrayer({
                    title,
                    description,
                    isAnswered: false
                });
                this.newPrayerTitle = '';
                this.newPrayerDescription = '';
            } catch (error) {
                // Error handled by prayerStore
            }
        },
        /**
         * Toggles the 'isAnswered' status of a prayer using prayerStore.
         * Prompts for description if marking as answered.
         * @param {string} prayerId - The prayer document ID.
         */
        async toggleAnswered(prayerId) {
            try {
                const answerDesc = window.prompt("How was this prayer answered?");
                await prayerStore.updatePrayer(prayerId, {
                    isAnswered: true,
                    answerDescription: answerDesc || '',
                    dateAnswered: getCurrentISODate()
                });
            } catch (error) {
                // Error handled by prayerStore
            }
        },

        /**
         * Sets the component state to start editing a specific prayer.
         * @param {object} prayer - The prayer object to edit.
         */
        startEditing(prayer) {
            this.editingPrayer = { ...prayer };
            this.editTitle = prayer.title;
            this.editDescription = prayer.description;
        },

        /**
         * Saves the edited prayer using prayerStore.
         */
        async saveEdit() {
            if (!this.editingPrayer) {
                console.warn("Save edit called without active edit.");
                return;
            }

            const title = this.editTitle.trim();
            const description = this.editDescription.trim();

            if (!title) {
                viewStore.setError('Prayer title cannot be empty.');
                return;
            }

            try {
                await prayerStore.updatePrayer(this.editingPrayer.id, {
                    title,
                    description,
                    lastEditedDate: getCurrentISODate()
                });
                this.cancelEdit();
            } catch (error) {
                // Error handled by prayerStore
            }
        },

        /**
         * Cancels the editing process, resetting edit-related state.
         */
        cancelEdit() {
            this.editingPrayer = null;
            this.editTitle = '';
            this.editDescription = '';
        },

        /**
         * Deletes a prayer using prayerStore.
         * @param {string} prayerId - The prayer document ID to delete.
         */
        async deletePrayer(prayerId) {
            viewStore.showConfirmation(
                'Are you sure you want to delete this prayer? This cannot be undone.',
                async () => {
                    try {
                        await prayerStore.deletePrayer(prayerId);
                        if (this.editingPrayer && this.editingPrayer.id === prayerId) {
                            this.cancelEdit();
                        }
                    } catch (error) {
                        // Error handled by prayerStore
                    }
                }
            );
        },

        /**
         * Appends a "Prayed for on [date]" log to the prayer's description in Firestore.
         * @param {string} prayerId - The Firestore document ID of the prayer.
         */
        async logPrayerPrayed(prayerId) {
            try {
                const prayedDate = formatISODate(getCurrentISODate(), 'YYYY-MM-DD');
                const prayedLog = `\nPrayed for on ${prayedDate}.`;
                await prayerStore.updatePrayer(prayerId, {
                    prayedLog
                });
            } catch (error) {
                // Error handled by prayerStore
            }
        },

        /**
         * TODO: Implement Firestore deletion for all answered prayers.
         * This requires querying Firestore for answered prayers in the shared group
         * and then deleting them, potentially using Batched Writes for efficiency.
         */
        async deleteAllAnswered() {
            if (!this.currentUser) {
                 alert('You must be logged in to delete prayers.');
                 return;
            }
            if (!confirm('Are you sure you want to delete ALL answered prayers in this shared list? This cannot be undone.')) {
                return;
            }

            console.warn("deleteAllAnswered functionality needs Firestore implementation.");
            alert("Sorry, deleting all answered prayers is not implemented yet.");

            // --- Firestore Implementation Outline ---
            // 1. Get sharedPrayerGroupId
            // 2. Create a query: collection(db, path), where("isAnswered", "==", true)
            // 3. Get the documents matching the query (getDocs)
            // 4. Create a WriteBatch (writeBatch(db))
            // 5. Iterate through the docs snapshot, add each doc reference to the batch delete (batch.delete(doc.ref))
            // 6. Commit the batch (await batch.commit())
            // 7. Add try/catch for error handling.
            // Be mindful of batch size limits if you expect hundreds/thousands of answered prayers.
        },


        // --- Utility & View Methods (Mostly unchanged) ---

        // Utility for formatting dates in the template
        formatDate(isoDateString, format = 'MM/DD/YYYY') {
            // Ensure dateUtils function is available
            return typeof formatISODate === 'function' ? formatISODate(isoDateString, format) : (isoDateString || 'N/A');
        },

        // Set the current view filter
        setView(view) {
            this.currentView = view;
        },

        // Helper to check if a view is active for styling tabs
        isViewActive(view) {
            return this.currentView === view;
        },

        // --- Import/Export (Legacy - Use with caution) ---
        // These functions now only operate on the *local* 'prayers' array snapshot.
        // They DO NOT interact with Firestore and are NOT suitable for sharing data.
        // They might be useful for creating a personal, local backup.
        exportPrayers() {
            console.warn("Exporting prayers only includes the current local snapshot, not live Firestore data.");
            if (this.prayers.length === 0) {
                alert("No prayers to export.");
                return;
            }
            try {
                // Add metadata about the export time/user?
                const exportData = {
                    exportedAt: getCurrentISODate(),
                    exportedBy: this.currentUser ? this.currentUser.email : 'unknown',
                    prayers: this.prayers // Export the current local array
                };
                const dataStr = JSON.stringify(exportData, null, 2); // Pretty print JSON
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `prayers_backup_${formatISODate(getCurrentISODate(), 'YYYYMMDD_HHmmss')}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error exporting prayers:', error);
                alert('Failed to export prayers. See console for details.');
            }
        },

        /**
         * Imports prayers from a JSON file into the *local* Alpine state.
         * WARNING: This DOES NOT save the imported prayers to Firestore.
         * It's primarily for restoring a personal backup locally and will be
         * overwritten if the page reloads and fetches from Firestore again.
         * Consider disabling or removing this if it causes confusion.
         */
        importPrayers() {
             console.warn("Importing prayers only affects the local view and does NOT save to Firestore.");
             alert("Warning: Importing prayers only loads them locally and does not save them to the shared list. This feature may be removed or changed.");

             // The rest of the original import logic remains, but operates only on the local 'this.prayers'
             // It's disconnected from the authoritative Firestore data source.

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        let importedData = JSON.parse(event.target.result);
                        let importedPrayers = [];

                        // Check if the import file has the new structure with metadata
                        if (typeof importedData === 'object' && importedData !== null && Array.isArray(importedData.prayers)) {
                             importedPrayers = importedData.prayers;
                             console.log(`Imported prayers from backup dated: ${importedData.exportedAt || 'unknown'}`);
                        } else if (Array.isArray(importedData)) {
                            // Handle old format (just an array of prayers)
                            importedPrayers = importedData;
                             console.log("Imported prayers from legacy backup format.");
                        } else {
                             throw new Error("Invalid file format.");
                        }


                        // Basic validation: check if it's an array
                        if (Array.isArray(importedPrayers)) {
                            // Validate individual prayers minimally
                             const validImportedPrayers = importedPrayers.filter(p =>
                                typeof p === 'object' && p !== null && p.id && typeof p.title === 'string'
                             );
                             if (validImportedPrayers.length !== importedPrayers.length) {
                                alert('Some imported prayers had invalid format and were skipped during local import.');
                             }

                            // Ask user whether to merge or replace LOCAL data
                            const merge = confirm('Locally merge imported prayers with currently viewed prayers? (Does NOT save to shared list)\nClick Cancel to replace locally viewed prayers. (Does NOT save to shared list)');

                            if (merge) {
                                // Simple local merge based on ID
                                const existingIds = new Map(this.prayers.map(p => [p.id, p]));
                                validImportedPrayers.forEach(importedPrayer => {
                                    if (!existingIds.has(importedPrayer.id)) {
                                        this.prayers.push(importedPrayer); // Add locally if ID is new
                                    } else {
                                        // Optional: Update existing local entry? For now, just skip duplicates.
                                         console.log(`Skipping duplicate prayer ID during local merge: ${importedPrayer.id}`);
                                    }
                                });
                                // Manually trigger reactivity if needed (though direct push might work)
                                this.prayers = [...this.prayers];
                            } else {
                                // Replace local data
                                this.prayers = validImportedPrayers;
                            }
                            alert('Prayers imported locally! Remember, these changes are temporary and not saved to the shared list.');
                        } else {
                            alert('Invalid file format. Please select a valid JSON file exported from this app.');
                        }
                    } catch (error) {
                        console.error('Error parsing JSON file during import:', error);
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
        } // End importPrayers

    }; // End returned object
} // End prayerApp function

// Export the function for Alpine to use
export default prayerApp;
