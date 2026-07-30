import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCategory: [],
  subCategory: [],
  products: [],
  loadingCategory: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = action.payload;
    },
    setSubCategory: (state, action) => {
      state.subCategory = action.payload;
    },
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
    setAllProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const {
  setAllCategory,
  setSubCategory,
  setAllProducts,
  setLoadingCategory,
} = productSlice.actions;

export default productSlice.reducer;
