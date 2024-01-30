import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchLots } from '../thunks/fetchLots';

const lotListAdapter = createEntityAdapter();

const initialState = lotListAdapter.getInitialState({
  loadingStatus: 'idle',
});

const lotListSlice = createSlice({
  name: 'lotList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchLots.fulfilled, (state, action) => {
        (state.loadingStatus = 'fulfilled'),
        lotListAdapter.addMany(state, action.payload);
      })
      .addCase(fetchLots.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { selectAll } = lotListAdapter.getSelectors((state) => state.lotList);

export const lotListSelector = createSelector([selectAll], (lotList) =>
  Object.values(lotList)
);

const { reducer } = lotListSlice;

export default reducer;
