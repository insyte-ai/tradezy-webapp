import api from './api';

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  country: string;
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  featured: boolean;
  verified: boolean;
  establishedYear?: number;
  certifications?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  metrics?: {
    totalProducts: number;
    totalStores: number;
    averageRating: number;
  };
}

export interface BrandDetails {
  brand: Brand;
  topProducts: any[];
  stores: any[];
  statistics: {
    totalProducts: number;
    totalStores: number;
  };
}

const brandService = {
  async getBrands(filters?: any) {
    const response = await api.get('/brands', { params: filters });
    return response.data;
  },

  async getBrandBySlug(slug: string): Promise<BrandDetails> {
    const response = await api.get(`/brands/${slug}`);
    return response.data;
  },

  async getFeaturedBrands(): Promise<Brand[]> {
    const response = await api.get('/brands/featured');
    return response.data;
  }
};

export default brandService;