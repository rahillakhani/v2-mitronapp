import { db, createTimestamp, batchWrite, logger } from './config.js';
import { faker } from '@faker-js/faker';
import {
  partCategories,
  partBrands,
  randomBikeCompatibility,
  randomPartTitle,
  randomProductDescription,
  randomPrice
} from './seedHelpers.js';

export const seedProducts = async (vendorIds) => {
  logger.info('Starting to seed products...');
  
  if (!vendorIds || vendorIds.length === 0) {
    logger.error('No vendor IDs provided for seeding products');
    return [];
  }

  const operations = [];
  const productCount = parseInt(process.env.SEED_PRODUCTS_COUNT) || 200;
  
  try {
    for (let i = 0; i < productCount; i++) {
      const productId = `product-${i + 1}`;
      
      // Select random category and subcategory
      const category = faker.helpers.arrayElement(partCategories);
      const subcategory = faker.helpers.arrayElement(category.subcategories);
      
      // Select random vendor (only approved vendors)
      const approvedVendors = vendorIds.filter(v => v.role === 'vendor');
      const vendor = faker.helpers.arrayElement(approvedVendors);
      
      // Generate product title and description
      const title = randomPartTitle(category.name, subcategory);
      const description = randomProductDescription(title);
      
      // Generate compatibility
      const bikeCompatibility = [randomBikeCompatibility()];
      
      // Generate pricing
      const basePrice = randomPrice(
        subcategory.includes('Engine') || subcategory.includes('Transmission') ? 2000 : 500,
        subcategory.includes('Engine') || subcategory.includes('Transmission') ? 25000 : 8000
      );
      
      const hasDiscount = faker.datatype.boolean(0.3); // 30% products have discount
      const price = hasDiscount ? Math.round(basePrice * 0.85) : basePrice;
      const originalPrice = hasDiscount ? basePrice : undefined;
      
      // Generate stock
      const stock = faker.number.int({ min: 0, max: 50 });
      const minOrderQuantity = faker.number.int({ min: 1, max: 3 });
      
      // Generate specifications
      const specifications = generateSpecifications(subcategory);
      
      // Generate dimensions
      const dimensions = {
        length: faker.number.float({ min: 5, max: 50, precision: 0.1 }),
        width: faker.number.float({ min: 3, max: 30, precision: 0.1 }),
        height: faker.number.float({ min: 2, max: 20, precision: 0.1 }),
        weight: faker.number.float({ min: 0.1, max: 5, precision: 0.1 })
      };
      
      // Generate warranty
      const warranty = {
        period: faker.number.int({ min: 3, max: 24 }),
        unit: faker.helpers.arrayElement(['months', 'years']),
        terms: 'Manufacturer warranty against defects'
      };
      
      // Generate images (placeholder URLs)
      const imageCount = faker.number.int({ min: 2, max: 5 });
      const images = Array.from({ length: imageCount }, () => 
        faker.image.urlLoremFlickr({ category: 'motorcycle', width: 800, height: 600 })
      );
      
      // Generate SEO keywords
      const seoKeywords = [
        subcategory.toLowerCase(),
        category.name.toLowerCase(),
        ...bikeCompatibility[0].make.toLowerCase().split(' '),
        ...bikeCompatibility[0].models.map(m => m.toLowerCase()),
        'bike parts',
        'motorcycle parts',
        'spare parts'
      ];
      
      // Generate tags
      const tags = [
        category.id,
        subcategory.toLowerCase().replace(/\s+/g, '-'),
        bikeCompatibility[0].make.toLowerCase(),
        faker.helpers.arrayElement(partBrands).toLowerCase()
      ];
      
      const product = {
        id: productId,
        vendorId: vendor.id,
        title,
        description,
        category: category.id,
        subcategory: subcategory.toLowerCase().replace(/\s+/g, '-'),
        partNumber: faker.string.alphanumeric(8).toUpperCase(),
        brand: faker.helpers.arrayElement(partBrands),
        bikeCompatibility,
        images,
        price,
        originalPrice,
        stock,
        minOrderQuantity,
        specifications,
        dimensions,
        warranty,
        isActive: faker.datatype.boolean(0.9), // 90% active
        isFeatured: faker.datatype.boolean(0.1), // 10% featured
        tags,
        seoKeywords,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
        reviewCount: faker.number.int({ min: 0, max: 25 }),
        salesCount: faker.number.int({ min: 0, max: 100 })
      };

      operations.push({
        type: 'set',
        ref: db.collection('products').doc(productId),
        data: product
      });
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} products`);
    
    return operations.map(op => ({ id: op.data.id, vendorId: op.data.vendorId }));
    
  } catch (error) {
    logger.error(`Error seeding products: ${error.message}`);
    throw error;
  }
};

// Helper function to generate realistic specifications
function generateSpecifications(subcategory) {
  const specs = {
    material: faker.helpers.arrayElement(['Steel', 'Aluminum', 'Plastic', 'Rubber', 'Cast Iron']),
    color: faker.helpers.arrayElement(['Black', 'Silver', 'Gray', 'Red', 'Blue']),
    finish: faker.helpers.arrayElement(['Painted', 'Powder Coated', 'Anodized', 'Chrome Plated'])
  };

  // Add category-specific specifications
  switch (subcategory.toLowerCase()) {
    case 'brake pads':
      specs.friction_material = faker.helpers.arrayElement(['Ceramic', 'Semi-Metallic', 'Organic']);
      specs.thickness = `${faker.number.float({ min: 8, max: 15, precision: 0.1 })}mm`;
      break;
    
    case 'engine oil':
      specs.viscosity = faker.helpers.arrayElement(['10W-30', '10W-40', '15W-40', '20W-50']);
      specs.type = faker.helpers.arrayElement(['Synthetic', 'Semi-Synthetic', 'Mineral']);
      specs.api_rating = faker.helpers.arrayElement(['SL', 'SM', 'SN']);
      break;
    
    case 'spark plugs':
      specs.gap = `${faker.number.float({ min: 0.6, max: 1.0, precision: 0.1 })}mm`;
      specs.thread_size = faker.helpers.arrayElement(['M10x1.0', 'M12x1.25', 'M14x1.25']);
      specs.heat_range = faker.number.int({ min: 6, max: 9 }).toString();
      break;
    
    case 'tires':
      specs.size = faker.helpers.arrayElement(['90/90-12', '100/90-17', '110/70-17', '120/80-17']);
      specs.tread_pattern = faker.helpers.arrayElement(['Street', 'Sport', 'Touring', 'All-Terrain']);
      specs.compound = faker.helpers.arrayElement(['Soft', 'Medium', 'Hard']);
      break;
    
    case 'battery':
      specs.voltage = '12V';
      specs.capacity = `${faker.number.int({ min: 4, max: 20 })}Ah`;
      specs.type = faker.helpers.arrayElement(['Lead Acid', 'AGM', 'Gel']);
      break;
    
    default:
      specs.compatibility = 'Universal';
      specs.installation = faker.helpers.arrayElement(['Bolt-on', 'Requires modification', 'Direct replacement']);
  }

  return specs;
}

export default seedProducts;
