import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { getAnalytics, Analytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { firebaseConfig } from './app';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let messaging: Messaging | null = null;
let analytics: Analytics | null = null;

// Initialize Firebase
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Initialize Firebase Cloud Messaging (only in supported environments)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

// Initialize Firebase Analytics (only in supported environments and production)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Check if already connected to emulators
  if (!auth.config.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  
  // @ts-ignore - _delegate is internal but needed to check connection
  if (!db._delegate._settings?.host?.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  
  // @ts-ignore - _delegate is internal but needed to check connection
  if (!storage._delegate._host?.includes('localhost')) {
    connectStorageEmulator(storage, 'localhost', 9199);
  }
}

export { app, auth, db, storage, messaging, analytics };

// Re-export Firebase functions for convenience
export {
  // Auth
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
} from 'firebase/auth';

export {
  // Firestore
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';

export {
  // Storage
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';

export {
  // Messaging
  getToken,
  onMessage,
} from 'firebase/messaging';

export {
  // Analytics
  logEvent,
  setUserProperties,
  setUserId,
} from 'firebase/analytics';
