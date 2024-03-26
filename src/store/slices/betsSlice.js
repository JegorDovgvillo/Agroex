import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchPlaceBet, fetchBetsByLotId } from '@thunks/fetchBets';

const betsAdapter = createEntityAdapter();
const stateId = 'bets';

const initialState = betsAdapter.getInitialState({
  stateId,
  loadingStatus: 'idle',
  placeBetLoadingStatus: 'idle',
  newBet: null,
  errors: null,
});

const betsSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    clearPlaceBetLoadingStatus: (state) => {
      state.placeBetLoadingStatus = 'idle';
    },
    setNewBet: (state, action) => {
      state.newBet = action.payload;
    },
    clearBetsErrors: (state) => {
      state.bets.errors = null;
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
      .addCase(fetchPlaceBet.rejected, (state, action) => {
        state.placeBetLoadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(fetchBetsByLotId.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchBetsByLotId.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        betsAdapter.setMany(state, action.payload);
      })
      .addCase(fetchBetsByLotId.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      });
  },
});

const { actions, reducer } = betsSlice;

export const { clearPlaceBetLoadingStatus, setNewBet, clearBetsErrors } =
  actions;

const { selectAll } = betsAdapter.getSelectors((state) => state.bets);

export const betsSelector = createSelector([selectAll], (bets) =>
  Object.values(bets)
);

export default reducer;
