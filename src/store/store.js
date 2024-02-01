import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import lotDetails from './slices/lotDetailsSlice';
import usersList from './slices/usersListSlice';

import lotList from "./slices/lotListSlice";
import users from "./slices/usersSlice";
import users from './slices/usersSlice';
import modal from './slices/modalSlice';
import categories from './slices/categoriesSlice';
import countries from './slices/countriesSlice';

const store = configureStore({
  reducer: { lotList, lotDetails, users, modal, categories, countries },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
