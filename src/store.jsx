import { configureStore } from "@reduxjs/toolkit";
import erpMailerSlice from "./redux/ERPSlice";

const store = configureStore({
  reducer: erpMailerSlice.reducer,
});

export default store;
