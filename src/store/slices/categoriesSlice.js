import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchCategories } from '../thunks/fetchCategories';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  loadingStatus: 'idle',
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,

  reducers: {
    updateId: (state, action) => {
      state.lotID = action.payload;
    },

    updateLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.addMany(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { reducer } = categoriesSlice;

const { selectAll } = categoriesAdapter.getSelectors(
  (state) => state.categories
);

export const categoriesSelector = createSelector([selectAll], (categories) =>
  Object.values(categories)
);

export default reducer;
