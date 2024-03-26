import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchTags } from '@thunks/fetchTags';

const tagsAdapter = createEntityAdapter();
const stateId = 'tags';

const initialState = tagsAdapter.getInitialState({
  stateId,
  fetchTagsStatus: 'idle',
  errors: null,
});

const tagsSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    clearTagsErrors: (state) => {
      state.tags.errors = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.fetchTagsStatus = 'pending';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.fetchTagsStatus = 'fulfilled';
        tagsAdapter.addMany(state, action.payload);
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.fetchTagsStatus = 'rejected';
        state.errors = action.payload;
      });
  },
});

const { reducer, actions } = tagsSlice;

export const { clearTagsErrors } = actions;

const { selectAll } = tagsAdapter.getSelectors((state) => state.tags);

export const tagsSelector = createSelector([selectAll], (tags) =>
  Object.values(tags)
);

export default reducer;
