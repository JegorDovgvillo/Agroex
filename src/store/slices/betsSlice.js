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
  loadingStatus: null,
  placeBetLoadingStatus: false,
  newBet: null,
  errors: null,
});

const betsSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    clearPlaceBetLoadingStatus: (state) => {
      state.placeBetLoadingStatus = false;
    },
    setNewBet: (state, action) => {
      state.newBet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceBet.pending, (state) => {
        state.errors = null;
        state.placeBetLoadingStatus = true;
        state.loadingStatus = true;
      })
      .addCase(fetchPlaceBet.fulfilled, (state, action) => {
        state.placeBetLoadingStatus = false;
        state.loadingStatus = false;
        betsAdapter.setOne(state, action.payload);
      })
      .addCase(fetchPlaceBet.rejected, (state, action) => {
        state.placeBetLoadingStatus = false;
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(fetchBetsByLotId.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchBetsByLotId.fulfilled, (state, action) => {
        state.loadingStatus = false;
        betsAdapter.setMany(state, action.payload);
      })
      .addCase(fetchBetsByLotId.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
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
