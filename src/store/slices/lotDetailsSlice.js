import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const lotDetailsAdapter = createEntityAdapter();

const initialState = lotDetailsAdapter.getInitialState({
  loadingStatus: 'idle',
  lotID: 1,
});

export const fetchLotDetails = createAsyncThunk(
  'lotDetails/fetchLotDetails',
  async () => {
    const response = await axios.get(`http://localhost:8080/lots/`);

    return response.data;
  }
);

const lotDetailsSlice = createSlice({
  name: 'lotDetails',
  initialState,
  reducers: {
    updateId: (state, action) => {
      state.lotID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLotDetails.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchLotDetails.fulfilled, (state, action) => {
        (state.loadingStatus = 'fulfilled'),
        lotDetailsAdapter.addOne(state, action.payload);
      })
      .addCase(fetchLotDetails.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = lotDetailsSlice;
export const { updateId } = actions;
export default reducer;
