import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { filter } from 'lodash';

import {
  fetchAllCategories,
  deleteCategory,
  updateCategory,
  createCategory,
} from '@thunks/fetchCategories';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  loadingStatus: 'idle',
  categoryId: null,
  errors: null,
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
    },
    clearErrors: (state) => {
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.addMany(state, action.payload);
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        categoriesAdapter.setOne(state, action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loadingStatus = 'rejected';
        state.errors = action.payload;
      });
  },
});

const { actions, reducer } = categoriesSlice;

export const { setCategoryId, clearErrors } = actions;

const { selectAll } = categoriesAdapter.getSelectors(
  (state) => state.categories
);

export const categoriesSelector = createSelector([selectAll], (categories) =>
  Object.values(categories)
);

export const selectRootCategories = createSelector(
  [categoriesSelector],
  (categories) => filter(categories, (category) => !category.parentId)
);

export const selectCategoryById = createSelector(
  [(state, categoryId) => categoryId, (state) => state.categories],
  (categoryId, categoriesState) => {
    return categoriesAdapter
      .getSelectors()
      .selectById(categoriesState, categoryId);
  }
);

export const selectCategoryByParentId = createSelector(
  [selectAll, (_, parentId) => parentId],
  (categories, parentId) => {
    return filter(categories, { parentId });
  }
);

export const selectSubcategories = createSelector(
  [categoriesSelector],
  (categories) => filter(categories, (category) => category.parentId)
);

export default reducer;
