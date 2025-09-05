import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import brandService, { Brand, BrandDetails } from '../../services/brandService';

interface BrandState {
  brands: Brand[];
  currentBrand: BrandDetails | null;
  featuredBrands: Brand[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

const initialState: BrandState = {
  brands: [],
  currentBrand: null,
  featuredBrands: [],
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
export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async (filters?: any) => {
    return await brandService.getBrands(filters);
  }
);

export const fetchBrandBySlug = createAsyncThunk(
  'brands/fetchBySlug',
  async (slug: string) => {
    return await brandService.getBrandBySlug(slug);
  }
);

export const fetchFeaturedBrands = createAsyncThunk(
  'brands/fetchFeatured',
  async () => {
    return await brandService.getFeaturedBrands();
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch all brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brands';
      });

    // Fetch brand by slug
    builder
      .addCase(fetchBrandBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBrand = action.payload;
      })
      .addCase(fetchBrandBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brand';
      });

    // Fetch featured brands
    builder
      .addCase(fetchFeaturedBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBrands = action.payload;
      })
      .addCase(fetchFeaturedBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured brands';
      });
  }
});

export const { clearCurrentBrand, setError } = brandSlice.actions;
export default brandSlice.reducer;