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
  loadingStatus: null,
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
      state.loadingStatus = false;
    },

    clearStatus: (state, action) => {
      state[action.payload] = false;
    },
    deleteError: (state, action) => {
      console.log('state', state.errors);
      if (!state.errors) return;

      state.loadingStatus = true;

      state.errors.data.errors = _.omit(
        state.errors.data.errors,
        action.payload
      );

      if (_.isEmpty(state.errors.data.errors)) {
        state.errors = null;
      }
    },
    clearErrors: (state) => {
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLots.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchLots.fulfilled, (state, action) => {
        state.loadingStatus = false;
        lotListAdapter.addMany(state, action.payload);
      })
      .addCase(fetchLots.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(updateLot.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(updateLot.fulfilled, (state, action) => {
        state.loadingStatus = false;
        lotListAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateLot.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(fetchLotDetails.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchLotDetails.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(fetchLotDetails.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(deleteLot.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(deleteLot.fulfilled, (state, action) => {
        const { id } = action.meta.arg;

        lotListAdapter.removeOne(state, id);
        state.loadingStatus = false;
      })
      .addCase(deleteLot.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(createLot.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(createLot.fulfilled, (state, action) => {
        lotListAdapter.addOne(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(createLot.rejected, (state, action) => {
        state.loadingStatus = false;
        console.log(action);
        state.errors = action.payload;
      })
      .addCase(filteredLots.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(filteredLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(filteredLots.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(changeLotStatusByUser.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(changeLotStatusByUser.fulfilled, (state, action) => {
        lotListAdapter.setOne(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(changeLotStatusByUser.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(changeLotStatusByAdmin.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(changeLotStatusByAdmin.fulfilled, (state, action) => {
        lotListAdapter.upsertOne(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(changeLotStatusByAdmin.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(getFilteredLots.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(getFilteredLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(getFilteredLots.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(fetchDeal.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        lotListAdapter.upsertOne(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(fetchDeal.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(fetchUserActivityLots.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchUserActivityLots.fulfilled, (state, action) => {
        lotListAdapter.setAll(state, action.payload);
        state.loadingStatus = false;
      })
      .addCase(fetchUserActivityLots.rejected, (state, action) => {
        state.loadingStatus = false;
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
export const { setLotId, clearLots, clearStatus, deleteError, clearErrors } =
  actions;

export default reducer;
