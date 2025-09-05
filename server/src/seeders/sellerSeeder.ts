import User from '../models/User';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '../models/User';

const sellers = [
  {
    email: 'majlis.interiors@example.com',
    password: 'Seller123!',
    role: UserRole.SELLER,
    status: UserStatus.APPROVED,
    firstName: 'Ahmed',
    lastName: 'Al Rashid',
    phoneNumber: '+971501234567',
    emailVerified: true,
    onboardingCompleted: true,
    sellerProfile: {
      brandName: 'Majlis Interiors',
      storeName: 'Majlis Luxury Home Decor',
      primaryCategory: 'Home Decor',
      businessName: 'Majlis Interiors Trading LLC',
      website: 'www.majlisinteriors.ae',
      address: {
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates'
      },
      baseCurrency: 'AED',
      contactName: 'Ahmed Al Rashid',
      contactPhone: '+971501234567',
      contactJobTitle: 'Managing Director',
      tradeLicenseNumber: 'DED-2019-789456',
      vatTrnNumber: 'TRN100234567890003'
    },
    company: {
      name: 'Majlis Interiors Trading LLC',
      registrationNumber: 'DED-2019-789456',
      taxId: 'TRN100234567890003',
      website: 'www.majlisinteriors.ae',
      description: 'Premium Arabic and contemporary home decor wholesale supplier in the Middle East',
      industry: 'Home & Living',
      size: '25-50 employees',
      yearEstablished: 2019,
      monthlyVolume: 'AED 500,000 - AED 1,000,000',
      address: {
        street: 'Sheikh Zayed Road, Building 45',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        postalCode: '00000'
      }
    }
  },
  {
    email: 'desert.tech@example.com',
    password: 'Seller123!',
    role: UserRole.SELLER,
    status: UserStatus.APPROVED,
    firstName: 'Fatima',
    lastName: 'Al Maktoum',
    phoneNumber: '+971509876543',
    emailVerified: true,
    onboardingCompleted: true,
    sellerProfile: {
      brandName: 'Desert Tech Solutions',
      storeName: 'Desert Tech Smart Home',
      primaryCategory: 'Smart Home',
      businessName: 'Desert Technologies FZE',
      website: 'www.deserttech.ae',
      address: {
        city: 'Abu Dhabi',
        state: 'Abu Dhabi',
        country: 'United Arab Emirates'
      },
      baseCurrency: 'AED',
      contactName: 'Fatima Al Maktoum',
      contactPhone: '+971509876543',
      contactJobTitle: 'CEO',
      tradeLicenseNumber: 'ADBC-2020-445566',
      vatTrnNumber: 'TRN100345678901234'
    },
    company: {
      name: 'Desert Technologies FZE',
      registrationNumber: 'ADBC-2020-445566',
      taxId: 'TRN100345678901234',
      website: 'www.deserttech.ae',
      description: 'Leading smart home and IoT solutions distributor in the GCC region',
      industry: 'Technology',
      size: '50-100 employees',
      yearEstablished: 2020,
      monthlyVolume: 'AED 1,000,000 - AED 2,500,000',
      address: {
        street: 'Khalifa City, Technology Park',
        city: 'Abu Dhabi',
        state: 'Abu Dhabi',
        country: 'United Arab Emirates',
        postalCode: '00000'
      }
    }
  },
  {
    email: 'gulf.office@example.com',
    password: 'Seller123!',
    role: UserRole.SELLER,
    status: UserStatus.APPROVED,
    firstName: 'Mohammed',
    lastName: 'Hassan',
    phoneNumber: '+971504567890',
    emailVerified: true,
    onboardingCompleted: true,
    sellerProfile: {
      brandName: 'Gulf Office Pro',
      storeName: 'Gulf Office Supplies',
      primaryCategory: 'Office Supplies',
      businessName: 'Gulf Office Supplies LLC',
      website: 'www.gulfofficepro.com',
      address: {
        city: 'Sharjah',
        state: 'Sharjah',
        country: 'United Arab Emirates'
      },
      baseCurrency: 'AED',
      contactName: 'Mohammed Hassan',
      contactPhone: '+971504567890',
      contactJobTitle: 'Operations Director',
      tradeLicenseNumber: 'SHJ-2018-223344',
      vatTrnNumber: 'TRN100456789012345'
    },
    company: {
      name: 'Gulf Office Supplies LLC',
      registrationNumber: 'SHJ-2018-223344',
      taxId: 'TRN100456789012345',
      website: 'www.gulfofficepro.com',
      description: 'Complete office solutions and business supplies for the UAE market',
      industry: 'Business & Industrial',
      size: '100-250 employees',
      yearEstablished: 2018,
      monthlyVolume: 'AED 2,500,000 - AED 5,000,000',
      address: {
        street: 'Industrial Area 13, Warehouse 23',
        city: 'Sharjah',
        state: 'Sharjah',
        country: 'United Arab Emirates',
        postalCode: '00000'
      }
    }
  },
  {
    email: 'oasis.living@example.com',
    password: 'Seller123!',
    role: UserRole.SELLER,
    status: UserStatus.APPROVED,
    firstName: 'Layla',
    lastName: 'Ibrahim',
    phoneNumber: '+971507891234',
    emailVerified: true,
    onboardingCompleted: true,
    sellerProfile: {
      brandName: 'Oasis Living',
      storeName: 'Oasis Modern Living',
      primaryCategory: 'Home Decor',
      businessName: 'Oasis Living General Trading',
      website: 'www.oasisliving.ae',
      address: {
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates'
      },
      baseCurrency: 'AED',
      contactName: 'Layla Ibrahim',
      contactPhone: '+971507891234',
      contactJobTitle: 'Brand Manager',
      tradeLicenseNumber: 'DED-2021-556677',
      vatTrnNumber: 'TRN100567890123456'
    },
    company: {
      name: 'Oasis Living General Trading',
      registrationNumber: 'DED-2021-556677',
      taxId: 'TRN100567890123456',
      website: 'www.oasisliving.ae',
      description: 'Modern furniture and contemporary home accessories for luxury properties',
      industry: 'Home & Living',
      size: '10-25 employees',
      yearEstablished: 2021,
      monthlyVolume: 'AED 250,000 - AED 500,000',
      address: {
        street: 'Al Quoz Industrial Area 3',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        postalCode: '00000'
      }
    }
  },
  {
    email: 'emirate.smart@example.com',
    password: 'Seller123!',
    role: UserRole.SELLER,
    status: UserStatus.APPROVED,
    firstName: 'Khalid',
    lastName: 'Al Nahyan',
    phoneNumber: '+971502345678',
    emailVerified: true,
    onboardingCompleted: true,
    sellerProfile: {
      brandName: 'Emirate Smart Systems',
      storeName: 'Emirate Smart Home & Office',
      primaryCategory: 'Smart Home',
      businessName: 'Emirate Smart Systems FZCO',
      website: 'www.emiratesmart.com',
      address: {
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates'
      },
      baseCurrency: 'AED',
      contactName: 'Khalid Al Nahyan',
      contactPhone: '+971502345678',
      contactJobTitle: 'Business Development Manager',
      tradeLicenseNumber: 'DMCC-2022-112233',
      vatTrnNumber: 'TRN100678901234567'
    },
    company: {
      name: 'Emirate Smart Systems FZCO',
      registrationNumber: 'DMCC-2022-112233',
      taxId: 'TRN100678901234567',
      website: 'www.emiratesmart.com',
      description: 'Advanced smart home automation and office technology solutions for the Middle East',
      industry: 'Technology',
      size: '25-50 employees',
      yearEstablished: 2022,
      monthlyVolume: 'AED 500,000 - AED 1,000,000',
      address: {
        street: 'DMCC, Jumeirah Lake Towers',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
        postalCode: '00000'
      }
    }
  }
];

export const seedSellers = async () => {
  try {
    // Clear existing sellers (be careful with this in production!)
    await User.deleteMany({ role: UserRole.SELLER });
    console.log('🗑️  Cleared existing sellers');

    // Hash passwords and create sellers
    const hashedSellers = await Promise.all(
      sellers.map(async (seller) => ({
        ...seller,
        password: await bcrypt.hash(seller.password, 10)
      }))
    );

    // Insert new sellers
    const createdSellers = await User.insertMany(hashedSellers);
    console.log(`✅ Created ${createdSellers.length} sellers`);

    return createdSellers;
  } catch (error) {
    console.error('❌ Error seeding sellers:', error);
    throw error;
  }
};