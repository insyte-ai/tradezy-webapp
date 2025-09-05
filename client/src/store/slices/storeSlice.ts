import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import storeService, { Store, StoreDetails } from '../../services/storeService';

interface StoreState {
  stores: Store[];
  currentStore: StoreDetails | null;
  featuredStores: Store[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  featuredStores: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: 20
  }
};

// Async thunks
export const fetchStores = createAsyncThunk(
  'stores/fetchAll',
  async (filters?: any) => {
    return await storeService.getStores(filters);
  }
);

export const fetchStoreBySlug = createAsyncThunk(
  'stores/fetchBySlug',
  async (slug: string) => {
    return await storeService.getStoreBySlug(slug);
  }
);

export const fetchStoreProducts = createAsyncThunk(
  'stores/fetchProducts',
  async ({ slug, filters }: { slug: string; filters?: any }) => {
    return await storeService.getStoreProducts(slug, filters);
  }
);

export const fetchFeaturedStores = createAsyncThunk(
  'stores/fetchFeatured',
  async () => {
    return await storeService.getFeaturedStores();
  }
);

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearCurrentStore: (state) => {
      state.currentStore = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch all stores
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.stores;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stores';
      });

    // Fetch store by slug
    builder
      .addCase(fetchStoreBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchStoreBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch store';
      });

    // Fetch featured stores
    builder
      .addCase(fetchFeaturedStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedStores.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredStores = action.payload;
      })
      .addCase(fetchFeaturedStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured stores';
      });
  }
});

export const { clearCurrentStore, setError } = storeSlice.actions;
export default storeSlice.reducer;