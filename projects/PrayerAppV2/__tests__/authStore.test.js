// PrayerAppV2/__tests__/authStore.test.js

// Mock Firebase Auth functions
// Import the mocked functions we need to check
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// Import mocked viewStore functions
import { setError, setNotification, clearMessages } from '../js/viewStore';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ // Mock getAuth to return an object
      // Add any properties/methods needed by authStore if it uses the auth instance directly
  })),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock viewStore (assuming a similar structure or needing mocks later)
// Replace with actual path if viewStore exists and is used
// Mock viewStore - keep the mock factory but also import the mocks
jest.mock('./viewStore', () => ({ // Align mock path with implementation import
  setError: jest.fn(),
  setNotification: jest.fn(),
  clearMessages: jest.fn(),
}), { virtual: true });

// Attempt to import the non-existent authStore
// This import will fail initially, which is expected in TDD.
import { authStore } from '../js/authStore';

describe('authStore', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getAuth return value for each test if needed
    getAuth.mockReturnValue({});
  });

  // Placeholder test to ensure the suite runs
  it('should be defined (placeholder)', () => {
    // This test will fail until authStore.js is created and exports authStore
    expect(authStore).toBeDefined();
  });

  // --- signUp Tests ---
  describe('signUp', () => {
    it('should be a function', () => {
      expect(typeof authStore.signUp).toBe('function');
    });

    it('should call createUserWithEmailAndPassword and notify on success', async () => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      const mockUserCredential = { user: { uid: 'test-uid' } };

      // Mock Firebase function to resolve successfully
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      await authStore.signUp(testEmail, testPassword);

      // Check if Firebase function was called correctly
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      // Note: getAuth() needs to be mocked to return *something* if authStore uses it
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), testEmail, testPassword); // Pass the mocked auth instance

      // Check if viewStore functions were called
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledWith('Sign up successful! Welcome.');
      expect(setError).not.toHaveBeenCalled(); // Ensure error handler wasn't called
    });

    it('should call setError on failure', async () => {
      const testEmail = 'fail@example.com';
      const testPassword = 'badpassword';
      const mockError = new Error('Firebase: Error (auth/email-already-in-use).');
      mockError.code = 'auth/email-already-in-use'; // Add code for potential specific handling

      // Mock Firebase function to reject
      createUserWithEmailAndPassword.mockRejectedValue(mockError);

      await authStore.signUp(testEmail, testPassword);

      // Check if Firebase function was called correctly
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), testEmail, testPassword);

      // Check if viewStore functions were called
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith(mockError.message); // Check if the correct error message was passed
      expect(setNotification).not.toHaveBeenCalled(); // Ensure success handler wasn't called
    });
  });

  // --- signIn Tests ---
  describe('signIn', () => {
    it('should be a function', () => {
      expect(typeof authStore.signIn).toBe('function');
    });

    it('should call signInWithEmailAndPassword and notify on success', async () => {
      const testEmail = 'login@example.com';
      const testPassword = 'password123';
      const mockUserCredential = { user: { uid: 'test-uid-login' } };

      // Mock Firebase function to resolve successfully
      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      await authStore.signIn(testEmail, testPassword);

      // Check if Firebase function was called correctly
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), testEmail, testPassword);

      // Check if viewStore functions were called
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledWith('Sign in successful! Welcome back.');
      expect(setError).not.toHaveBeenCalled();
    });

    it('should call setError on failure', async () => {
      const testEmail = 'login@example.com';
      const testPassword = 'wrongpassword';
      const mockError = new Error('Firebase: Error (auth/wrong-password).');
      mockError.code = 'auth/wrong-password';

      // Mock Firebase function to reject
      signInWithEmailAndPassword.mockRejectedValue(mockError);

      await authStore.signIn(testEmail, testPassword);

      // Check if Firebase function was called correctly
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), testEmail, testPassword);

      // Check if viewStore functions were called
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith(mockError.message);
      expect(setNotification).not.toHaveBeenCalled();
    });
  });

  // --- signOutUser Tests ---
  describe('signOutUser', () => {
    it('should be a function', () => {
      expect(typeof authStore.signOutUser).toBe('function');
    });

    it('should call signOut and notify on success', async () => {
      // Mock Firebase function to resolve successfully
      signOut.mockResolvedValue();

      await authStore.signOutUser();

      // Check if Firebase function was called correctly
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(signOut).toHaveBeenCalledWith(expect.any(Object)); // Pass the mocked auth instance

      // Check if viewStore functions were called
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledWith('Signed out successfully.');
      expect(setError).not.toHaveBeenCalled();
    });

    it('should call setError on failure', async () => {
      const mockError = new Error('Firebase: Error (auth/sign-out-failed).');
      mockError.code = 'auth/sign-out-failed';

      // Mock Firebase function to reject
      signOut.mockRejectedValue(mockError);

      await authStore.signOutUser();

      // Check if Firebase function was called correctly
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(signOut).toHaveBeenCalledWith(expect.any(Object));

      // Check if viewStore functions were called
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith(mockError.message);
      expect(setNotification).not.toHaveBeenCalled();
    });
  });

  // --- getCurrentUserId Tests ---
  describe('getCurrentUserId', () => {
    it('should be a function', () => {
      expect(typeof authStore.getCurrentUserId).toBe('function');
    });

    it('should return the current user ID when logged in', () => {
      const testUid = 'test-user-123';
      // Mock current user
      getAuth.mockReturnValue({
        currentUser: { uid: testUid }
      });

      const result = authStore.getCurrentUserId();
      expect(result).toBe(testUid);
    });

    it('should return null when no user is logged in', () => {
      // Mock no current user
      getAuth.mockReturnValue({
        currentUser: null
      });

      const result = authStore.getCurrentUserId();
      expect(result).toBeNull();
    });
  });

  // --- initializeAuthListener Tests ---
  describe('initializeAuthListener', () => {
    it('should be a function', () => {
      expect(typeof authStore.initializeAuthListener).toBe('function');
    });

    // Add success/failure tests later
  });

  // We will add specific tests for handleAuthError, etc., in subsequent steps.

  // --- Password Reset Tests ---
  describe('sendPasswordResetEmail', () => {
    it('should be a function', () => {
      expect(typeof authStore.sendPasswordResetEmail).toBe('function');
    });

    it('should call sendPasswordResetEmail and notify on success', async () => {
      const testEmail = 'reset@example.com';
      sendPasswordResetEmail.mockResolvedValue();

      await authStore.sendPasswordResetEmail(testEmail);

      expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.any(Object), testEmail);
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenCalledWith('Password reset email sent. Check your inbox.');
      expect(setError).not.toHaveBeenCalled();
    });

    it('should call setError on failure', async () => {
      const testEmail = 'invalid@example.com';
      const mockError = new Error('Firebase: Error (auth/user-not-found).');
      mockError.code = 'auth/user-not-found';
      sendPasswordResetEmail.mockRejectedValue(mockError);

      await authStore.sendPasswordResetEmail(testEmail);

      expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.any(Object), testEmail);
      expect(clearMessages).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith('No account found with this email.');
      expect(setNotification).not.toHaveBeenCalled();
    });
  });

  // --- Auth Persistence Tests ---
  describe('auth persistence', () => {
    it('should persist auth state across reloads', () => {
      const testUid = 'persistent-user-123';
      // Mock current user
      getAuth.mockReturnValue({
        currentUser: { uid: testUid }
      });

      // Simulate page reload by re-initializing authStore
      const newAuthStore = require('../js/authStore').authStore;
      newAuthStore.initializeAuthListener();

      expect(newAuthStore.getCurrentUserId()).toBe(testUid);
    });
  });

  // --- Concurrent Auth Tests ---
  describe('concurrent auth attempts', () => {
    it('should handle concurrent signIn attempts', async () => {
      const testEmail = 'concurrent@example.com';
      const testPassword = 'password123';
      const mockUserCredential = { user: { uid: 'concurrent-uid' } };

      // First call resolves after delay
      signInWithEmailAndPassword.mockImplementationOnce(() =>
        new Promise(resolve => setTimeout(() => resolve(mockUserCredential), 100))
      );
      // Second call rejects immediately
      signInWithEmailAndPassword.mockImplementationOnce(() =>
        Promise.reject(new Error('Firebase: Error (auth/too-many-requests).'))
      );

      const promise1 = authStore.signIn(testEmail, testPassword);
      const promise2 = authStore.signIn(testEmail, testPassword);

      await Promise.all([promise1, promise2]);

      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(2);
      expect(setError).toHaveBeenCalledTimes(1);
    });
  });

  // --- Error Logging Tests ---
  describe('error logging', () => {
    it('should log unknown auth errors', () => {
      const mockError = new Error('Unknown error');
      mockError.code = 'auth/unknown-error';

      authStore.handleAuthError(mockError);

      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith('Authentication failed. Please try again.');
    });

    it('should log all error properties for debugging', () => {
      const mockError = new Error('Detailed error');
      mockError.code = 'auth/detailed-error';
      mockError.details = { field: 'email' };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      authStore.handleAuthError(mockError);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Auth error details:', mockError);
      consoleSpy.mockRestore();
    });
  });
});