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
  fetchTagsStatus: false,
  errors: null,
});

const tagsSlice = createSlice({
  name: stateId,
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.errors = null;
        state.fetchTagsStatus = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.fetchTagsStatus = false;
        tagsAdapter.addMany(state, action.payload);
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.fetchTagsStatus = false;
        state.errors = action.payload;
      });
  },
});

const { reducer, actions } = tagsSlice;

const { selectAll } = tagsAdapter.getSelectors((state) => state.tags);

export const tagsSelector = createSelector([selectAll], (tags) =>
  Object.values(tags)
);

export default reducer;
