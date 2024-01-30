import { createAsyncThunk } from '@reduxjs/toolkit';

import instance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchLots = createAsyncThunk('lotList/fetchLots', async () => {
  const response = await instance.get(ENDPOINTS.LOTS);

  return response.data;
});
