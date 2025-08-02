import { faker } from '@faker-js/faker';

// Indian-specific data
export const indianStates = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan',
  'Uttar Pradesh', 'West Bengal', 'Punjab', 'Haryana', 'Kerala',
  'Telangana', 'Andhra Pradesh', 'Delhi', 'Madhya Pradesh', 'Bihar'
];

export const indianCities = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
  'Delhi': ['New Delhi', 'Delhi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala']
};

export const bikeMakes = [
  'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Suzuki', 'KTM', 'Royal Enfield',
  'Hero', 'Mahindra', 'Benelli', 'Kawasaki', 'Harley-Davidson'
];

export const bikeModels = {
  'Honda': ['CB350', 'CB200X', 'CBR150R', 'Activa 6G', 'Dio', 'Shine', 'Unicorn'],
  'Bajaj': ['Pulsar 200', 'Pulsar 250', 'Dominar 400', 'Platina', 'CT100', 'Avenger'],
  'TVS': ['Apache RTR 160', 'Apache RTR 200', 'Jupiter', 'NTORQ', 'Star City'],
  'Yamaha': ['MT-15', 'R15 V4', 'FZ-S', 'Fascino', 'Ray ZR'],
  'Suzuki': ['Gixxer 250', 'Gixxer SF', 'Access 125', 'Burgman Street'],
  'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 390'],
  'Royal Enfield': ['Classic 350', 'Bullet 350', 'Himalayan', 'Interceptor 650', 'Meteor 350'],
  'Hero': ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Xtreme 200R', 'Destini 125']
};

export const partCategories = [
  {
    id: 'engine',
    name: 'Engine Parts',
    subcategories: [
      'Pistons & Rings', 'Cylinder Head', 'Crankshaft', 'Connecting Rod',
      'Engine Block', 'Gaskets & Seals', 'Oil Pump', 'Water Pump'
    ]
  },
  {
    id: 'brakes',
    name: 'Brake System',
    subcategories: [
      'Brake Pads', 'Brake Discs', 'Brake Shoes', 'Master Cylinder',
      'Brake Lines', 'Brake Fluid', 'Calipers', 'Brake Levers'
    ]
  },
  {
    id: 'suspension',
    name: 'Suspension',
    subcategories: [
      'Front Forks', 'Rear Shock', 'Springs', 'Bushings',
      'Swing Arm', 'Steering Head', 'Linkages'
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical System',
    subcategories: [
      'Battery', 'Starter Motor', 'Alternator', 'Ignition Coil',
      'Spark Plugs', 'Wiring Harness', 'Lights', 'Switches'
    ]
  },
  {
    id: 'transmission',
    name: 'Transmission',
    subcategories: [
      'Clutch Plates', 'Gear Box', 'Chain & Sprockets', 'Drive Belt',
      'Clutch Cable', 'Gear Shifter', 'CVT Parts'
    ]
  },
  {
    id: 'body',
    name: 'Body & Frame',
    subcategories: [
      'Fairings', 'Fuel Tank', 'Seat', 'Mirrors', 'Handlebars',
      'Footpegs', 'Mudguards', 'Side Panels'
    ]
  },
  {
    id: 'wheels',
    name: 'Wheels & Tires',
    subcategories: [
      'Front Wheel', 'Rear Wheel', 'Tires', 'Tubes', 'Wheel Bearings',
      'Spokes', 'Rims', 'Valve Stems'
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [
      'Helmets', 'Gloves', 'Luggage', 'Phone Mounts', 'Covers',
      'Tool Kits', 'First Aid', 'Security Systems'
    ]
  }
];

export const partBrands = [
  'OEM', 'Bosch', 'NGK', 'Denso', 'Brembo', 'KYB', 'Gabriel',
  'TVS', 'Bajaj', 'Honda', 'Yamaha', 'Suzuki', 'Hero',
  'Exide', 'Amaron', 'MRF', 'CEAT', 'Michelin', 'Bridgestone'
];

export const orderStatuses = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
];

// Helper functions
export const randomIndianPhone = () => {
  const prefixes = ['9', '8', '7', '6'];
  const prefix = faker.helpers.arrayElement(prefixes);
  const remaining = faker.string.numeric(9);
  return `${prefix}${remaining}`;
};

export const randomIndianAddress = () => {
  const state = faker.helpers.arrayElement(indianStates);
  const cities = indianCities[state] || [state];
  const city = faker.helpers.arrayElement(cities);
  
  return {
    street: `${faker.location.buildingNumber()}, ${faker.location.street()}`,
    city,
    state,
    postalCode: faker.location.zipCode('######'),
    country: 'India'
  };
};

export const randomBikeCompatibility = () => {
  const make = faker.helpers.arrayElement(bikeMakes);
  const models = bikeModels[make] || [make + ' Model'];
  const selectedModels = faker.helpers.arrayElements(models, { min: 1, max: 3 });
  const years = faker.helpers.arrayElements(
    Array.from({ length: 10 }, (_, i) => 2015 + i),
    { min: 2, max: 5 }
  );
  
  return {
    make,
    models: selectedModels,
    years,
    engineCapacity: faker.helpers.arrayElement(['125cc', '150cc', '200cc', '250cc', '350cc', '400cc'])
  };
};

export const randomPartTitle = (category, subcategory) => {
  const bike = faker.helpers.arrayElement(bikeMakes);
  const adjectives = ['Premium', 'Heavy Duty', 'OEM Quality', 'High Performance', 'Genuine'];
  const adjective = faker.helpers.arrayElement(adjectives);
  
  return `${adjective} ${subcategory} for ${bike}`;
};

export const randomProductDescription = (title) => {
  const features = [
    'High quality materials',
    'Perfect fit and finish',
    'Easy installation',
    'Long lasting durability',
    'OEM specifications',
    'Tested for performance',
    'Corrosion resistant',
    'Heat treated'
  ];
  
  const selectedFeatures = faker.helpers.arrayElements(features, { min: 3, max: 5 });
  
  return `${title}\n\nKey Features:\n${selectedFeatures.map(f => `• ${f}`).join('\n')}\n\nCompatible with multiple bike models. Please check compatibility before ordering.`;
};

export const randomPrice = (min = 500, max = 50000) => {
  const price = faker.number.int({ min, max });
  // Round to nearest 50
  return Math.round(price / 50) * 50;
};

export const randomGSTNumber = () => {
  const stateCode = faker.string.numeric(2);
  const panLike = faker.string.alphanumeric(10).toUpperCase();
  const entityCode = faker.string.numeric(1);
  const checksum = faker.string.alphanumeric(1).toUpperCase();
  return `${stateCode}${panLike}${entityCode}Z${checksum}`;
};

export const randomBusinessName = () => {
  const types = ['Motors', 'Auto Parts', 'Bike Spares', 'Two Wheeler Parts', 'Motorcycle Accessories'];
  const names = ['Sharma', 'Kumar', 'Singh', 'Patel', 'Shah', 'Gupta', 'Agarwal', 'Verma'];
  
  const ownerName = faker.helpers.arrayElement(names);
  const businessType = faker.helpers.arrayElement(types);
  
  return `${ownerName} ${businessType}`;
};
