import { db, createTimestamp, batchWrite, logger } from './config.js';
import { faker } from '@faker-js/faker';

export const seedReviews = async (orderData) => {
  logger.info('Starting to seed reviews...');
  
  if (!orderData || orderData.length === 0) {
    logger.error('No order data provided for seeding reviews');
    return [];
  }

  const operations = [];
  const reviewCount = parseInt(process.env.SEED_REVIEWS_COUNT) || 150;
  
  try {
    // Create pool of delivered orders for reviews
    const deliveredOrders = orderData.filter(order => 
      order.items && order.items.length > 0
    );
    
    for (let i = 0; i < Math.min(reviewCount, deliveredOrders.length * 3); i++) {
      const reviewId = `review-${i + 1}`;
      
      // Select random order and item
      const order = faker.helpers.arrayElement(deliveredOrders);
      const item = faker.helpers.arrayElement(order.items);
      
      // Generate review data
      const rating = faker.helpers.weightedArrayElement([
        { weight: 40, value: 5 }, // 40% - 5 stars
        { weight: 30, value: 4 }, // 30% - 4 stars
        { weight: 20, value: 3 }, // 20% - 3 stars
        { weight: 8, value: 2 },  // 8% - 2 stars
        { weight: 2, value: 1 }   // 2% - 1 star
      ]);
      
      const reviewTitles = {
        5: [
          'Excellent product!',
          'Highly recommended',
          'Perfect fit and quality',
          'Outstanding value for money',
          'Exactly what I needed'
        ],
        4: [
          'Good quality product',
          'Satisfied with purchase',
          'Good value for money',
          'Decent product',
          'Worth buying'
        ],
        3: [
          'Average product',
          'Okay for the price',
          'Not bad',
          'Decent quality',
          'Could be better'
        ],
        2: [
          'Below expectations',
          'Not great quality',
          'Had some issues',
          'Could be improved',
          'Disappointed'
        ],
        1: [
          'Poor quality',
          'Not as described',
          'Waste of money',
          'Very disappointed',
          'Defective product'
        ]
      };
      
      const reviewComments = {
        5: [
          'The product quality is excellent and fits perfectly. Fast delivery and good packaging. Highly recommend this seller.',
          'Amazing quality! Exactly as described. The part fits perfectly and works great. Will definitely buy again.',
          'Top-notch product with excellent build quality. Installation was easy and the performance is outstanding.',
          'Perfect replacement part. Great quality and value for money. Seller was responsive and helpful.',
          'Excellent product! Better than expected. Quick delivery and well packaged. Very satisfied with the purchase.'
        ],
        4: [
          'Good quality product. Installation was straightforward and it works well. Slightly expensive but worth it.',
          'Decent product with good build quality. Fits well and does the job. Would recommend to others.',
          'Good value for money. The part works as expected and the quality seems durable. Happy with the purchase.',
          'Nice product overall. Good packaging and fast delivery. Quality is better than expected for the price.',
          'Satisfied with the product. It fits well and seems to be of good quality. Good customer service too.'
        ],
        3: [
          'Average product. Does the job but nothing special. Quality is okay for the price point.',
          'Decent quality but had some minor fitting issues. Overall okay for the price. Average experience.',
          'The product is fine but not exceptional. Quality is acceptable and it serves the purpose.',
          'Okay product. Installation required some adjustments but works fine now. Could be better.',
          'Average quality part. It works but I expected better for this price. Delivery was quick though.'
        ],
        2: [
          'Below my expectations. The quality is not great and had some fitting issues. Customer service was slow.',
          'Product quality is questionable. Had to make modifications to fit properly. Not very satisfied.',
          'Not very impressed with the quality. The part works but feels cheap. Expected better.',
          'Had some issues with the product. Quality could be better for the price. Delivery was delayed.',
          'Disappointed with the purchase. The product quality is below average and had installation problems.'
        ],
        1: [
          'Very poor quality product. Does not fit properly and seems to be defective. Not recommended.',
          'Terrible experience. The product arrived damaged and quality is very poor. Waste of money.',
          'Completely disappointed. Product is not as described and quality is very bad. Avoid this seller.',
          'Poor quality part that does not work properly. Had to return it. Very bad experience.',
          'Defective product received. Does not fit and quality is substandard. Money wasted.'
        ]
      };
      
      const title = faker.helpers.arrayElement(reviewTitles[rating]);
      const comment = faker.helpers.arrayElement(reviewComments[rating]);
      
      // Generate images for reviews (30% chance)
      const hasImages = faker.datatype.boolean(0.3);
      const images = hasImages ? Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => faker.image.urlLoremFlickr({ category: 'product', width: 600, height: 400 })
      ) : undefined;
      
      const review = {
        id: reviewId,
        productId: item.productId,
        vendorId: item.vendorId,
        buyerId: order.buyerId,
        orderId: order.id,
        rating,
        title,
        comment,
        images,
        isVerifiedPurchase: true, // All reviews from actual orders
        helpfulCount: faker.number.int({ min: 0, max: 15 }),
        createdAt: createTimestamp(),
        updatedAt: createTimestamp()
      };

      operations.push({
        type: 'set',
        ref: db.collection('reviews').doc(reviewId),
        data: review
      });
    }

    // Batch write all operations
    await batchWrite(operations);
    
    logger.success(`Successfully seeded ${operations.length} reviews`);
    
    return operations.map(op => op.data);
    
  } catch (error) {
    logger.error(`Error seeding reviews: ${error.message}`);
    throw error;
  }
};

export default seedReviews;
