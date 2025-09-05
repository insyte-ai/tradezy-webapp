import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';
import { UserRole } from '../models/User';
import slugify from 'slugify';
import pexelsService from '../services/pexelsService';

const products = [
  {
    name: 'Luxury Arabic Majlis Sofa Set',
    description: 'Traditional Arabic majlis sofa set with premium velvet upholstery and gold accents. Perfect for luxury homes and hotels in the Gulf region. Set includes 2 three-seater sofas, 2 single chairs, and center table.',
    brand: 'Majlis Interiors',
    basePrice: {
      wholesale: 8500,
      minQuantity: 2,
      currency: 'AED'
    },
    images: [
      'https://example.com/majlis-sofa-1.jpg',
      'https://example.com/majlis-sofa-2.jpg',
      'https://example.com/majlis-sofa-3.jpg'
    ],
    features: [
      'Premium Italian velvet upholstery',
      'Solid wood frame with gold leaf finish',
      'Traditional Arabic design patterns',
      'Fire-resistant materials',
      'Custom color options available'
    ],
    specifications: new Map([
      ['Material', 'Velvet, Solid Wood, Gold Leaf'],
      ['Sofa Dimensions', '220cm x 95cm x 90cm'],
      ['Chair Dimensions', '95cm x 95cm x 90cm'],
      ['Weight', '450kg (full set)'],
      ['Origin', 'UAE'],
      ['Warranty', '5 years']
    ]),
    status: 'active',
    visibility: 'public',
    shipping: {
      weight: 450,
      dimensions: {
        length: 220,
        width: 95,
        height: 90
      },
      shippingClass: 'freight',
      freeShipping: false,
      estimatedDays: 7
    },
    tags: ['luxury', 'arabic', 'majlis', 'sofa', 'traditional', 'hotel furniture'],
    categoryName: 'Home Decor',
    sellerEmail: 'majlis.interiors@example.com'
  },
  {
    name: 'Smart Home Automation Hub Pro',
    description: 'Advanced smart home control hub compatible with all major IoT devices. Features Arabic and English voice control, supports up to 200 devices, ideal for large villas and commercial properties.',
    brand: 'Desert Tech Solutions',
    basePrice: {
      wholesale: 1250,
      minQuantity: 10,
      currency: 'AED'
    },
    images: [
      'https://example.com/smart-hub-1.jpg',
      'https://example.com/smart-hub-2.jpg'
    ],
    features: [
      'Arabic & English voice control',
      'Supports 200+ devices',
      'Works with Alexa, Google, Siri',
      'Energy monitoring dashboard',
      'Remote access via mobile app',
      '5G and WiFi 6 compatible'
    ],
    specifications: new Map([
      ['Processor', 'Quad-core ARM Cortex-A72'],
      ['Memory', '4GB RAM, 32GB Storage'],
      ['Connectivity', '5G, WiFi 6, Zigbee, Z-Wave'],
      ['Display', '7-inch touchscreen'],
      ['Power', '12V DC adapter included'],
      ['Dimensions', '25cm x 18cm x 3cm']
    ]),
    status: 'active',
    visibility: 'public',
    shipping: {
      weight: 0.8,
      dimensions: {
        length: 30,
        width: 22,
        height: 8
      },
      shippingClass: 'standard',
      freeShipping: true,
      estimatedDays: 3
    },
    tags: ['smart home', 'IoT', 'automation', 'hub', 'voice control', 'Arabic'],
    categoryName: 'Smart Home',
    sellerEmail: 'desert.tech@example.com'
  },
  {
    name: 'Executive Ergonomic Office Chair Collection',
    description: 'Premium ergonomic office chairs designed for the Middle East climate. Features breathable mesh back, adjustable lumbar support, and luxury leather seating. Bulk orders for corporate offices and co-working spaces.',
    brand: 'Gulf Office Pro',
    basePrice: {
      wholesale: 950,
      minQuantity: 20,
      currency: 'AED'
    },
    images: [
      'https://example.com/office-chair-1.jpg',
      'https://example.com/office-chair-2.jpg',
      'https://example.com/office-chair-3.jpg'
    ],
    features: [
      'Climate-adaptive breathable mesh',
      'Premium leather seating',
      'Adjustable lumbar support',
      '4D adjustable armrests',
      'Synchronized tilt mechanism',
      'Weight capacity up to 150kg'
    ],
    specifications: new Map([
      ['Material', 'Leather, Mesh, Aluminum base'],
      ['Adjustable Height', '45-55cm'],
      ['Seat Width', '52cm'],
      ['Back Height', '68cm'],
      ['Weight', '22kg'],
      ['Certification', 'BIFMA certified']
    ]),
    status: 'active',
    visibility: 'public',
    shipping: {
      weight: 22,
      dimensions: {
        length: 70,
        width: 70,
        height: 120
      },
      shippingClass: 'standard',
      freeShipping: false,
      estimatedDays: 5
    },
    tags: ['office', 'chair', 'ergonomic', 'executive', 'corporate', 'bulk'],
    categoryName: 'Office Supplies',
    sellerEmail: 'gulf.office@example.com'
  },
  {
    name: 'Modern Islamic Geometric Wall Art Set',
    description: 'Contemporary Islamic geometric pattern wall art collection. Laser-cut metal designs with gold and silver finishes. Perfect for hotels, restaurants, and luxury residences.',
    brand: 'Oasis Living',
    basePrice: {
      wholesale: 650,
      minQuantity: 5,
      currency: 'AED'
    },
    images: [
      'https://example.com/wall-art-1.jpg',
      'https://example.com/wall-art-2.jpg'
    ],
    features: [
      'Laser-cut precision patterns',
      'Gold and silver powder coating',
      'Weather-resistant for outdoor use',
      'Easy wall mounting system',
      'Set of 3 complementary designs',
      'Custom sizing available'
    ],
    specifications: new Map([
      ['Material', 'Stainless Steel'],
      ['Finish', 'Gold/Silver powder coating'],
      ['Size per piece', '120cm x 80cm'],
      ['Thickness', '3mm'],
      ['Weight per piece', '8kg'],
      ['Set includes', '3 pieces']
    ]),
    status: 'active',
    visibility: 'public',
    shipping: {
      weight: 24,
      dimensions: {
        length: 125,
        width: 85,
        height: 10
      },
      shippingClass: 'standard',
      freeShipping: false,
      estimatedDays: 4
    },
    tags: ['wall art', 'islamic', 'geometric', 'metal art', 'luxury', 'decor'],
    categoryName: 'Home Decor',
    sellerEmail: 'oasis.living@example.com'
  },
  {
    name: 'Smart AC Control System Bundle',
    description: 'Intelligent air conditioning control system for commercial and residential properties. Includes smart thermostats, motion sensors, and central hub. Reduces energy consumption by up to 40%.',
    brand: 'Emirate Smart Systems',
    basePrice: {
      wholesale: 2200,
      minQuantity: 5,
      currency: 'AED'
    },
    images: [
      'https://example.com/ac-control-1.jpg',
      'https://example.com/ac-control-2.jpg',
      'https://example.com/ac-control-3.jpg'
    ],
    features: [
      'Compatible with all major AC brands',
      'AI-powered temperature optimization',
      'Motion detection for auto on/off',
      'Mobile app control',
      'Energy usage analytics',
      'Schedule programming',
      'Zone control capability'
    ],
    specifications: new Map([
      ['Hub Connectivity', 'WiFi, Bluetooth 5.0'],
      ['Thermostat Display', '4.3-inch color LCD'],
      ['Sensors Included', '5 motion sensors'],
      ['Power', 'Battery + AC powered'],
      ['App Support', 'iOS and Android'],
      ['Max Zones', '8 zones']
    ]),
    status: 'active',
    visibility: 'public',
    shipping: {
      weight: 3.5,
      dimensions: {
        length: 40,
        width: 30,
        height: 15
      },
      shippingClass: 'standard',
      freeShipping: true,
      estimatedDays: 3
    },
    tags: ['smart AC', 'energy saving', 'IoT', 'climate control', 'automation'],
    categoryName: 'Smart Home',
    sellerEmail: 'emirate.smart@example.com'
  }
];

