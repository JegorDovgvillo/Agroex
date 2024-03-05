import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import {
  fetchCountries,
  fetchCountry,
  getCordinate,
  getAddress,
} from '@thunks/fetchCountries';

const countryAdapter = createEntityAdapter();

const initialState = countryAdapter.getInitialState({
  loadingStatus: 'idle',
  countryName: '',
  countryCordinate: null,
  address: null,
});

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    updateCordinate: (state, action) => {
      state.countryCordinate = action.payload;
    },
  },
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
      })
      .addCase(fetchCountry.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.countryName = action.payload;
      })
      .addCase(fetchCountry.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(getCordinate.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getCordinate.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.countryCordinate = action.payload;
      })
      .addCase(getCordinate.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(getAddress.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.address = action.payload;
      })
      .addCase(getAddress.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { reducer, actions } = countriesSlice;
export const { updateCordinate } = actions;
const { selectAll } = countryAdapter.getSelectors((state) => state.countries);

export const countrySelector = createSelector([selectAll], (countries) =>
  Object.values(countries)
);

export default reducer;
