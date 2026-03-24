import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves an encrypted password entry to Firestore.
 *
 * @param {string} uid - The Firebase User ID
 * @param {string} encryptedPayload - The AES encrypted password data
 * @returns {Promise<string>} - The ID of the newly created document
 */
export const savePassword = async (uid, encryptedPayload) => {
  try {
    const docRef = await addDoc(collection(db, 'vaults'), {
      uid: uid,
      payload: encryptedPayload,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving password to Firestore: ", error);
    throw error;
  }
};

/**
 * Retrieves all encrypted password entries for a specific user from Firestore.
 *
 * @param {string} uid - The Firebase User ID
 * @returns {Promise<Array>} - Array of document objects containing the encrypted payloads
 */
export const getVault = async (uid) => {
  try {
    const q = query(
      collection(db, 'vaults'),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(q);
    const vaultEntries = [];

    querySnapshot.forEach((doc) => {
      vaultEntries.push({ id: doc.id, ...doc.data() });
    });

    // Sort by createdAt client-side since Firestore requires composite indexes for orderBy + where
    return vaultEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } catch (error) {
    console.error("Error fetching vault from Firestore: ", error);
    throw error;
  }
};
