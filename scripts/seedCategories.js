import { db, createTimestamp, batchWrite, logger } from './config.js';
import { partCategories } from './seedHelpers.js';

export const seedCategories = async () => {
  logger.info('Starting to seed categories...');
  
  const operations = [];
  
  try {
    // Create main categories and subcategories
    for (const category of partCategories) {
      // Create main category
      const mainCategory = {
        id: category.id,
        name: category.name,
        slug: category.id,
        description: `All ${category.name.toLowerCase()} for bikes and motorcycles`,
        isActive: true,
        sortOrder: partCategories.indexOf(category) + 1,
        seoKeywords: [
          category.name.toLowerCase(),
          'bike parts',
          'motorcycle parts',
          'spare parts'
        ]
      };

      operations.push({
        type: 'set',
        ref: db.collection('categories').doc(category.id),
        data: mainCategory
      });

      // Create subcategories
      for (let i = 0; i < category.subcategories.length; i++) {
        const subcategory = category.subcategories[i];
        const subcategoryId = `${category.id}-${subcategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        
        const subcategoryData = {
          id: subcategoryId,
          name: subcategory,
          slug: subcategoryId,
          description: `${subcategory} for bikes and motorcycles`,
          parentId: category.id,
          isActive: true,
          sortOrder: i + 1,
          seoKeywords: [
            subcategory.toLowerCase(),
            category.name.toLowerCase(),
            'bike parts',
            'motorcycle parts'
          ]
        };

        operations.push({
          type: 'set',
          ref: db.collection('categories').doc(subcategoryId),
          data: subcategoryData
        });
      }
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} categories`);
    logger.info(`Created ${partCategories.length} main categories with their subcategories`);
    
    return operations.map(op => op.data);
    
  } catch (error) {
    logger.error(`Error seeding categories: ${error.message}`);
    throw error;
  }
};

export default seedCategories;
