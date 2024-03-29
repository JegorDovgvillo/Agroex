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
const stateId = 'categories';

const initialState = categoriesAdapter.getInitialState({
  stateId,
  loadingStatus: null,
  categoryId: null,
  errors: null,
});

const categoriesSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    setCategoryId: (state, action) => {
      state.categoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loadingStatus = false;
        categoriesAdapter.addMany(state, action.payload);
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loadingStatus = false;
        categoriesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loadingStatus = false;
        categoriesAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loadingStatus = false;
        categoriesAdapter.setOne(state, action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
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
