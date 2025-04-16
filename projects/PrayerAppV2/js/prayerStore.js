// PrayerAppV2/js/prayerStore.js
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, writeBatch, query, where, getDocs } from './firebaseInit.js';
import { setError, setNotification, clearMessages } from './viewStore.js';
import { authStore } from './authStore.js';

const db = getFirestore();
const prayersCollection = 'prayers';

export const prayerStore = {
  prayers: [],
  unsubscribe: null,

  async addPrayer(prayerData) {
    try {
      clearMessages();
      const userId = authStore.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, prayersCollection), {
        ...prayerData,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAnswered: false
      });
      setNotification('Prayer added successfully');
      return docRef.id;
    } catch (error) {
      this.handlePrayerError(error);
      throw error;
    }
  },

  async updatePrayer(prayerId, updates) {
    try {
      clearMessages();
      const userId = authStore.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const prayerRef = doc(db, prayersCollection, prayerId);
      await updateDoc(prayerRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setNotification('Prayer updated successfully');
    } catch (error) {
      this.handlePrayerError(error);
      throw error;
    }
  },

  async deletePrayer(prayerId) {
    try {
      clearMessages();
      const userId = authStore.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const prayerRef = doc(db, prayersCollection, prayerId);
      await deleteDoc(prayerRef);
      setNotification('Prayer deleted successfully');
    } catch (error) {
      this.handlePrayerError(error);
      throw error;
    }
  },

  async deleteAllAnswered() {
    try {
      clearMessages();
      const userId = authStore.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const batch = writeBatch(db);
      const q = query(
        collection(db, prayersCollection),
        where('userId', '==', userId),
        where('isAnswered', '==', true)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setNotification('All answered prayers deleted successfully');
      return querySnapshot.size;
    } catch (error) {
      this.handlePrayerError(error);
      throw error;
    }
  },

  initializePrayersListener() {
    const userId = authStore.getCurrentUserId();
    if (!userId) return;

    if (this.unsubscribe) {
      this.unsubscribe();
    }

    const q = query(
      collection(db, prayersCollection),
      where('userId', '==', userId)
    );

    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.prayers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  },

  async exportPrayers() {
    try {
      clearMessages();
      const userId = authStore.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const q = query(
        collection(db, prayersCollection),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const prayersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return JSON.stringify(prayersData, null, 2);
    } catch (error) {
      this.handlePrayerError(error);
      throw error;
    }
  },

  async importPrayers(jsonData) {
    try {
      clearMessages();
      const userId = authStore.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const prayersData = JSON.parse(jsonData);
      let importedCount = 0;

      for (const prayer of prayersData) {
        // Skip if prayer already exists
        const exists = this.prayers.some(p => p.id === prayer.id);
        if (exists) continue;

        await addDoc(collection(db, prayersCollection), {
          ...prayer,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        importedCount++;
      }

      setNotification(`Imported ${importedCount} prayers successfully`);
      return importedCount;
    } catch (error) {
      this.handlePrayerError(error);
      throw error;
    }
  },

  handlePrayerError(error) {
    let errorMessage = 'Prayer operation failed. Please try again.';
    
    if (error.message.includes('permission-denied')) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.message.includes('not-found')) {
      errorMessage = 'Prayer not found. It may have been deleted.';
    }

    setError(errorMessage);
  },

  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.prayers = [];
  }
};