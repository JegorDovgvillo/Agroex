import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import usersList from './slices/usersListSlice';
import modal from './slices/modalSlice';
import categories from './slices/categoriesSlice';
import countries from './slices/countriesSlice';
import tags from './slices/tagsSlice';

const store = configureStore({
  reducer: {
    lotList,
    usersList,
    modal,
    categories,
    countries,
    tags,
  },
  devTools: import.meta.env.DEV,
});

export default store;
