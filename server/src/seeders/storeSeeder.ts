import Store from '../models/Store';
import User from '../models/User';
import Category from '../models/Category';
import { UserRole } from '../models/User';
import slugify from 'slugify';
import pexelsService from '../services/pexelsService';

const stores = [
  {
    sellerEmail: 'majlis.interiors@example.com',
    name: 'Majlis Luxury Home Decor',
    description: 'Premium Arabic and contemporary home decor wholesale supplier specializing in traditional majlis furniture, luxury furnishings, and bespoke interior solutions for hotels, palaces, and high-end residences across the GCC region.',
    logo: 'https://example.com/majlis-logo.png',
    banner: 'https://example.com/majlis-banner.jpg',
    categoryNames: ['Home Decor', 'Lighting & Fixtures'],
    contact: {
      email: 'sales@majlisinteriors.ae',
      phoneNumber: '+971501234567',
      address: {
        street: 'Sheikh Zayed Road, Building 45',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        zipCode: '00000'
      }
    },
    businessInfo: {
      employeeCount: '25-50',
      minimumOrder: 5000,
      leadTime: '7-14 days',
      paymentTerms: ['Bank Transfer', 'Credit Card', 'Cash on Delivery'],
      shippingTerms: ['EXW', 'FOB', 'CIF'],
      capabilities: ['Custom Design', 'Bulk Orders', 'International Shipping'],
      certifications: [
        { name: 'ISO 9001:2015', issuedBy: 'ISO' },
        { name: 'Dubai Chamber Member', issuedBy: 'Dubai Chamber' },
        { name: 'UAE Ministry Licensed', issuedBy: 'UAE Ministry of Economy' }
      ]
    },
    policies: {
      return: '7 days return policy for defective items',
      shipping: 'Free delivery within UAE for orders above AED 10,000',
      warranty: '5 years warranty on all furniture items'
    },
    socialMedia: {
      instagram: 'https://instagram.com/majlisinteriors',
      facebook: 'https://facebook.com/majlisinteriors',
      linkedin: 'https://linkedin.com/company/majlisinteriors'
    },
    isPremium: true,
    isActive: true
  },
  {
    sellerEmail: 'desert.tech@example.com',
    name: 'Desert Tech Smart Home Hub',
    description: 'Leading distributor of smart home and IoT solutions in the Middle East. We provide cutting-edge home automation systems, smart security, and energy management solutions with full Arabic language support.',
    logo: 'https://example.com/desert-tech-logo.png',
    banner: 'https://example.com/desert-tech-banner.jpg',
    categoryNames: ['Smart Home'],
    contact: {
      email: 'info@deserttech.ae',
      phoneNumber: '+971509876543',
      address: {
        street: 'Khalifa City, Technology Park',
        city: 'Abu Dhabi',
        state: 'Abu Dhabi',
        country: 'United Arab Emirates',
        zipCode: '00000'
      }
    },
    businessInfo: {
      employeeCount: '50-100',
      minimumOrder: 2000,
      leadTime: '3-7 days',
      paymentTerms: ['Bank Transfer', 'Credit Card', 'Net 30'],
      shippingTerms: ['DDP', 'DAP', 'CIF'],
      capabilities: ['Installation Services', 'Technical Support', 'Custom Integration'],
      certifications: [
        { name: 'ADCCI Certified', issuedBy: 'Abu Dhabi Chamber' },
        { name: 'TRA Approved', issuedBy: 'Telecom Regulatory Authority' },
        { name: 'ESMA Certified', issuedBy: 'Emirates Authority for Standardization' }
      ]
    },
    policies: {
      return: '14 days return policy with original packaging',
      shipping: 'Express delivery available. Installation services provided for bulk orders',
      warranty: '2 years warranty on all smart devices'
    },
    socialMedia: {
      instagram: 'https://instagram.com/deserttechae',
      twitter: 'https://twitter.com/deserttechae',
      youtube: 'https://youtube.com/deserttechae'
    },
    isPremium: true,
    isActive: true
  },
  {
    sellerEmail: 'gulf.office@example.com',
    name: 'Gulf Office Solutions',
    description: 'Complete office supply solutions for businesses across the UAE. From ergonomic furniture to stationery, technology, and breakroom supplies - your one-stop wholesale partner for workplace needs.',
    logo: 'https://example.com/gulf-office-logo.png',
    banner: 'https://example.com/gulf-office-banner.jpg',
    categoryNames: ['Office Supplies'],
    contact: {
      email: 'orders@gulfofficepro.com',
      phoneNumber: '+971504567890',
      address: {
        street: 'Industrial Area 13, Warehouse 23',
        city: 'Sharjah',
        state: 'Sharjah',
        country: 'United Arab Emirates',
        zipCode: '00000'
      }
    },
    businessInfo: {
      employeeCount: '100-250',
      minimumOrder: 1000,
      leadTime: '1-3 days',
      paymentTerms: ['Bank Transfer', 'Credit Card', 'Net 30', 'Net 60'],
      shippingTerms: ['FOB', 'CIF', 'DDP'],
      capabilities: ['Same-day Delivery', 'Space Planning', 'Bulk Discounts'],
      certifications: [
        { name: 'ISO 14001:2015', issuedBy: 'ISO' },
        { name: 'Sharjah Chamber Member', issuedBy: 'Sharjah Chamber' },
        { name: 'BIFMA Certified', issuedBy: 'BIFMA International' }
      ]
    },
    policies: {
      return: '30 days return policy for unused items',
      shipping: 'Same-day delivery in Dubai & Sharjah. Next-day delivery to other Emirates',
      warranty: 'Manufacturer warranty applicable'
    },
    socialMedia: {
      instagram: 'https://instagram.com/gulfofficepro',
      linkedin: 'https://linkedin.com/company/gulfofficepro'
    },
    isPremium: false,
    isActive: true
  },
  {
    sellerEmail: 'oasis.living@example.com',
    name: 'Oasis Modern Living Store',
    description: 'Contemporary furniture and modern home accessories for the discerning buyer. We curate the finest selection of minimalist designs, sustainable materials, and innovative home solutions.',
    logo: 'https://example.com/oasis-logo.png',
    banner: 'https://example.com/oasis-banner.jpg',
    categoryNames: ['Home Decor', 'Kitchen & Dining'],
    contact: {
      email: 'hello@oasisliving.ae',
      phoneNumber: '+971507891234',
      address: {
        street: 'Al Quoz Industrial Area 3',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        zipCode: '00000'
      }
    },
    businessInfo: {
      employeeCount: '10-25',
      minimumOrder: 3000,
      leadTime: '10-14 days',
      paymentTerms: ['Bank Transfer', 'Credit Card'],
      shippingTerms: ['EXW', 'FOB'],
      capabilities: ['Custom Orders', 'Interior Design Consultation', 'White Glove Delivery'],
      certifications: [
        { name: 'Dubai Design District Partner', issuedBy: 'Dubai Design District' },
        { name: 'FSC Certified', issuedBy: 'Forest Stewardship Council' },
        { name: 'Green Building Member', issuedBy: 'Emirates Green Building Council' }
      ]
    },
    policies: {
      return: '14 days return policy for undamaged items',
      shipping: 'White glove delivery service available. Assembly included for orders above AED 5000',
      warranty: '2 years warranty on furniture, 1 year on accessories'
    },
    socialMedia: {
      instagram: 'https://instagram.com/oasisliving',
      pinterest: 'https://pinterest.com/oasisliving',
      facebook: 'https://facebook.com/oasisliving'
    },
    isPremium: true,
    isActive: true
  },
  {
    sellerEmail: 'emirate.smart@example.com',
    name: 'Emirate Smart Systems Store',
    description: 'Advanced smart home automation and intelligent office solutions. Specializing in AI-powered climate control, security systems, and energy management for residential and commercial properties.',
    logo: 'https://example.com/emirate-smart-logo.png',
    banner: 'https://example.com/emirate-smart-banner.jpg',
    categoryNames: ['Smart Home', 'Office Supplies'],
    contact: {
      email: 'sales@emiratesmart.com',
      phoneNumber: '+971502345678',
      address: {
        street: 'DMCC, Jumeirah Lake Towers',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        zipCode: '00000'
      }
    },
    businessInfo: {
      employeeCount: '25-50',
      minimumOrder: 5000,
      leadTime: '5-10 days',
      paymentTerms: ['Bank Transfer', 'Credit Card', 'Leasing Available'],
      shippingTerms: ['DDP', 'DAP'],
      capabilities: ['AI Integration', 'Professional Installation', 'Training Services'],
      certifications: [
        { name: 'DMCC Licensed', issuedBy: 'Dubai Multi Commodities Centre' },
        { name: 'Dubai Smart City Partner', issuedBy: 'Smart Dubai' },
        { name: 'SIRA Approved', issuedBy: 'Security Industry Regulatory Agency' }
      ]
    },
    policies: {
      return: '7 days return policy with restocking fee',
      shipping: 'Professional installation included. Free training for bulk orders',
      warranty: '3 years warranty on hardware, lifetime software support'
    },
    socialMedia: {
      instagram: 'https://instagram.com/emiratesmart',
      linkedin: 'https://linkedin.com/company/emiratesmart',
      twitter: 'https://twitter.com/emiratesmart'
    },
    isPremium: false,
    isActive: true
  }
];

