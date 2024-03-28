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
  loadingStatus: false,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loadingStatus = false;
        countryAdapter.addMany(state, action.payload);
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(fetchCountry.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.countryName = action.payload;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(getCoordinate.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(getCoordinate.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.markerCoordinate = action.payload;
      })
      .addCase(getCoordinate.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(getAddress.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.address = action.payload;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      });
  },
});

const { reducer, actions } = countriesSlice;
export const { setCountry } = actions;
const { selectAll } = countryAdapter.getSelectors((state) => state.countries);

export const countrySelector = createSelector([selectAll], (countries) =>
  Object.values(countries)
);

export default reducer;
