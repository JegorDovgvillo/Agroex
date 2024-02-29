import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchTags, updateTag, createTag } from '@thunks/fetchTags';

const tagsAdapter = createEntityAdapter();

const initialState = tagsAdapter.getInitialState({
  loadingStatus: 'idle',
});

const tagsSlice = createSlice({
  name: 'tags',
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        tagsAdapter.addMany(state, action.payload);
      })
      .addCase(fetchTags.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })

      .addCase(updateTag.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        tagsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateTag.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(createTag.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        tagsAdapter.setOne(state, action.payload);
      })
      .addCase(createTag.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { reducer } = tagsSlice;

const { selectAll } = tagsAdapter.getSelectors((state) => state.tags);

export const tagsSelector = createSelector([selectAll], (tags) =>
  Object.values(tags)
);

export default reducer;
