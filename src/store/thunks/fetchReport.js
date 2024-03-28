import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async ({ reportType, params }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.REPORTS}/${reportType}`,
        params
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
