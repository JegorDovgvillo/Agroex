import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchCountries } from '@thunks/fetchCountries';

const countryAdapter = createEntityAdapter();

const initialState = countryAdapter.getInitialState({
  loadingStatus: 'idle',
});

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        countryAdapter.addMany(state, action.payload);
      })
      .addCase(fetchCountries.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { reducer } = countriesSlice;

const { selectAll } = countryAdapter.getSelectors((state) => state.countries);

export const countrySelector = createSelector([selectAll], (countries) =>
  Object.values(countries)
);

export default reducer;
