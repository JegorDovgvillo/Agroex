import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchImagesByName } from '../thunks/fetchImages';

const imagesAdapter = createEntityAdapter();

const initialState = imagesAdapter.getInitialState({
  loadingStatus: 'idle',
});

const imagesSlice = createSlice({
  name: 'images',
  initialState,

  reducers: {
    updateLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchImagesByName.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchImagesByName.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        imagesAdapter.setOne(state, action.payload);
      })
      .addCase(fetchImagesByName.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = imagesSlice;
export const { updateLoadingStatus } = actions;
export default reducer;
