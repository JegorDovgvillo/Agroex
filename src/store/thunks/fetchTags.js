import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const response = await axiosInstance.get(ENDPOINTS.TAGS);

  return response.data;
});

export const updateTag = createAsyncThunk(
  'tags/updateTag',
  async ({ id, tagData }) => {
    const response = await axiosInstance.put(
      `${ENDPOINTS.TAGS}/${id}`,
      tagData
    );

    return response.data;
  }
);

export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tagTitle) => {
    const response = await axiosInstance.post(ENDPOINTS.TAGS, tagTitle);

    return response.data;
  }
);
