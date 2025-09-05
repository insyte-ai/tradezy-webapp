import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import storeReducer from './slices/storeSlice';
import brandReducer from './slices/brandSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    stores: storeReducer,
    brands: brandReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;