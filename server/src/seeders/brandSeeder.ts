import Brand from '../models/Brand';
import slugify from 'slugify';

const brands = [
  {
    name: 'Nest Home',
    description: 'Premium home decor and furnishing solutions for modern UAE homes',
    country: 'UAE',
    featured: true,
    verified: true,
    establishedYear: 2015,
    website: 'https://nesthome.ae',
    certifications: ['ISO 9001', 'Dubai Quality Mark'],
    logo: 'https://images.pexels.com/photos/6580227/pexels-photo-6580227.jpeg',
  },
  {
    name: 'Desert Bloom Decor',
    description: 'Luxury Arabic-inspired home decorations and furniture',
    country: 'UAE',
    featured: true,
    verified: true,
    establishedYear: 2018,
    website: 'https://desertbloom.ae',
    certifications: ['ISO 14001', 'Green Building Certified'],
    logo: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg',
  },
  {
    name: 'Smart Tech Solutions',
    description: 'Leading provider of smart home and office automation in the Middle East',
    country: 'UAE',
    featured: true,
    verified: true,
    establishedYear: 2019,
    website: 'https://smarttechsolutions.ae',
    certifications: ['CE Certified', 'Energy Star Partner'],
    logo: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
  },
  {
    name: 'Oasis Office Supplies',
    description: 'Complete office solutions for businesses across the Emirates',
    country: 'UAE',
    featured: false,
    verified: true,
    establishedYear: 2012,
    website: 'https://oasisoffice.ae',
    certifications: ['ISO 9001', 'Sharjah Excellence Award'],
    logo: 'https://images.pexels.com/photos/7731328/pexels-photo-7731328.jpeg',
  },
  {
    name: 'Lumina Lighting',
    description: 'Contemporary lighting solutions for residential and commercial spaces',
    country: 'UAE',
    featured: false,
    verified: false,
    establishedYear: 2020,
    website: 'https://luminalighting.ae',
    certifications: ['RoHS Compliant'],
    logo: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg',
  }
];

async function seedBrands() {
  try {
    // Clear existing brands
    await Brand.deleteMany({});
    console.log('Cleared existing brands');

    // Create brands with proper slugs
    const brandsWithSlugs = brands.map(brand => ({
      ...brand,
      slug: slugify(brand.name, { lower: true, strict: true }),
      socialMedia: {
        instagram: `https://instagram.com/${slugify(brand.name, { lower: true, strict: true })}`,
        linkedin: `https://linkedin.com/company/${slugify(brand.name, { lower: true, strict: true })}`
      },
      metrics: {
        totalProducts: Math.floor(Math.random() * 100) + 20,
        totalStores: Math.floor(Math.random() * 20) + 5,
        averageRating: (Math.random() * 2 + 3).toFixed(1)
      }
    }));

    const createdBrands = await Brand.insertMany(brandsWithSlugs);
    console.log(`✅ Created ${createdBrands.length} brands`);

    return createdBrands;
  } catch (error) {
    console.error('Error seeding brands:', error);
    throw error;
  }
}

export default seedBrands;