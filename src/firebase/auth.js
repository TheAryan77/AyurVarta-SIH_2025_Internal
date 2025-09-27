import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Auth state observer
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Sign up with email and password
export const createAuthUserWithEmailAndPassword = async (email, password, displayName, role) => {
  if (!email || !password) return;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await createUserDocumentFromAuth(user, { displayName, role });
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Create user document in Firestore
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  return userDocRef;
};

// Get user document from Firestore
export const getUserDocument = async (userAuth) => {
  if (!userAuth) return null;

  try {
    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);
    
    if (userSnapshot.exists()) {
      return {
        id: userSnapshot.id,
        ...userSnapshot.data()
      };
    }
  } catch (error) {
    console.error('Error getting user document:', error);
  }
  
  return null;
};

export default auth;
