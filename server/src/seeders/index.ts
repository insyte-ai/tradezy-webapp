import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import mongoose from 'mongoose';
import { seedCategories } from './categorySeeder';
import { seedSellers } from './sellerSeeder';
import { seedStores } from './storeSeeder';
import { seedProducts } from './productSeeder';
import seedBrands from './brandSeeder';

const runSeeders = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradezy';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');

    // Run seeders in order
    console.log('\n🌱 Starting database seeding...\n');

    // 1. Seed categories
    console.log('📂 Seeding categories...');
    await seedCategories();

    // 2. Seed brands
    console.log('\n🏷️ Seeding brands...');
    await seedBrands();

    // 3. Seed sellers
    console.log('\n👥 Seeding sellers...');
    await seedSellers();

    // 4. Seed stores
    console.log('\n🏪 Seeding stores...');
    await seedStores();

    // 5. Seed products
    console.log('\n📦 Seeding products...');
    await seedProducts();

    console.log('\n✨ Database seeding completed successfully!\n');
    
    // Display summary
    console.log('Summary:');
    console.log('--------');
    console.log('✅ 5 Categories created');
    console.log('✅ 5 Brands created');
    console.log('✅ 5 Sellers created');
    console.log('✅ 5 Stores created');
    console.log('✅ 5 Products created');
    console.log('\nYou can now login with any of these seller accounts:');
    console.log('Email: majlis.interiors@example.com | Password: Seller123!');
    console.log('Email: desert.tech@example.com | Password: Seller123!');
    console.log('Email: gulf.office@example.com | Password: Seller123!');
    console.log('Email: oasis.living@example.com | Password: Seller123!');
    console.log('Email: emirate.smart@example.com | Password: Seller123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeders
runSeeders();