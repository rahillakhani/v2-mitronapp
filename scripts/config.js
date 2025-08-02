import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

// Utility functions
export const createTimestamp = () => admin.firestore.Timestamp.now();

export const generateId = () => db.collection('temp').doc().id;

export const batchWrite = async (operations) => {
  const batchSize = 500;
  const batches = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = db.batch();
    const batchOps = operations.slice(i, i + batchSize);
    
    batchOps.forEach(op => {
      switch (op.type) {
        case 'set':
          batch.set(op.ref, op.data);
          break;
        case 'update':
          batch.update(op.ref, op.data);
          break;
        case 'delete':
          batch.delete(op.ref);
          break;
      }
    });
    
    batches.push(batch.commit());
  }
  
  await Promise.all(batches);
};

export const logger = {
  info: (message) => console.log(`ℹ️  ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  error: (message) => console.error(`❌ ${message}`),
  warn: (message) => console.warn(`⚠️  ${message}`),
};
