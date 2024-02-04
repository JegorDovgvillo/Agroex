import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import usersList from './slices/usersListSlice';
import modal from './slices/modalSlice';
import categories from './slices/categoriesSlice';
import countries from './slices/countriesSlice';

const store = configureStore({
  reducer: { lotList, usersList, modal, categories, countries },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
