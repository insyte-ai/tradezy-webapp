import Category from '../models/Category';
import slugify from 'slugify';

const categories = [
  {
    name: 'Home Decor',
    description: 'Wholesale home decoration, furniture, lighting, and interior design products',
    icon: '🏠',
    displayOrder: 1,
    metadata: {
      keywords: ['home decor', 'furniture', 'lighting', 'interior design', 'wholesale decor', 'bulk furniture'],
      seoTitle: 'Wholesale Home Decor & Furniture - TradeZy',
      seoDescription: 'Shop wholesale home decor and furniture from verified suppliers. Best B2B prices on bulk home decoration orders.'
    }
  },
  {
    name: 'Office Supplies',
    description: 'Business and office essentials, stationery, furniture, and equipment',
    icon: '🏢',
    displayOrder: 2,
    metadata: {
      keywords: ['office supplies', 'stationery', 'office furniture', 'business supplies', 'wholesale office', 'bulk stationery'],
      seoTitle: 'Wholesale Office Supplies & Equipment - TradeZy',
      seoDescription: 'Source wholesale office supplies and business essentials. Competitive bulk pricing for businesses.'
    }
  },
  {
    name: 'Smart Home',
    description: 'Smart home devices, IoT products, home automation, and connected technology',
    icon: '🤖',
    displayOrder: 3,
    metadata: {
      keywords: ['smart home', 'IoT', 'home automation', 'smart devices', 'wholesale smart home', 'bulk electronics'],
      seoTitle: 'Wholesale Smart Home & IoT Devices - TradeZy',
      seoDescription: 'Discover wholesale smart home and IoT products. Best B2B prices on home automation technology.'
    }
  },
  {
    name: 'Kitchen & Dining',
    description: 'Kitchenware, cookware, dining sets, and culinary accessories',
    icon: '🍽️',
    displayOrder: 4,
    metadata: {
      keywords: ['kitchenware', 'cookware', 'dining', 'kitchen accessories', 'wholesale kitchen', 'bulk cookware'],
      seoTitle: 'Wholesale Kitchen & Dining Products - TradeZy',
      seoDescription: 'Shop wholesale kitchenware and dining products. Premium quality at wholesale prices.'
    }
  },
  {
    name: 'Lighting & Fixtures',
    description: 'Indoor and outdoor lighting, LED solutions, and decorative fixtures',
    icon: '💡',
    displayOrder: 5,
    metadata: {
      keywords: ['lighting', 'LED', 'fixtures', 'lamps', 'wholesale lighting', 'bulk LED'],
      seoTitle: 'Wholesale Lighting & Fixtures - TradeZy',
      seoDescription: 'Source wholesale lighting solutions and fixtures. Best prices for bulk lighting orders.'
    }
  }
];

export const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Add slugs to categories
    const categoriesWithSlugs = categories.map(cat => ({
      ...cat,
      slug: slugify(cat.name, { lower: true, strict: true })
    }));

    // Insert new categories
    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(`✅ Created ${createdCategories.length} categories`);

    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};