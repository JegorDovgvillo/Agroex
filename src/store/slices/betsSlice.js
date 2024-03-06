import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchPlaceBet } from '@thunks/fetchBets';

const betsAdapter = createEntityAdapter();

const initialState = betsAdapter.getInitialState({
  loadingStatus: 'idle',
});

const betsSlice = createSlice({
  name: 'bets',
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceBet.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchPlaceBet.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        betsAdapter.setOne(state, action.payload);
      })
      .addCase(fetchPlaceBet.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { reducer } = betsSlice;

const { selectAll } = betsAdapter.getSelectors((state) => state.bets);

export const betsSelector = createSelector([selectAll], (bets) =>
  Object.values(bets)
);

export default reducer;
