import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axiosInstance.get(ENDPOINTS.ALL_CATEGORIES);

    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    const response = await axiosInstance.delete(`${ENDPOINTS.MAIN_CATEGORIES}/${id}`);

    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, dataCategory }) => {
    const response = await axiosInstance.put(
      `${ENDPOINTS.MAIN_CATEGORIES}/${id}`,
      dataCategory
    );

    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (dataCategory) => {
    const response = await axiosInstance.post(
      ENDPOINTS.MAIN_CATEGORIES,
      dataCategory
    );

    return response.data;
  }
);

export const createSubcategory = createAsyncThunk(
  'categories/createSubcategory',
  async (dataCategory) => {
    const response = await axiosInstance.post(
      ENDPOINTS.MAIN_CATEGORIES,
      dataCategory
    );

    return response.data;
  }
);