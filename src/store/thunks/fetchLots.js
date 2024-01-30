import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchLots = createAsyncThunk('lotList/fetchLots', async () => {
  const response = await axiosInstance.get(ENDPOINTS.LOTS);

  return response.data;
});
