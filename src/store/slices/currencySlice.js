import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { CURRENCY } from '@helpers/currency';

const currencyAdapter = createEntityAdapter();

const initialState = currencyAdapter.getInitialState({
  selectedCurrency: CURRENCY[0].key,
});

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
  },
});

const { actions, reducer } = currencySlice;

export const { setSelectedCurrency } = actions;
export const getSelectedCurrency = (state) => state.currency.selectedCurrency;
export default reducer;
