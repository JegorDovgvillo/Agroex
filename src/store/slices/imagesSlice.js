import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchImage } from '../thunks/fetchImage';

const imageAdapter = createEntityAdapter();

const initialState = imageAdapter.getInitialState({
  loadingStatus: 'idle',
});

const ImageSlice = createSlice({
  name: 'image',
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
        imageAdapter.setOne(state, action.payload);
      })
      .addCase(fetchImage.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = imageSlice;
export const { updateLoadingStatus } = actions;
export default reducer;
/* 
export const { selectById: selectLotDetailById } =
  imageAdapter.getSelectors((state) => state.Image); */
