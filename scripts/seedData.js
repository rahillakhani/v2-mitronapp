import { logger } from './config.js';
import seedUsers from './seedUsers.js';
import seedCategories from './seedCategories.js';
import seedBikeModels from './seedBikeModels.js';
import seedProducts from './seedProducts.js';
import seedOrders from './seedOrders.js';
import seedReviews from './seedReviews.js';
import seedMessages from './seedMessages.js';
import seedNotifications from './seedNotifications.js';

const seedData = async () => {
  logger.info('🚀 Starting comprehensive data seeding for V2V Bike Parts platform...');
  
  const startTime = Date.now();
  
  try {
    // 1. Seed Users (Admin, Vendors, Buyers)
    logger.info('\n📝 Step 1: Seeding Users...');
    const userIds = await seedUsers();
    logger.success(`✅ Users seeded: ${userIds.length} total`);
    
    // 2. Seed Categories
    logger.info('\n📁 Step 2: Seeding Categories...');
    const categories = await seedCategories();
    logger.success(`✅ Categories seeded: ${categories.length} total`);
    
    // 3. Seed Bike Models
    logger.info('\n🏍️ Step 3: Seeding Bike Models...');
    const bikeModels = await seedBikeModels();
    logger.success(`✅ Bike models seeded: ${bikeModels.length} total`);
    
    // 4. Seed Products
    logger.info('\n🔧 Step 4: Seeding Products...');
    const products = await seedProducts(userIds);
    logger.success(`✅ Products seeded: ${products.length} total`);
    
    // 5. Seed Orders
    logger.info('\n🛒 Step 5: Seeding Orders...');
    const orders = await seedOrders(userIds, products);
    logger.success(`✅ Orders seeded: ${orders.length} total`);
    
    // 6. Seed Reviews
    logger.info('\n⭐ Step 6: Seeding Reviews...');
    const reviews = await seedReviews(orders);
    logger.success(`✅ Reviews seeded: ${reviews.length} total`);
    
    // 7. Seed Messages & Conversations
    logger.info('\n💬 Step 7: Seeding Messages & Conversations...');
    const messaging = await seedMessages(userIds, orders);
    logger.success(`✅ Conversations seeded: ${messaging.conversations.length} total`);
    logger.success(`✅ Messages seeded: ${messaging.messages.length} total`);
    
    // 8. Seed Notifications
    logger.info('\n🔔 Step 8: Seeding Notifications...');
    const notifications = await seedNotifications(userIds);
    logger.success(`✅ Notifications seeded: ${notifications.length} total`);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Summary
    logger.info('\n📊 SEEDING SUMMARY:');
    logger.info('==================');
    logger.success(`👥 Users: ${userIds.length}`);
    logger.success(`📁 Categories: ${categories.length}`);
    logger.success(`🏍️ Bike Models: ${bikeModels.length}`);
    logger.success(`🔧 Products: ${products.length}`);
    logger.success(`🛒 Orders: ${orders.length}`);
    logger.success(`⭐ Reviews: ${reviews.length}`);
    logger.success(`💬 Conversations: ${messaging.conversations.length}`);
    logger.success(`📨 Messages: ${messaging.messages.length}`);
    logger.success(`🔔 Notifications: ${notifications.length}`);
    logger.info(`⏱️ Total time: ${duration} seconds`);
    
    logger.success('\n🎉 Data seeding completed successfully!');
    logger.info('\n📋 Next Steps:');
    logger.info('1. Start your mobile app: npm run dev:mobile');
    logger.info('2. Start your admin web: npm run dev:admin');
    logger.info('3. Login with admin credentials: admin@v2vbikeparts.com');
    logger.info('4. Explore the seeded data and start development!');
    
    // Sample login credentials
    logger.info('\n🔑 Sample Login Credentials:');
    logger.info('Admin: admin@v2vbikeparts.com');
    logger.info('Vendor: vendor1@example.com to vendor10@example.com');
    logger.info('Buyer: buyer1@example.com to buyer50@example.com');
    logger.warn('Note: You\'ll need to set passwords via Firebase Auth Console');
    
  } catch (error) {
    logger.error(`❌ Error during seeding: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;
