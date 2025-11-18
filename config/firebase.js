// Firebase configuration for server-side (Admin SDK)
const admin = require('firebase-admin');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Admin SDK
if (!admin.apps.length) {
  try {
    // Try to use service account key if available (for production)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket
      });
      console.log('Firebase Admin initialized with service account');
    } else {
      // For development/deployment without service account key
      // This will use Firebase emulator or deployed environment credentials
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket
      });
      console.log('Firebase Admin initialized with project credentials');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    // If initialization fails, try a minimal setup
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
  firebaseConfig
};
