import { createAsyncThunk } from '@reduxjs/toolkit';

import { axiosInstanceImages } from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchImagesByName = createAsyncThunk(
  'images/fetchImagesByName',
  async (imageName) => {
    const response = await axiosInstanceImages.get(
      `${ENDPOINTS.IMAGES}/${imageName}`,

      {
        responseType: 'arraybuffer',
      }
    );

    const base64String = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    return base64String;
  }
);
