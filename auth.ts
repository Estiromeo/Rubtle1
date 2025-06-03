import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Default user plans
export const PLANS = {
  FREE: {
    name: 'Free',
    credits: 5,
    maxCharacters: 2000
  },
  STUDENT: {
    name: 'Student',
    credits: 30,
    maxCharacters: 20000
  },
  PROFESSIONAL: {
    name: 'Professional',
    credits: 100,
    maxCharacters: 20000
  }
};

// Sign up new users
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      planType: 'FREE',
      credits: PLANS.FREE.credits,
      maxCharacters: PLANS.FREE.maxCharacters,
      createdAt: new Date()
    });
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in existing users
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User document does not exist');
    }
  } catch (error) {
    throw error;
  }
};

// Update user credits
export const updateUserCredits = async (userId: string, newCredits: number) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      credits: newCredits
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user plan
export const updateUserPlan = async (userId: string, planType: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      planType: planType,
      credits: PLANS[planType as keyof typeof PLANS].credits,
      maxCharacters: PLANS[planType as keyof typeof PLANS].maxCharacters
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// Create test account
export const createTestAccount = async () => {
  try {
    const email = 'test@example.com';
    const password = 'test123456';
    
    // Check if user already exists
    try {
      await signIn(email, password);
      return { message: 'Test account already exists' };
    } catch (error) {
      // If user doesn't exist, create new account
      await signUp(email, password);
      return { message: 'Test account created successfully' };
    }
  } catch (error) {
    throw error;
  }
};