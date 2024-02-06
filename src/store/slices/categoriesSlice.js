import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import {
  fetchCategories,
  deleteCategory,
  updateCategory,
  createCategory,
} from '../thunks/fetchCategories';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  loadingStatus: 'idle',
  categoryId: null,
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
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
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(updateCategory.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateCategory.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(createCategory.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.setOne(state, action.payload);
      })
      .addCase(createCategory.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { actions, reducer } = categoriesSlice;

export const { setCategoryId } = actions;

const { selectAll } = categoriesAdapter.getSelectors(
  (state) => state.categories
);

export const categoriesSelector = createSelector([selectAll], (categories) =>
  Object.values(categories)
);

export const selectRootCategories = createSelector(
  [categoriesSelector],
  (categories) => categories.filter((category) => category.parentId === 0)
);

export const selectCategoryById = createSelector(
  [(state, categoryId) => categoryId, (state) => state.categories],
  (categoryId, categoriesState) => {
    return categoriesAdapter
      .getSelectors()
      .selectById(categoriesState, categoryId);
  }
);

export default reducer;
