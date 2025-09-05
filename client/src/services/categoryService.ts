import api from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
    slug: string;
  };
  level: number;
  image?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  metadata?: {
    keywords?: string[];
    seoTitle?: string;
    seoDescription?: string;
  };
}

export interface CategoryHierarchy {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  categories: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    subcategories: {
      _id: string;
      name: string;
      slug: string;
      description?: string;
    }[];
  }[];
}

class CategoryService {
  // Get all categories
  async getAllCategories(params?: {
    isActive?: boolean;
    parent?: string | null;
  }): Promise<Category[]> {
    const { data } = await api.get('/categories', { params });
    return data.data;
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<{
    category: Category;
    subcategories: Category[];
  }> {
    const { data } = await api.get(`/categories/${slug}`);
    return data.data;
  }

  // Get category hierarchy for navigation
  async getCategoryHierarchy(): Promise<CategoryHierarchy[]> {
    const { data } = await api.get('/categories/hierarchy');
    return data.data;
  }

  // Get featured categories
  async getFeaturedCategories(): Promise<Category[]> {
    const { data } = await api.get('/categories/featured');
    return data.data;
  }
}

export default new CategoryService();