import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  basePrice?: {
    wholesale: number;
    minQuantity: number;
    currency: string;
  };
  category: string;
  seller: {
    id: string;
    name: string;
  };
  status: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params?: any) => {
    const response = await axios.get('/api/products', { params });
    return response.data;
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug: string) => {
    const response = await axios.get(`/api/products/${slug}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;