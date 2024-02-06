import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import usersList from './slices/usersListSlice';
import modal from './slices/modalSlice';
import categories from './slices/categoriesSlice';
import countries from './slices/countriesSlice';
import images from './slices/imagesSlice';

const store = configureStore({
  reducer: { lotList, usersList, modal, categories, countries, images },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
