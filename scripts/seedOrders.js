import { db, createTimestamp, batchWrite, logger } from './config.js';
import { faker } from '@faker-js/faker';
import { orderStatuses, randomIndianAddress } from './seedHelpers.js';

export const seedOrders = async (userIds, productIds) => {
  logger.info('Starting to seed orders...');
  
  if (!userIds || userIds.length === 0 || !productIds || productIds.length === 0) {
    logger.error('No user IDs or product IDs provided for seeding orders');
    return [];
  }

  const operations = [];
  const orderCount = parseInt(process.env.SEED_ORDERS_COUNT) || 100;
  const buyers = userIds.filter(u => u.role === 'buyer');
  
  try {
    for (let i = 0; i < orderCount; i++) {
      const orderId = `ORD${Date.now().toString().slice(-6)}${i.toString().padStart(3, '0')}`;
      
      // Select random buyer
      const buyer = faker.helpers.arrayElement(buyers);
      
      // Select 1-4 random products from same vendor
      const itemCount = faker.number.int({ min: 1, max: 4 });
      const selectedProducts = faker.helpers.arrayElements(productIds, { min: 1, max: itemCount });
      
      // Group by vendor (orders should be per vendor)
      const vendorGroups = groupByVendor(selectedProducts);
      const vendorId = Object.keys(vendorGroups)[0]; // Take first vendor
      const vendorProducts = vendorGroups[vendorId];
      
      // Create order items
      const items = vendorProducts.map(product => ({
        productId: product.id,
        vendorId: product.vendorId,
        title: `Sample Product ${product.id}`,
        image: faker.image.urlLoremFlickr({ category: 'motorcycle', width: 400, height: 300 }),
        price: faker.number.int({ min: 500, max: 5000 }),
        quantity: faker.number.int({ min: 1, max: 3 }),
        specifications: {
          color: faker.helpers.arrayElement(['Black', 'Silver', 'Red']),
          size: faker.helpers.arrayElement(['Standard', 'Large', 'Small'])
        }
      }));
      
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = subtotal > 2000 ? 0 : faker.number.int({ min: 50, max: 200 });
      const tax = Math.round(subtotal * 0.18); // 18% GST
      const discount = faker.datatype.boolean(0.3) ? faker.number.int({ min: 50, max: 500 }) : 0;
      const totalAmount = subtotal + shippingCost + tax - discount;
      
      // Generate order status (bias towards completed orders)
      const status = faker.helpers.weightedArrayElement([
        { weight: 10, value: 'delivered' },
        { weight: 5, value: 'shipped' },
        { weight: 3, value: 'processing' },
        { weight: 2, value: 'confirmed' },
        { weight: 1, value: 'pending' },
        { weight: 1, value: 'cancelled' }
      ]);
      
      // Generate addresses
      const shippingAddress = {
        id: `addr-${i + 1}`,
        label: faker.helpers.arrayElement(['Home', 'Work', 'Other']),
        ...randomIndianAddress(),
        isDefault: true
      };
      
      // Generate payment details
      const paymentDetails = {
        method: faker.helpers.arrayElement(['razorpay', 'cod']),
        transactionId: faker.string.alphanumeric(20),
        razorpayOrderId: `order_${faker.string.alphanumeric(14)}`,
        razorpayPaymentId: status !== 'pending' ? `pay_${faker.string.alphanumeric(14)}` : undefined,
        status: status === 'pending' ? 'pending' : status === 'cancelled' ? 'failed' : 'completed',
        amount: totalAmount,
        currency: 'INR',
        paidAt: status !== 'pending' ? createTimestamp() : undefined
      };
      
      // Generate tracking info for shipped/delivered orders
      const trackingInfo = (status === 'shipped' || status === 'delivered') ? {
        trackingNumber: `TRK${faker.string.alphanumeric(12).toUpperCase()}`,
        carrier: faker.helpers.arrayElement(['BlueDart', 'DTDC', 'Delhivery', 'Ekart']),
        status: status === 'delivered' ? 'Delivered' : 'In Transit',
        statusHistory: generateTrackingHistory(status)
      } : undefined;
      
      // Generate delivery dates
      const createdDate = faker.date.past({ years: 1 });
      const estimatedDelivery = faker.date.future({ days: 7, refDate: createdDate });
      const actualDelivery = status === 'delivered' ? 
        faker.date.between({ from: createdDate, to: estimatedDelivery }) : undefined;
      
      const order = {
        id: orderId,
        buyerId: buyer.id,
        vendorId,
        items,
        subtotal,
        shippingCost,
        tax,
        discount,
        totalAmount,
        status,
        shippingAddress,
        billingAddress: shippingAddress, // Same as shipping for simplicity
        paymentDetails,
        trackingInfo,
        estimatedDelivery: createTimestamp(), // Convert to Firestore timestamp
        actualDelivery: actualDelivery ? createTimestamp() : undefined,
        notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp()
      };

      operations.push({
        type: 'set',
        ref: db.collection('orders').doc(orderId),
        data: order
      });
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} orders`);
    
    return operations.map(op => ({ 
      id: op.data.id, 
      buyerId: op.data.buyerId, 
      vendorId: op.data.vendorId,
      items: op.data.items
    }));
    
  } catch (error) {
    logger.error(`Error seeding orders: ${error.message}`);
    throw error;
  }
};

// Helper function to group products by vendor
function groupByVendor(products) {
  return products.reduce((groups, product) => {
    const vendorId = product.vendorId;
    if (!groups[vendorId]) {
      groups[vendorId] = [];
    }
    groups[vendorId].push(product);
    return groups;
  }, {});
}

// Helper function to generate realistic tracking history
function generateTrackingHistory(finalStatus) {
  const history = [
    {
      status: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      location: 'Seller Location',
      timestamp: createTimestamp()
    },
    {
      status: 'Picked Up',
      description: 'Package has been picked up by courier',
      location: 'Seller Location',
      timestamp: createTimestamp()
    },
    {
      status: 'In Transit',
      description: 'Package is on the way to destination',
      location: faker.location.city(),
      timestamp: createTimestamp()
    }
  ];
  
  if (finalStatus === 'delivered') {
    history.push({
      status: 'Delivered',
      description: 'Package has been delivered successfully',
      location: 'Destination',
      timestamp: createTimestamp()
    });
  }
  
  return history;
}

export default seedOrders;
