import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,

  reducers: {
    setAddress: (state, action) => {
      state.addressList = [...action.payload];
    },
  },
});

export const { setAddress } = addressSlice.actions;

export default addressSlice.reducer;
