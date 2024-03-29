import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const markAsRead = createAsyncThunk('sse/markAsRead', async (id) => {
  const response = await axiosInstance.post(`${ENDPOINTS.MARK_AS_READ}/${id}`);

  return response.data;
});
