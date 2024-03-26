import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${ENDPOINTS.CATEGORIES}/${id}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${ENDPOINTS.CATEGORIES}/${id}`,
        categoryData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({ dataCategory }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.CATEGORIES,
        dataCategory
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.CATEGORIES_ALL);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const fetchSubcategoryByParentId = createAsyncThunk(
  'categories/fetchCategories',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.CATEGORIES}/${id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);
