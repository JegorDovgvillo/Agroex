import { configureStore } from '@reduxjs/toolkit';

import lotList from './slices/lotListSlice';
import usersList from './slices/usersListSlice';
import modal from './slices/modalSlice';
import categories from './slices/categoriesSlice';
import countries from './slices/countriesSlice';
import tags from './slices/tagsSlice';
import bets from './slices/betsSlice';
import currency from './slices/currencySlice';
import reports from './slices/reportsSlice';
import sse from './slices/sseSlice';

const store = configureStore({
  reducer: {
    lotList,
    usersList,
    modal,
    categories,
    countries,
    tags,
    bets,
    currency,
    reports,
    sse,
  },
  devTools: import.meta.env.DEV,
});

export default store;
