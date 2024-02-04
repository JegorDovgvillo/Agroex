import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchImagesById } from '../thunks/fetchImages';

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
      .addCase(fetchImage.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchImage.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        imagesAdapter.setOne(state, action.payload);
      })
      .addCase(fetchImage.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = imagesSlice;
export const { updateLoadingStatus } = actions;
export default reducer;
/* 
export const { selectById: selectLotDetailById } =
  imageAdapter.getSelectors((state) => state.Image); */
