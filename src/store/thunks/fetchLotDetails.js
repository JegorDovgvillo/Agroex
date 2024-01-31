import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchLotDetails = createAsyncThunk(
  'lotDetails/fetchLotDetails',
  async (id) => {
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}/${id}`);

    return response.data;
  }
);
