import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import orderServiceReducer from './orderServiceSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    OrderServiceData: orderServiceReducer
  },
});

export default store;
