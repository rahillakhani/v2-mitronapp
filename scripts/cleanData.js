import { db, batchWrite, logger } from './config.js';

export const cleanData = async () => {
  logger.info('Starting to clean existing data...');
  
  const collections = [
    'users',
    'products', 
    'orders',
    'categories',
    'bikeModels',
    'reviews',
    'messages',
    'conversations',
    'notifications',
    'analytics'
  ];
  
  try {
    for (const collectionName of collections) {
      logger.info(`Cleaning collection: ${collectionName}`);
      
      // Get all documents in batches
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      if (snapshot.empty) {
        logger.info(`Collection ${collectionName} is already empty`);
        continue;
      }
      
      const operations = [];
      snapshot.docs.forEach(doc => {
        operations.push({
          type: 'delete',
          ref: doc.ref
        });
      });
      
      // Delete in batches
      await batchWrite(operations);
      logger.success(`Cleaned ${operations.length} documents from ${collectionName}`);
    }
    
    logger.success('Data cleaning completed successfully!');
    
  } catch (error) {
    logger.error(`Error cleaning data: ${error.message}`);
    throw error;
  }
};

export default cleanData;
