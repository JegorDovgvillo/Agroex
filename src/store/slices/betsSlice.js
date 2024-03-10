import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchPlaceBet, fetchBetsByLotId } from '@thunks/fetchBets';

const betsAdapter = createEntityAdapter();

const initialState = betsAdapter.getInitialState({
  loadingStatus: 'idle',
  placeBetLoadingStatus: 'idle',
  newBet: null,
});

const betsSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {
    clearPlaceBetLoadingStatus: (state) => {
      state.placeBetLoadingStatus = 'idle';
    },
    setNewBet: (state, action) => {
      state.newBet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceBet.pending, (state) => {
        state.placeBetLoadingStatus = 'pending';
      })
      .addCase(fetchPlaceBet.fulfilled, (state, action) => {
        state.placeBetLoadingStatus = 'fulfilled';
        betsAdapter.setOne(state, action.payload);
      })
      .addCase(fetchPlaceBet.rejected, (state) => {
        state.placeBetLoadingStatus = 'rejected';
      })
      .addCase(fetchBetsByLotId.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchBetsByLotId.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        betsAdapter.setMany(state, action.payload);
      })
      .addCase(fetchBetsByLotId.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = betsSlice;

export const { clearPlaceBetLoadingStatus, setNewBet } = actions;

const { selectAll } = betsAdapter.getSelectors((state) => state.bets);

export const betsSelector = createSelector([selectAll], (bets) =>
  Object.values(bets)
);

export default reducer;
