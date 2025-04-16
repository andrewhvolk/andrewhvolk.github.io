// PrayerAppV2/__tests__/prayerStore.test.js

// Mock Firebase Firestore functions
import { 
  getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, 
  onSnapshot, writeBatch, query, where, getDocs 
} from '../js/firebaseInit.js';

// Mock other stores
import { authStore } from '../js/authStore.js';
import { setError, setNotification, clearMessages } from '../js/viewStore.js';

jest.mock('../js/firebaseInit.js', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  writeBatch: jest.fn(() => ({
    delete: jest.fn(),
    commit: jest.fn()
  })),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn()
}));

jest.mock('../js/authStore.js', () => ({
  authStore: {
    getCurrentUserId: jest.fn(),
    currentUser: null
  }
}));

jest.mock('../js/viewStore.js', () => ({
  setError: jest.fn(),
  setNotification: jest.fn(),
  clearMessages: jest.fn()
}));

// Import the store to test
import { prayerStore } from '../js/prayerStore.js';

describe('prayerStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    authStore.getCurrentUserId.mockReturnValue('test-user-123');
    getFirestore.mockReturnValue({});
  });

  describe('addPrayer', () => {
    it('should add a prayer with correct data', async () => {
      const testData = { title: 'Test Prayer', description: 'Test description' };
      const mockDocRef = { id: 'new-prayer-id' };
      addDoc.mockResolvedValue(mockDocRef);

      const result = await prayerStore.addPrayer(testData);

      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), {
        ...testData,
        userId: 'test-user-123',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        isAnswered: false
      });
      expect(setNotification).toHaveBeenCalledWith('Prayer added successfully');
      expect(result).toBe('new-prayer-id');
    });

    it('should handle errors when adding prayer', async () => {
      const testError = new Error('Firestore error');
      addDoc.mockRejectedValue(testError);

      await expect(prayerStore.addPrayer({})).rejects.toThrow(testError);
      expect(setError).toHaveBeenCalledWith('Prayer operation failed. Please try again.');
    });
  });

  describe('updatePrayer', () => {
    it('should update a prayer with correct data', async () => {
      const testId = 'prayer-123';
      const testUpdates = { title: 'Updated Prayer' };
      updateDoc.mockResolvedValue();

      await prayerStore.updatePrayer(testId, testUpdates);

      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
        ...testUpdates,
        updatedAt: expect.any(String)
      });
      expect(setNotification).toHaveBeenCalledWith('Prayer updated successfully');
    });
  });

  describe('deletePrayer', () => {
    it('should delete a prayer', async () => {
      const testId = 'prayer-123';
      deleteDoc.mockResolvedValue();

      await prayerStore.deletePrayer(testId);

      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
      expect(setNotification).toHaveBeenCalledWith('Prayer deleted successfully');
    });
  });

  describe('deleteAllAnswered', () => {
    it('should delete all answered prayers', async () => {
      const mockQuerySnapshot = {
        size: 2,
        forEach: jest.fn()
      };
      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await prayerStore.deleteAllAnswered();

      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith(
        expect.any(Object),
        where('userId', '==', 'test-user-123'),
        where('isAnswered', '==', true)
      );
      expect(setNotification).toHaveBeenCalledWith('All answered prayers deleted successfully');
      expect(result).toBe(2);
    });
  });

  describe('initializePrayersListener', () => {
    it('should set up real-time listener', () => {
      const mockUnsubscribe = jest.fn();
      onSnapshot.mockReturnValue(mockUnsubscribe);

      prayerStore.initializePrayersListener();

      expect(query).toHaveBeenCalledWith(
        expect.any(Object),
        where('userId', '==', 'test-user-123')
      );
      expect(onSnapshot).toHaveBeenCalledTimes(1);
    });
  });

  // Additional tests for exportPrayers, importPrayers, handlePrayerError, cleanup
  // would follow the same pattern
});