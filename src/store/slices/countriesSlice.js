import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import {
  fetchCountries,
  fetchCountry,
  getCoordinate,
  getAddress,
} from '@thunks/fetchCountries';

const countryAdapter = createEntityAdapter();
const stateId = 'countries';

const initialState = countryAdapter.getInitialState({
  stateId,
  loadingStatus: 'idle',
  countryName: '',
  address: null,
  errors: null,
});

const countriesSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.countryName = action.payload;
    },
    clearCountriesErrors: (state) => {
      state.countries.errors = null;
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
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(fetchCountry.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.countryName = action.payload;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(getCoordinate.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getCoordinate.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.markerCoordinate = action.payload;
      })
      .addCase(getCoordinate.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(getAddress.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.address = action.payload;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      });
  },
});

const { reducer, actions } = countriesSlice;
export const { setCountry, clearCountriesErrors } = actions;
const { selectAll } = countryAdapter.getSelectors((state) => state.countries);

export const countrySelector = createSelector([selectAll], (countries) =>
  Object.values(countries)
);

export default reducer;
