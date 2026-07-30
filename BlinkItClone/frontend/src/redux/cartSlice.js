import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;

      state.totalQuantity = action.payload.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
    },
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
