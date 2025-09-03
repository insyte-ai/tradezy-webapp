import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  minQuantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId && 
                item.variantId === action.payload.variantId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>) => {
      const item = state.items.find(
        item => item.productId === action.payload.productId && 
                item.variantId === action.payload.variantId
      );

      if (item) {
        item.quantity = action.payload.quantity;
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; variantId?: string }>) => {
      state.items = state.items.filter(
        item => !(item.productId === action.payload.productId && 
                  item.variantId === action.payload.variantId)
      );
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;