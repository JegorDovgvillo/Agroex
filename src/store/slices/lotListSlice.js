import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import _ from 'lodash';

import {
  fetchLots,
  fetchLotDetails,
  updateLot,
  deleteLot,
  createLot,
  filteredLots,
  changeLotStatusByUser,
  changeLotStatusByAdmin,
  getFilteredLots,
  fetchDeal,
  fetchUserActivityLots,
} from '@thunks/fetchLots';

const lotListAdapter = createEntityAdapter();

const initialState = lotListAdapter.getInitialState({
  loadingStatus: 'idle',
  changeLotLoadingStatus: 'idle',
  createLotStatus: 'idle',
  updateLotStatus: 'idle',
  deleteLotStatus: 'idle',
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
      state.loadingStatus = 'idle';
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    clearStatus: (state, action) => {
      state[action.payload] = 'idle';
    },
    deleteError: (state, action) => {
      if (!state.errors) return;

      state.errors.errors = _.omit(state.errors.errors, action.payload);

      if (_.isEmpty(state.errors.errors)) {
        state.errors = null;
      }
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
        state.updateLotStatus = 'pending';
      })
      .addCase(updateLot.fulfilled, (state, action) => {
        state.updateLotStatus = 'fulfilled';
        lotListAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateLot.rejected, (state, action) => {
        state.updateLotStatus = 'rejected';
        state.errors = action.payload;
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
        state.deleteLotStatus = 'pending';
      })
      .addCase(deleteLot.fulfilled, (state, action) => {
        const { id } = action.meta.arg;

        lotListAdapter.removeOne(state, id);
        state.deleteLotStatus = 'fulfilled';
      })
      .addCase(deleteLot.rejected, (state, action) => {
        state.deleteLotStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(createLot.pending, (state) => {
        state.createLotStatus = 'pending';
      })
      .addCase(createLot.fulfilled, (state, action) => {
        lotListAdapter.addOne(state, action.payload);
        state.createLotStatus = 'fulfilled';
      })
      .addCase(createLot.rejected, (state, action) => {
        state.createLotStatus = 'rejected';
        state.errors = action.payload;
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
        lotListAdapter.upsertOne(state, action.payload);
        state.changeLotLoadingStatus = 'fulfilled';
      })
      .addCase(changeLotStatusByAdmin.rejected, (state, action) => {
        state.changeLotLoadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(getFilteredLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getFilteredLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(getFilteredLots.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(fetchDeal.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        lotListAdapter.upsertOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(fetchDeal.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(fetchUserActivityLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchUserActivityLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(fetchUserActivityLots.rejected, (state) => {
        state.loadingStatus = 'rejected';
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
export const { setLotId, clearLots, clearErrors, clearStatus, deleteError } =
  actions;

export default reducer;
