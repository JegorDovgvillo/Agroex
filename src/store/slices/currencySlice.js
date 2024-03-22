import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const currencyAdapter = createEntityAdapter();

const initialState = currencyAdapter.getInitialState({
  selectedCurrency: null,
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