export const seedProducts = async () => {
  try {
    // Drop the collection to clear all indexes and data
    try {
      await Product.collection.drop();
      console.log('🗑️  Dropped products collection');
    } catch (error: any) {
      // Collection might not exist, that's fine
      if (error.code !== 26) {
        throw error;
      }
    }
    
    // Recreate indexes
    await Product.createIndexes();
    console.log('📇 Recreated product indexes');

    // Get categories and sellers
    const categories = await Category.find({});
    const sellers = await User.find({ role: UserRole.SELLER });

    if (categories.length === 0) {
      throw new Error('No categories found. Please run category seeder first.');
    }
    if (sellers.length === 0) {
      throw new Error('No sellers found. Please run seller seeder first.');
    }

    // Create a map for easy lookup
    const categoryMap = new Map(categories.map(cat => [cat.name, cat._id]));
    const sellerMap = new Map(sellers.map(seller => [seller.email, seller._id]));

    // Fetch images for each product from Pexels
    console.log('🖼️  Fetching images from Pexels...');
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const images = await pexelsService.getProductImages(
          slugify(product.categoryName, { lower: true }),
          product.name,
          3 // Get 3 images per product
        );
        return {
          ...product,
          images: images.length > 0 ? images : product.images
        };
      })
    );

    // Prepare products with proper references
    const productsToInsert = productsWithImages.map((product, index) => {
      const { categoryName, sellerEmail, ...productData } = product;
      
      return {
        ...productData,
        slug: slugify(productData.name, { lower: true, strict: true }),
        category: categoryMap.get(categoryName),
        seller: sellerMap.get(sellerEmail),
        variants: [{
          sku: `SKU-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          attributes: new Map([
            ['Default', 'Standard']
          ]),
          price: {
            wholesale: productData.basePrice.wholesale,
            minQuantity: productData.basePrice.minQuantity,
            bulkPricing: [
              {
                minQuantity: productData.basePrice.minQuantity * 5,
                price: productData.basePrice.wholesale * 0.9
              },
              {
                minQuantity: productData.basePrice.minQuantity * 10,
                price: productData.basePrice.wholesale * 0.85
              }
            ]
          },
          inventory: {
            available: 100,
            reserved: 0,
            warehouse: 'Dubai Main Warehouse'
          },
          isActive: true
        }],
        ratings: {
          average: 4.5,
          count: 12
        },
        views: Math.floor(Math.random() * 1000) + 100
      };
    });

    // Insert products
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Created ${createdProducts.length} products`);

    return createdProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};