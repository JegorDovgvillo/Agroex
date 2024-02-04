import { createAsyncThunk } from '@reduxjs/toolkit';

import { axiosInstance, ENDPOINTS } from '@helpers';

export const fetchImagesById = createAsyncThunk(
  'images/fetchImagesById',
  async (id) => {
    const response = await axiosInstance.get(`${ENDPOINTS.IMAGES}/${id}`);

    return response.data;
  }
);
