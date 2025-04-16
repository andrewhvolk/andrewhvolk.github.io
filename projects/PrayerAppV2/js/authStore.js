// PrayerAppV2/js/authStore.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebaseInit.js';
import { setError, setNotification, clearMessages } from './viewStore.js';

const auth = getAuth();

export const authStore = {
  currentUser: null,

  async signUp(email, password) {
    try {
      clearMessages();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;
      setNotification('Sign up successful! Welcome.');
      return userCredential;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  },

  async signIn(email, password) {
    try {
      clearMessages();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;
      setNotification('Sign in successful! Welcome back.');
      return userCredential;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  },

  async signOutUser() {
    try {
      clearMessages();
      await signOut(auth);
      this.currentUser = null;
      setNotification('Signed out successfully.');
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  },

  getCurrentUserId() {
    return this.currentUser?.uid || null;
  },

  initializeAuthListener() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        setNotification('Welcome back!');
      }
    });
  },

  handleAuthError(error) {
    let errorMessage = 'Authentication failed. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already in use.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password.';
        break;
    }

    setError(errorMessage);
  }
};