import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers'; // Adjust the path based on your project structure

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

export default store;
