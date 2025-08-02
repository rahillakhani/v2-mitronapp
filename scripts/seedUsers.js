import { db, auth, createTimestamp, batchWrite, logger } from './config.js';
import { faker } from '@faker-js/faker';
import {
  randomIndianPhone,
  randomIndianAddress,
  randomGSTNumber,
  randomBusinessName
} from './seedHelpers.js';

export const seedUsers = async () => {
  logger.info('Starting to seed users...');
  
  const operations = [];
  const userIds = [];
  
  try {
    // Create Admin User
    const adminUser = {
      id: 'admin-user-id',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@v2vbikeparts.com',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        phone: randomIndianPhone(),
        addresses: [randomIndianAddress()],
        savedBikes: [],
        preferences: {
          defaultAddress: '',
          preferredPaymentMethod: 'razorpay',
          notifications: {
            orderUpdates: true,
            messages: true,
            promotions: true,
            newProducts: true
          },
          language: 'en',
          currency: 'INR'
        }
      },
      isActive: true,
      createdAt: createTimestamp(),
      updatedAt: createTimestamp()
    };

    operations.push({
      type: 'set',
      ref: db.collection('users').doc(adminUser.id),
      data: adminUser
    });
    userIds.push({ id: adminUser.id, role: 'admin' });

    // Create Vendor Users
    const vendorCount = parseInt(process.env.SEED_VENDORS_COUNT) || 10;
    for (let i = 0; i < vendorCount; i++) {
      const vendorId = `vendor-${i + 1}`;
      const address = randomIndianAddress();
      
      const vendor = {
        id: vendorId,
        email: `vendor${i + 1}@example.com`,
        role: 'vendor',
        profile: {
          businessName: randomBusinessName(),
          contactPerson: faker.person.fullName(),
          phone: randomIndianPhone(),
          businessAddress: {
            id: 'business-address',
            label: 'Business Address',
            ...address,
            isDefault: true
          },
          businessLicense: faker.string.alphanumeric(12).toUpperCase(),
          gstNumber: randomGSTNumber(),
          categories: faker.helpers.arrayElements(
            ['engine', 'brakes', 'suspension', 'electrical', 'transmission', 'body', 'wheels', 'accessories'],
            { min: 2, max: 4 }
          ),
          description: faker.company.catchPhrase(),
          isApproved: faker.datatype.boolean(0.8), // 80% approved
          approvedAt: faker.datatype.boolean(0.8) ? createTimestamp() : null,
          rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
          totalOrders: faker.number.int({ min: 0, max: 150 }),
          profileImage: faker.image.avatar()
        },
        isActive: true,
        fcmToken: faker.string.alphanumeric(152),
        createdAt: createTimestamp(),
        updatedAt: createTimestamp()
      };

      operations.push({
        type: 'set',
        ref: db.collection('users').doc(vendorId),
        data: vendor
      });
      userIds.push({ id: vendorId, role: 'vendor' });
    }

    // Create Buyer Users
    const buyerCount = parseInt(process.env.SEED_BUYERS_COUNT) || 50;
    for (let i = 0; i < buyerCount; i++) {
      const buyerId = `buyer-${i + 1}`;
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      const buyer = {
        id: buyerId,
        email: `buyer${i + 1}@example.com`,
        role: 'buyer',
        profile: {
          firstName,
          lastName,
          phone: randomIndianPhone(),
          addresses: [
            {
              id: `address-${i + 1}-1`,
              label: 'Home',
              ...randomIndianAddress(),
              isDefault: true
            },
            ...(faker.datatype.boolean(0.3) ? [{
              id: `address-${i + 1}-2`,
              label: 'Work',
              ...randomIndianAddress(),
              isDefault: false
            }] : [])
          ],
          savedBikes: [
            {
              id: `bike-${i + 1}`,
              bikeModelId: faker.string.uuid(),
              nickname: `My ${faker.helpers.arrayElement(['Bike', 'Ride', 'Machine'])}`,
              year: faker.number.int({ min: 2015, max: 2023 }),
              registrationNumber: `MH${faker.string.numeric(2)}${faker.string.alpha(2).toUpperCase()}${faker.string.numeric(4)}`,
              notes: faker.lorem.sentence()
            }
          ],
          preferences: {
            defaultAddress: `address-${i + 1}-1`,
            preferredPaymentMethod: faker.helpers.arrayElement(['razorpay', 'cod']),
            notifications: {
              orderUpdates: true,
              messages: faker.datatype.boolean(0.9),
              promotions: faker.datatype.boolean(0.6),
              newProducts: faker.datatype.boolean(0.4)
            },
            language: 'en',
            currency: 'INR'
          },
          profileImage: faker.image.avatar()
        },
        isActive: true,
        fcmToken: faker.string.alphanumeric(152),
        createdAt: createTimestamp(),
        updatedAt: createTimestamp()
      };

      operations.push({
        type: 'set',
        ref: db.collection('users').doc(buyerId),
        data: buyer
      });
      userIds.push({ id: buyerId, role: 'buyer' });
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} users`);
    logger.info(`Created: 1 admin, ${vendorCount} vendors, ${buyerCount} buyers`);
    
    return userIds;
    
  } catch (error) {
    logger.error(`Error seeding users: ${error.message}`);
    throw error;
  }
};

export default seedUsers;
