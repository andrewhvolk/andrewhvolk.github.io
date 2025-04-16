// PrayerAppV2/__tests__/stores.integration.test.js

import { authStore } from '../js/authStore.js';
import { prayerStore } from '../js/prayerStore.js';
import { viewStore } from '../js/viewStore.js';

describe('Store Integration', () => {
  beforeEach(() => {
    // Reset all stores
    authStore.currentUser = null;
    prayerStore.cleanup();
    viewStore.cleanup();
  });

  describe('Authentication Flow', () => {
    it('should update prayerStore when user signs in', () => {
      // Simulate user signing in
      authStore.currentUser = { uid: 'test-user' };
      authStore.initializeAuthListener();
      
      // Verify prayerStore listener was initialized
      expect(prayerStore.unsubscribe).not.toBeNull();
    });

    it('should clear prayerStore when user signs out', async () => {
      // Setup initial state
      prayerStore.prayers = [{ id: '1', title: 'Test' }];
      prayerStore.unsubscribe = jest.fn();

      // Simulate user signing out
      await authStore.signOutUser();

      // Verify prayerStore was cleaned up
      expect(prayerStore.unsubscribe).toHaveBeenCalled();
      expect(prayerStore.prayers).toEqual([]);
    });
  });

  describe('Prayer Management Flow', () => {
    it('should update viewStore when prayer is added', async () => {
      // Setup mocks
      authStore.currentUser = { uid: 'test-user' };
      prayerStore.addPrayer = jest.fn().mockResolvedValue('new-id');

      // Simulate form submission
      viewStore.openNewPrayerForm();
      viewStore.formData = { title: 'New Prayer' };
      await viewStore.submitForm();

      // Verify prayer was added and viewStore updated
      expect(prayerStore.addPrayer).toHaveBeenCalled();
      expect(viewStore.activeForm).toBeNull();
      expect(viewStore.notification).toBeTruthy();
    });

    it('should show error in viewStore when prayer operation fails', async () => {
      // Setup mocks
      const testError = new Error('Test error');
      prayerStore.addPrayer = jest.fn().mockRejectedValue(testError);

      // Simulate form submission
      viewStore.openNewPrayerForm();
      await viewStore.submitForm();

      // Verify error was handled
      expect(viewStore.error).toBeTruthy();
    });
  });

  describe('Real-time Updates', () => {
    it('should update viewStore when prayers change', () => {
      // Setup mock listener
      const mockPrayers = [{ id: '1', title: 'Updated' }];
      prayerStore.initializePrayersListener = jest.fn((callback) => {
        prayerStore.prayers = mockPrayers;
      });

      // Initialize listener
      prayerStore.initializePrayersListener();

      // Verify viewStore reflects changes
      const filtered = viewStore.getFilteredPrayers();
      expect(filtered).toEqual(mockPrayers);
    });
  });

  describe('Error Handling', () => {
    it('should propagate auth errors to viewStore', async () => {
      const testError = new Error('Auth failed');
      authStore.signIn = jest.fn().mockRejectedValue(testError);

      await authStore.signIn('test@example.com', 'password');

      expect(viewStore.error).toBeTruthy();
    });

    it('should propagate prayer errors to viewStore', async () => {
      const testError = new Error('Prayer failed');
      prayerStore.addPrayer = jest.fn().mockRejectedValue(testError);

      await prayerStore.addPrayer({});

      expect(viewStore.error).toBeTruthy();
    });
  });
});