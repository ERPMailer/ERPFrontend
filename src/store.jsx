import { configureStore } from "@reduxjs/toolkit";
import erpMailerSlice from "./redux/ERPSlice";

const store = configureStore({
  reducer: {
    erpMailer: erpMailerSlice.reducer, // key name becomes state.erpMailer
  },
});

export default store;
