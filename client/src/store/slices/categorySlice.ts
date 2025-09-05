import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import categoryService, { Category, CategoryHierarchy } from '../../services/categoryService';

interface CategoryState {
  categories: Category[];
  hierarchy: CategoryHierarchy[];
  featuredCategories: Category[];
  currentCategory: Category | null;
  subcategories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  hierarchy: [],
  featuredCategories: [],
  currentCategory: null,
  subcategories: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (params?: { isActive?: boolean; parent?: string | null }) => {
    return await categoryService.getAllCategories(params);
  }
);

export const fetchCategoryHierarchy = createAsyncThunk(
  'categories/fetchHierarchy',
  async () => {
    return await categoryService.getCategoryHierarchy();
  }
);

export const fetchFeaturedCategories = createAsyncThunk(
  'categories/fetchFeatured',
  async () => {
    return await categoryService.getFeaturedCategories();
  }
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchBySlug',
  async (slug: string) => {
    return await categoryService.getCategoryBySlug(slug);
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
      state.subcategories = [];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Fetch hierarchy
    builder
      .addCase(fetchCategoryHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.hierarchy = action.payload;
      })
      .addCase(fetchCategoryHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category hierarchy';
      });

    // Fetch featured categories
    builder
      .addCase(fetchFeaturedCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredCategories = action.payload;
      })
      .addCase(fetchFeaturedCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured categories';
      });

    // Fetch category by slug
    builder
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload.category;
        state.subcategories = action.payload.subcategories;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category';
      });
  }
});

export const { clearCurrentCategory, setError } = categorySlice.actions;
export default categorySlice.reducer;