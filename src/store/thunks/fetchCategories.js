import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORIES);

    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ id }) => {
    const response = await axiosInstance.delete(
      `${ENDPOINTS.CATEGORIES}/${id}`
    );

    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }) => {
    const response = await axiosInstance.put(
      `${ENDPOINTS.CATEGORIES}/${id}`,
      categoryData
    );

    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (dataCategory) => {
    const response = await axiosInstance.post(
      ENDPOINTS.CATEGORIES,
      dataCategory
    );

    return response.data;
  }
);

export const fetchAllCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axiosInstance.get(`${ENDPOINTS.CATEGORIES}/all`);

    return response.data;
  }
);

export const fetchSubcategories = createAsyncThunk(
  'categories/fetchCategories',
  async (id) => {
    const response = await axiosInstance.get(`${ENDPOINTS.CATEGORIES}/${id}`);

    return response.data;
  }
);
