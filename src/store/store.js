import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';

const store = configureStore({
  reducer: { lotList },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
