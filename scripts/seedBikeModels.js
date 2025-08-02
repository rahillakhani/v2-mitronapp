import { db, createTimestamp, batchWrite, logger } from './config.js';
import { bikeMakes, bikeModels } from './seedHelpers.js';

export const seedBikeModels = async () => {
  logger.info('Starting to seed bike models...');
  
  const operations = [];
  
  try {
    for (const make of bikeMakes) {
      const models = bikeModels[make] || [`${make} Model`];
      
      for (const model of models) {
        // Create multiple years for each model
        const startYear = 2015;
        const endYear = 2023;
        
        for (let year = startYear; year <= endYear; year++) {
          const bikeModelId = `${make.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}`;
          
          const bikeModelData = {
            id: bikeModelId,
            make,
            model,
            year,
            engineCapacity: getEngineCapacity(model),
            fuelType: getFuelType(model),
            category: getCategory(model)
          };

          operations.push({
            type: 'set',
            ref: db.collection('bikeModels').doc(bikeModelId),
            data: bikeModelData
          });
        }
      }
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} bike models`);
    
    return operations.map(op => op.data);
    
  } catch (error) {
    logger.error(`Error seeding bike models: ${error.message}`);
    throw error;
  }
};

// Helper functions to determine bike specifications
function getEngineCapacity(model) {
  const modelLower = model.toLowerCase();
  
  if (modelLower.includes('125') || modelLower.includes('activa') || modelLower.includes('access')) return '125cc';
  if (modelLower.includes('150') || modelLower.includes('fz') || modelLower.includes('unicorn')) return '150cc';
  if (modelLower.includes('160') || modelLower.includes('apache')) return '160cc';
  if (modelLower.includes('200') || modelLower.includes('pulsar') || modelLower.includes('duke')) return '200cc';
  if (modelLower.includes('250') || modelLower.includes('gixxer') || modelLower.includes('dominar')) return '250cc';
  if (modelLower.includes('350') || modelLower.includes('classic') || modelLower.includes('bullet')) return '350cc';
  if (modelLower.includes('390') || modelLower.includes('rc')) return '390cc';
  if (modelLower.includes('400') || modelLower.includes('himalayan')) return '400cc';
  if (modelLower.includes('650') || modelLower.includes('interceptor')) return '650cc';
  
  // Default based on bike type
  if (modelLower.includes('scoot') || modelLower.includes('activa') || modelLower.includes('dio')) return '125cc';
  return '150cc'; // Default
}

function getFuelType(model) {
  const modelLower = model.toLowerCase();
  
  // Electric bikes (future-proofing)
  if (modelLower.includes('electric') || modelLower.includes('ev')) return 'electric';
  
  // All current Indian bikes are petrol
  return 'petrol';
}

function getCategory(model) {
  const modelLower = model.toLowerCase();
  
  if (modelLower.includes('activa') || modelLower.includes('dio') || 
      modelLower.includes('jupiter') || modelLower.includes('ntorq') || 
      modelLower.includes('fascino') || modelLower.includes('access') ||
      modelLower.includes('destini') || modelLower.includes('burgman')) {
    return 'scooter';
  }
  
  if (modelLower.includes('electric') || modelLower.includes('ev')) {
    return 'electric';
  }
  
  // All others are motorcycles
  return 'motorcycle';
}

export default seedBikeModels;
