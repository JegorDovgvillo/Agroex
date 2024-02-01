import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import lotDetails from './slices/lotDetailsSlice';
import usersList from './slices/usersListSlice';

const store = configureStore({
  reducer: { lotList, lotDetails, usersList },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