export const seedStores = async () => {
  try {
    // Clear existing stores
    await Store.deleteMany({});
    console.log('🗑️  Cleared existing stores');

    // Get sellers and categories
    const sellers = await User.find({ role: UserRole.SELLER });
    const categories = await Category.find({});
    
    if (sellers.length === 0) {
      throw new Error('No sellers found. Please run seller seeder first.');
    }
    if (categories.length === 0) {
      throw new Error('No categories found. Please run category seeder first.');
    }

    // Create maps for easy lookup
    const sellerMap = new Map(sellers.map(seller => [seller.email, seller._id]));
    const categoryMap = new Map(categories.map(cat => [cat.name, cat._id]));

    // Fetch banner and logo images from Pexels
    console.log('🖼️  Fetching store images from Pexels...');
    const storesWithImages = await Promise.all(
      stores.map(async (store) => {
        const bannerImage = await pexelsService.getStoreBannerImage(store.name);
        const logoSearchTerm = store.name.split(' ')[0].toLowerCase() + ' logo design';
        const logoImages = await pexelsService.searchPhotos(logoSearchTerm, 1);
        
        return {
          ...store,
          banner: bannerImage || store.banner,
          logo: logoImages[0] || store.logo
        };
      })
    );

    // Prepare stores with proper references and slugs
    const storesToInsert = storesWithImages.map((store) => {
      const { sellerEmail, categoryNames, ...storeData } = store;
      
      // Map category names to ObjectIds
      const categoryIds = categoryNames
        .map(name => categoryMap.get(name))
        .filter(id => id !== undefined);
      
      return {
        ...storeData,
        seller: sellerMap.get(sellerEmail),
        slug: slugify(storeData.name, { lower: true, strict: true }),
        categories: categoryIds,
        featured: {
          products: [],
          collections: []
        },
        ratings: {
          average: 4 + Math.random() * 0.8, // Random rating between 4.0 and 4.8
          count: Math.floor(Math.random() * 200) + 50
        },
        metrics: {
          totalProducts: Math.floor(Math.random() * 100) + 20,
          totalOrders: Math.floor(Math.random() * 500) + 100,
          responseTime: `${Math.floor(Math.random() * 2) + 1} hours`,
          fulfillmentRate: 95 + Math.floor(Math.random() * 5) // 95-99%
        }
      };
    });

    // Insert stores
    const createdStores = await Store.insertMany(storesToInsert);
    console.log(`✅ Created ${createdStores.length} stores`);

    return createdStores;
  } catch (error) {
    console.error('❌ Error seeding stores:', error);
    throw error;
  }
};