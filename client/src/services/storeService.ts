import api from './api';
import { Product } from './productService';

export interface Store {
  _id: string;
  seller: any;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  categories: any[];
  contact: {
    email: string;
    phoneNumber: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  businessInfo?: {
    employeeCount?: string;
    minimumOrder?: number;
    leadTime?: string;
    paymentTerms?: string[];
    shippingTerms?: string[];
    capabilities?: string[];
    certifications?: any[];
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  policies?: {
    return?: string;
    shipping?: string;
    warranty?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  metrics: {
    totalProducts: number;
    totalOrders: number;
    responseTime: string;
    fulfillmentRate: number;
  };
  isActive: boolean;
  isPremium: boolean;
  featured?: {
    products?: any[];
    collections?: any[];
  };
}

export interface StoresResponse {
  stores: Store[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface StoreFilters {
  category?: string;
  featured?: boolean;
  verified?: boolean;
  isPremium?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface StoreDetails {
  store: Store;
  statistics: {
    totalProducts: number;
    totalOrders?: number;
    responseTime?: string;
    fulfillmentRate?: number;
  };
  topProducts: Product[];
}

class StoreService {
  // Get all stores
  async getStores(filters?: StoreFilters): Promise<StoresResponse> {
    const { data } = await api.get('/stores', { params: filters });
    return data.data;
  }

  // Get store by slug
  async getStoreBySlug(slug: string): Promise<StoreDetails> {
    const { data } = await api.get(`/stores/${slug}`);
    return data.data;
  }

  // Get store products
  async getStoreProducts(slug: string, filters?: any): Promise<any> {
    const { data } = await api.get(`/stores/${slug}/products`, { 
      params: filters 
    });
    return data.data;
  }

  // Get featured stores
  async getFeaturedStores(): Promise<Store[]> {
    const { data } = await api.get('/stores/featured');
    return data.data;
  }
}

export default new StoreService();