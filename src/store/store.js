import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import lotDetails from './slices/lotDetailsSlice';

const store = configureStore({
  reducer: { lotList, lotDetails },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
