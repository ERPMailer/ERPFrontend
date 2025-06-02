import { createSlice } from "@reduxjs/toolkit";

const erpMailerSlice = createSlice({
  name: "erpmailer",

  initialState: {
    value: 0,
    user: {},
  },
  reducers: {
    incremented: (state) => {
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { incremented, decremented, setUserData } = erpMailerSlice.actions;

export default erpMailerSlice;
