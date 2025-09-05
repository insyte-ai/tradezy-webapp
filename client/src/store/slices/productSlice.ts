import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import productService, { 
  Product, 
  ProductFilterParams, 
  FilterOptions 
} from '../../services/productService';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilterParams;
  filterOptions: FilterOptions | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  filters: {
    page: 1,
    limit: 20,
    sort: '-createdAt'
  },
  filterOptions: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: 20
  },
  isLoading: false,
  error: null,
  viewMode: 'grid'
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters?: ProductFilterParams) => {
    return await productService.getProducts(filters);
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categorySlug, filters }: { 
    categorySlug: string; 
    filters?: Omit<ProductFilterParams, 'category'> 
  }) => {
    return await productService.getProductsByCategory(categorySlug, filters);
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug: string) => {
    return await productService.getProductBySlug(slug);
  }
);

export const fetchFilterOptions = createAsyncThunk(
  'products/fetchFilterOptions',
  async (category?: string) => {
    return await productService.getFilterOptions(category);
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    updateFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.filters = { 
        ...state.filters, 
        [action.payload.key]: action.payload.value,
        page: 1 // Reset to first page when filter changes
      };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        sort: '-createdAt'
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.filters.sort = action.payload;
      state.filters.page = 1; // Reset to first page when sorting changes
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Fetch products by category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Fetch product by slug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // Fetch filter options
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch filter options';
      });
  }
});

export const { 
  setFilters, 
  updateFilter,
  clearFilters,
  setPage,
  setSort,
  setViewMode,
  clearCurrentProduct,
  setError 
} = productSlice.actions;

export default productSlice.reducer;