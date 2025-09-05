import api from './api';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];  // Changed back to array of strings
  videos?: string[];
  brand?: string;
  basePrice?: {
    wholesale: number;
    minQuantity: number;
    currency: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  seller: any;
  store?: {
    name: string;
    slug: string;
    logo?: string;
    ratings: {
      average: number;
      count: number;
    };
  };
  price?: {
    wholesale: number;
    minQuantity: number;
    currency: string;
  };
  variants?: any[];
  shipping: {
    estimatedDays?: number;
    freeShipping?: boolean;
  };
  ratings: {
    average: number;
    count: number;
  };
  tags?: string[];
  inStock: boolean;
  features?: string[];
  specifications?: Record<string, any>;
  certifications?: any[];
}

export interface ProductFilterParams {
  category?: string;
  subcategory?: string;
  brands?: string[];  // Changed from brand to brands array
  priceRange?: {      // Changed from minPrice/maxPrice to priceRange object
    min?: number;
    max?: number;
  };
  moqRange?: {        // Changed from minQuantity to moqRange object
    min?: number;
    max?: number;
  };
  leadTime?: string;
  seller?: string;
  store?: string;
  search?: string;
  tags?: string[];
  inStock?: boolean;
  freeShipping?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface FilterOptions {
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  leadTimes?: string[];
  leadTimeRanges: {
    label: string;
    value: string;
  }[];
  stores: {
    name: string;
    slug: string;
  }[];
}

class ProductService {
  // Get products with filters
  async getProducts(filters?: ProductFilterParams): Promise<ProductsResponse> {
    const { data } = await api.get('/products', { params: filters });
    return data.data;
  }

  // Get products by category
  async getProductsByCategory(
    categorySlug: string,
    filters?: Omit<ProductFilterParams, 'category'>
  ): Promise<ProductsResponse> {
    const { data } = await api.get(`/products/category/${categorySlug}`, { 
      params: filters 
    });
    return data.data;
  }

  // Get single product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await api.get(`/products/${slug}`);
    return data.data;
  }

  // Get filter options for a category
  async getFilterOptions(category?: string): Promise<FilterOptions> {
    const { data } = await api.get('/products/filters', { 
      params: { category } 
    });
    return data.data;
  }
}

export default new ProductService();