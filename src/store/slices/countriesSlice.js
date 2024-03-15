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

const initialState = countryAdapter.getInitialState({
  loadingStatus: 'idle',
  countryName: '',
  address: null,
});

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.countryName = action.payload;
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
      .addCase(getCoordinate.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getCoordinate.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        state.markerCoordinate = action.payload;
      })
      .addCase(getCoordinate.rejected, (state) => {
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
export const { setCountry } = actions;
const { selectAll } = countryAdapter.getSelectors((state) => state.countries);

export const countrySelector = createSelector([selectAll], (countries) =>
  Object.values(countries)
);

export default reducer;
