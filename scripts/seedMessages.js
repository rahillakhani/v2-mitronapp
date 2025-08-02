import { db, createTimestamp, batchWrite, logger } from './config.js';
import { faker } from '@faker-js/faker';

export const seedMessages = async (userIds, orderData) => {
  logger.info('Starting to seed messages and conversations...');
  
  if (!userIds || userIds.length === 0) {
    logger.error('No user IDs provided for seeding messages');
    return [];
  }

  const conversationOps = [];
  const messageOps = [];
  const conversationCount = 30; // Number of conversations to create
  
  try {
    const buyers = userIds.filter(u => u.role === 'buyer');
    const vendors = userIds.filter(u => u.role === 'vendor');
    
    for (let i = 0; i < conversationCount; i++) {
      const conversationId = `conv-${i + 1}`;
      
      // Select random buyer and vendor
      const buyer = faker.helpers.arrayElement(buyers);
      const vendor = faker.helpers.arrayElement(vendors);
      const participants = [buyer.id, vendor.id];
      
      // Generate 3-8 messages per conversation
      const messageCount = faker.number.int({ min: 3, max: 8 });
      const messages = [];
      
      for (let j = 0; j < messageCount; j++) {
        const messageId = `msg-${i + 1}-${j + 1}`;
        const isFromBuyer = j % 2 === 0; // Alternate between buyer and vendor
        const senderId = isFromBuyer ? buyer.id : vendor.id;
        const receiverId = isFromBuyer ? vendor.id : buyer.id;
        
        // Generate realistic message content
        const messageContent = generateMessageContent(j, isFromBuyer, messageCount);
        
        const message = {
          id: messageId,
          conversationId,
          senderId,
          receiverId,
          content: messageContent,
          type: faker.helpers.weightedArrayElement([
            { weight: 85, value: 'text' },
            { weight: 10, value: 'image' },
            { weight: 5, value: 'document' }
          ]),
          attachments: generateAttachments(),
          isRead: faker.datatype.boolean(0.8), // 80% messages are read
          createdAt: createTimestamp()
        };
        
        messages.push(message);
        
        messageOps.push({
          type: 'set',
          ref: db.collection('messages').doc(messageId),
          data: message
        });
      }
      
      // Create conversation with last message
      const lastMessage = messages[messages.length - 1];
      const conversation = {
        id: conversationId,
        participants,
        lastMessage: {
          id: lastMessage.id,
          content: lastMessage.content,
          senderId: lastMessage.senderId,
          createdAt: lastMessage.createdAt
        },
        updatedAt: lastMessage.createdAt,
        isActive: true
      };
      
      conversationOps.push({
        type: 'set',
        ref: db.collection('conversations').doc(conversationId),
        data: conversation
      });
    }

    // Batch write conversations and messages
    await batchWrite([...conversationOps, ...messageOps]);
    
    logger.success(`Successfully seeded ${conversationOps.length} conversations with ${messageOps.length} messages`);
    
    return {
      conversations: conversationOps.map(op => op.data),
      messages: messageOps.map(op => op.data)
    };
    
  } catch (error) {
    logger.error(`Error seeding messages: ${error.message}`);
    throw error;
  }
};

// Generate realistic message content based on conversation flow
function generateMessageContent(messageIndex, isFromBuyer, totalMessages) {
  const buyerMessages = [
    // Opening messages
    "Hi, I'm interested in the brake pads you have listed. Are they compatible with Honda CB350?",
    "Hello, I need engine oil for my Bajaj Pulsar 200. Do you have 15W40 grade available?",
    "Hi there, I saw your listing for the headlight assembly. Is it an original part or aftermarket?",
    "Good morning, I'm looking for a clutch cable for TVS Apache. Can you confirm the part number?",
    "Hello, do you have the air filter for Royal Enfield Classic 350 in stock?",
    
    // Follow-up messages
    "Thanks for the quick response! What's the warranty period on this part?",
    "That sounds good. Can you share more details about the installation process?",
    "Great! I'd like to order 2 pieces. What's the total cost including shipping?",
    "Perfect! How long will it take for delivery to Bangalore?",
    "Can you provide the invoice with GST details?",
    
    // Closing messages
    "Excellent service! Thank you for the quick delivery.",
    "The part fits perfectly. Thanks for the help!",
    "Great quality product. Will recommend to others.",
    "Thank you for the professional service. Will buy again.",
    "Perfect transaction. Thanks!"
  ];
  
  const vendorMessages = [
    // Response messages
    "Hello! Yes, these brake pads are compatible with Honda CB350. They're OEM quality parts.",
    "Hi there! Yes, I have 15W40 engine oil available. It's a premium synthetic blend.",
    "Good morning! This is an original OEM headlight assembly with 1-year warranty.",
    "Hello! Yes, I can confirm the part number. Let me check the stock availability.",
    "Hi! Yes, the air filter is in stock. It's a genuine Royal Enfield part.",
    
    // Details and pricing
    "The warranty is 6 months from purchase date. Installation is straightforward with basic tools.",
    "Installation takes about 30 minutes. I can provide detailed instructions if needed.",
    "For 2 pieces, total cost is ₹1,200 including shipping within Karnataka.",
    "Delivery to Bangalore takes 2-3 business days via BlueDart courier.",
    "Sure! I'll provide a proper GST invoice with the shipment.",
    
    // Closing responses
    "Thank you for choosing us! Hope to serve you again.",
    "Glad the part worked well! Feel free to contact for any future needs.",
    "Thanks for the review! Your feedback means a lot to us.",
    "Thank you for the business! Looking forward to serving you again.",
    "Pleasure doing business with you!"
  ];
  
  const messages = isFromBuyer ? buyerMessages : vendorMessages;
  
  // Select message based on position in conversation
  if (messageIndex === 0) {
    // First message - always opening
    return faker.helpers.arrayElement(messages.slice(0, 5));
  } else if (messageIndex === totalMessages - 1) {
    // Last message - usually closing
    return faker.helpers.arrayElement(messages.slice(-5));
  } else {
    // Middle messages - follow-up or details
    return faker.helpers.arrayElement(messages.slice(5, -5));
  }
}

// Generate attachments for non-text messages
function generateAttachments() {
  return faker.datatype.boolean(0.3) ? [
    faker.image.urlLoremFlickr({ category: 'motorcycle', width: 800, height: 600 })
  ] : undefined;
}

export default seedMessages;
