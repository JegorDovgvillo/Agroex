import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchLotDetails } from '../thunks/fetchLotDetails';

const lotDetailsAdapter = createEntityAdapter();

const initialState = lotDetailsAdapter.getInitialState({
  loadingStatus: 'idle',
  lotID: 1,
});

const lotDetailsSlice = createSlice({
  name: 'lotDetails',
  initialState,

  reducers: {
    updateId: (state, action) => {
      state.lotID = action.payload;
    },

    updateLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLotDetails.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchLotDetails.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        lotDetailsAdapter.setOne(state, action.payload);
      })
      .addCase(fetchLotDetails.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = lotDetailsSlice;
export const { updateId, updateLoadingStatus } = actions;
export default reducer;

export const { selectById: selectLotDetailById } =
  lotDetailsAdapter.getSelectors((state) => state.lotDetails);
