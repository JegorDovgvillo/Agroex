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
const stateId = 'lotList';

const initialState = lotListAdapter.getInitialState({
  stateId,
  loadingStatus: 'idle',
  lotId: null,
  errors: null,
});

const lotListSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    setLotId: (state, action) => {
      state.lotId = action.payload;
    },
    clearLots: (state) => {
      lotListAdapter.removeAll(state);
      state.loadingStatus = 'idle';
    },
    clearLotListErrors: (state) => {
      state.errors = null;
    },
    clearStatus: (state, action) => {
      state[action.payload] = 'idle';
    },
    deleteError: (state, action) => {
      if (!state.errors) return;

      state.errors.data.errors = _.omit(
        state.errors.data.errors,
        action.payload
      );

      if (_.isEmpty(state.errors.data.errors)) {
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
      .addCase(fetchLots.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(updateLot.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateLot.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        lotListAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateLot.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(fetchLotDetails.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchLotDetails.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(fetchLotDetails.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(deleteLot.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(deleteLot.fulfilled, (state, action) => {
        const { id } = action.meta.arg;

        lotListAdapter.removeOne(state, id);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(deleteLot.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(createLot.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(createLot.fulfilled, (state, action) => {
        lotListAdapter.addOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(createLot.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(filteredLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(filteredLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(filteredLots.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(changeLotStatusByUser.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(changeLotStatusByUser.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(changeLotStatusByUser.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(changeLotStatusByAdmin.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(changeLotStatusByAdmin.fulfilled, (state, action) => {
        lotListAdapter.upsertOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(changeLotStatusByAdmin.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(getFilteredLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getFilteredLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(getFilteredLots.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(fetchDeal.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        lotListAdapter.upsertOne(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(fetchDeal.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(fetchUserActivityLots.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchUserActivityLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = 'fulfilled';
      })
      .addCase(fetchUserActivityLots.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
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
export const {
  setLotId,
  clearLots,
  clearLotListErrors,
  clearStatus,
  deleteError,
} = actions;

export default reducer;
