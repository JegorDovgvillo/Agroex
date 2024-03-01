import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import {
  fetchLots,
  fetchLotDetails,
  updateLot,
  deleteLot,
  createLot,
  filteredLots,
  changeLotStatusByUser,
  changeLotStatusByAdmin,
} from '@thunks/fetchLots';

const lotListAdapter = createEntityAdapter();

const initialState = lotListAdapter.getInitialState({
  loadingStatus: 'idle',
  changeLotLoadingStatus: 'idle',
  lotId: null,
  errors: null,
});

const lotListSlice = createSlice({
  name: 'lotList',
  initialState,
  reducers: {
    setLotId: (state, action) => {
      state.lotId = action.payload;
    },
    clearLots: (state) => {
      lotListAdapter.removeAll(state);
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    clearChangeLotLoadingStatus: (state) => {
      state.changeLotLoadingStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchLots.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        lotListAdapter.addMany(state, action.payload);
      })
      .addCase(fetchLots.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(updateLot.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateLot.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        lotListAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateLot.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(fetchLotDetails.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchLotDetails.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(fetchLotDetails.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(deleteLot.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(deleteLot.fulfilled, (state, action) => {
        lotListAdapter.removeOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(deleteLot.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(createLot.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(createLot.fulfilled, (state, action) => {
        lotListAdapter.addOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(createLot.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(filteredLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(filteredLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(filteredLots.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(changeLotStatusByUser.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(changeLotStatusByUser.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(changeLotStatusByUser.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(changeLotStatusByAdmin.pending, (state) => {
        state.changeLotLoadingStatus = 'pending';
      })
      .addCase(changeLotStatusByAdmin.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.changeLotLoadingStatus = 'fulfilled';
      })
      .addCase(changeLotStatusByAdmin.rejected, (state, action) => {
        state.changeLotLoadingStatus = 'rejected';
        state.errors = action.payload;
      });
  },
});

const { selectAll } = lotListAdapter.getSelectors((state) => state.lotList);

export const lotListSelector = createSelector([selectAll], (lotList) =>
  Object.values(lotList)
);

export const { selectById: selectLotDetailById } = lotListAdapter.getSelectors(
  (state) => state.lotList
);

const { actions, reducer } = lotListSlice;
export const { setLotId, clearLots, clearErrors, clearChangeLotLoadingStatus } =
  actions;

export default reducer;
