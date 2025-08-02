import { db, createTimestamp, batchWrite, logger } from './config.js';
import { faker } from '@faker-js/faker';

export const seedNotifications = async (userIds) => {
  logger.info('Starting to seed notifications...');
  
  if (!userIds || userIds.length === 0) {
    logger.error('No user IDs provided for seeding notifications');
    return [];
  }

  const operations = [];
  const notificationCount = 200; // Total notifications to create
  
  try {
    for (let i = 0; i < notificationCount; i++) {
      const notificationId = `notif-${i + 1}`;
      
      // Select random user
      const user = faker.helpers.arrayElement(userIds);
      
      // Generate notification type and content
      const notificationType = faker.helpers.weightedArrayElement([
        { weight: 40, value: 'order_update' },
        { weight: 25, value: 'message' },
        { weight: 20, value: 'promotion' },
        { weight: 15, value: 'system' }
      ]);
      
      const notificationData = generateNotificationContent(notificationType, user.role);
      
      const notification = {
        id: notificationId,
        userId: user.id,
        type: notificationType,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data,
        isRead: faker.datatype.boolean(0.6), // 60% read
        createdAt: createTimestamp()
      };

      operations.push({
        type: 'set',
        ref: db.collection('notifications').doc(notificationId),
        data: notification
      });
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} notifications`);
    
    return operations.map(op => op.data);
    
  } catch (error) {
    logger.error(`Error seeding notifications: ${error.message}`);
    throw error;
  }
};

// Generate notification content based on type and user role
function generateNotificationContent(type, userRole) {
  switch (type) {
    case 'order_update':
      if (userRole === 'buyer') {
        return faker.helpers.arrayElement([
          {
            title: 'Order Confirmed',
            body: 'Your order #ORD123456 has been confirmed and is being prepared.',
            data: { orderId: 'ORD123456', status: 'confirmed' }
          },
          {
            title: 'Order Shipped',
            body: 'Great news! Your order #ORD123457 has been shipped and is on its way.',
            data: { orderId: 'ORD123457', status: 'shipped', trackingNumber: 'TRK12345' }
          },
          {
            title: 'Order Delivered',
            body: 'Your order #ORD123458 has been delivered successfully. How was your experience?',
            data: { orderId: 'ORD123458', status: 'delivered' }
          },
          {
            title: 'Order Cancelled',
            body: 'Your order #ORD123459 has been cancelled. Refund will be processed within 3-5 business days.',
            data: { orderId: 'ORD123459', status: 'cancelled' }
          }
        ]);
      } else {
        return faker.helpers.arrayElement([
          {
            title: 'New Order Received',
            body: 'You have received a new order #ORD123460 worth ₹2,450. Please confirm.',
            data: { orderId: 'ORD123460', amount: 2450 }
          },
          {
            title: 'Order Payment Received',
            body: 'Payment of ₹1,800 received for order #ORD123461. Please process the order.',
            data: { orderId: 'ORD123461', amount: 1800 }
          },
          {
            title: 'Low Stock Alert',
            body: 'Stock is running low for "Brake Pads - Honda CB350". Only 2 units left.',
            data: { productId: 'product-123', stock: 2 }
          }
        ]);
      }
    
    case 'message':
      return faker.helpers.arrayElement([
        {
          title: 'New Message',
          body: userRole === 'buyer' ? 
            'You have a new message from MotoSpares regarding your inquiry.' :
            'You have a new message from a customer about brake pads.',
          data: { 
            conversationId: 'conv-123', 
            senderId: 'user-456',
            senderName: userRole === 'buyer' ? 'MotoSpares' : 'Rajesh Kumar'
          }
        },
        {
          title: 'Message Reply',
          body: userRole === 'buyer' ? 
            'BikeZone has replied to your product inquiry.' :
            'Customer has replied to your message about shipping.',
          data: { 
            conversationId: 'conv-124', 
            senderId: 'user-457',
            senderName: userRole === 'buyer' ? 'BikeZone' : 'Priya Sharma'
          }
        }
      ]);
    
    case 'promotion':
      if (userRole === 'buyer') {
        return faker.helpers.arrayElement([
          {
            title: 'Flash Sale Alert! 🔥',
            body: 'Get up to 30% off on all brake parts. Limited time offer!',
            data: { 
              promoCode: 'BRAKE30',
              category: 'brakes',
              discount: 30,
              validUntil: '2024-02-15'
            }
          },
          {
            title: 'New Arrivals! ✨',
            body: 'Check out the latest Honda CB350 parts now available.',
            data: { 
              category: 'new-arrivals',
              brand: 'Honda',
              model: 'CB350'
            }
          },
          {
            title: 'Weekend Special 🎉',
            body: 'Free shipping on orders above ₹1,500 this weekend only!',
            data: { 
              promoType: 'free-shipping',
              minAmount: 1500,
              validUntil: '2024-02-11'
            }
          }
        ]);
      } else {
        return faker.helpers.arrayElement([
          {
            title: 'Boost Your Sales! 📈',
            body: 'List more products and increase your visibility. Add 10+ products to get featured.',
            data: { 
              action: 'add-products',
              targetCount: 10
            }
          },
          {
            title: 'Vendor Spotlight 🌟',
            body: 'Congratulations! Your shop has been selected for this week\'s vendor spotlight.',
            data: { 
              spotlightWeek: '2024-W06',
              benefit: 'increased-visibility'
            }
          }
        ]);
      }
    
    case 'system':
      return faker.helpers.arrayElement([
        {
          title: 'App Update Available',
          body: 'Version 1.2.0 is now available with new features and bug fixes.',
          data: { 
            version: '1.2.0',
            updateType: 'optional'
          }
        },
        {
          title: 'Maintenance Notice',
          body: 'Scheduled maintenance on Feb 10, 2024 from 2:00 AM - 4:00 AM IST.',
          data: { 
            maintenanceDate: '2024-02-10',
            startTime: '02:00',
            endTime: '04:00'
          }
        },
        {
          title: 'Security Alert',
          body: 'Please update your password for better security. It\'s been 90 days since your last update.',
          data: { 
            securityAction: 'password-update',
            daysSinceUpdate: 90
          }
        },
        {
          title: 'Welcome to V2V Bike Parts! 🎉',
          body: 'Thank you for joining our marketplace. Complete your profile to get started.',
          data: { 
            action: 'complete-profile',
            welcomeFlow: true
          }
        }
      ]);
    
    default:
      return {
        title: 'Notification',
        body: 'You have a new notification.',
        data: {}
      };
  }
}

export default seedNotifications;
