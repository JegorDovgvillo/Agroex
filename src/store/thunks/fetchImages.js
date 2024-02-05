import { createAsyncThunk } from '@reduxjs/toolkit';

import { axiosInstance, ENDPOINTS } from '@helpers';

export const fetchImagesByName = createAsyncThunk(
  'images/fetchImagesByName',
  async (imageName) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.IMAGES}/${imageName}`
    );

    return response.data;
  }
);
