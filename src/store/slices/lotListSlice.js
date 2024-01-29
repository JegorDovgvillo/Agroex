import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';

import ENDPOINTS from '@helpers/endpoints';
import { BASE_URL } from '@helpers/endpoints';

const lotListAdapter = createEntityAdapter();

const initialState = lotListAdapter.getInitialState({
  loadingStatus: 'idle',
});

export const fetchLots = createAsyncThunk('lotList/fetchLots', async () => {
  const response = await axios.get(`${BASE_URL}${ENDPOINTS.LOTS}`);

  return response.data;
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
