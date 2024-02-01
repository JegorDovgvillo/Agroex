import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import lotDetails from './slices/lotDetailsSlice';
import usersList from './slices/usersListSlice';

import lotList from "./slices/lotListSlice";
import users from "./slices/usersSlice";
import users from './slices/usersSlice';
import modal from './slices/modalSlice';

const store = configureStore({
  reducer: { lotList, lotDetails,users,modal },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
