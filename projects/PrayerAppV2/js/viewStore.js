// PrayerAppV2/js/viewStore.js
import { prayerStore } from './prayerStore.js';
import { authStore } from './authStore.js';

export const viewStore = {
  // UI State
  isLoading: false,
  currentView: 'all', // 'all', 'answered', 'unanswered'
  activeForm: null, // 'new', 'edit'
  formData: {
    title: '',
    description: '',
    isAnswered: false
  },
  editPrayerId: null,

  // Notification System
  notification: null,
  error: null,
  confirmation: null,

  // View Management
  getFilteredPrayers() {
    switch (this.currentView) {
      case 'answered':
        return prayerStore.prayers.filter(prayer => prayer.isAnswered);
      case 'unanswered':
        return prayerStore.prayers.filter(prayer => !prayer.isAnswered);
      default:
        return prayerStore.prayers;
    }
  },

  // Form Handling
  openNewPrayerForm() {
    this.activeForm = 'new';
    this.formData = {
      title: '',
      description: '',
      isAnswered: false
    };
  },

  openEditPrayerForm(prayer) {
    this.activeForm = 'edit';
    this.editPrayerId = prayer.id;
    this.formData = {
      title: prayer.title,
      description: prayer.description,
      isAnswered: prayer.isAnswered
    };
  },

  closeForm() {
    this.activeForm = null;
    this.editPrayerId = null;
    this.formData = {
      title: '',
      description: '',
      isAnswered: false
    };
  },

  async submitForm() {
    try {
      this.isLoading = true;
      
      if (this.activeForm === 'new') {
        await prayerStore.addPrayer(this.formData);
      } else if (this.activeForm === 'edit') {
        await prayerStore.updatePrayer(this.editPrayerId, this.formData);
      }

      this.closeForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      this.isLoading = false;
    }
  },

  // Notification System
  setNotification(message) {
    this.notification = message;
    this.error = null;
    setTimeout(() => this.clearMessages(), 5000);
  },

  setError(message) {
    this.error = message;
    this.notification = null;
    setTimeout(() => this.clearMessages(), 5000);
  },

  clearMessages() {
    this.notification = null;
    this.error = null;
  },

  // Confirmation Dialogs
  showConfirmation(message, action) {
    this.confirmation = {
      message,
      action: () => {
        action();
        this.confirmation = null;
      }
    };
  },

  cancelConfirmation() {
    this.confirmation = null;
  },

  // View Management
  setView(view) {
    this.currentView = view;
  },

  // Initialization
  initialize() {
    // Set up any initial state or listeners
  },

  // Cleanup
  cleanup() {
    this.clearMessages();
    this.confirmation = null;
    this.activeForm = null;
    this.editPrayerId = null;
  }
};