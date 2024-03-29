import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.TAGS);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);
