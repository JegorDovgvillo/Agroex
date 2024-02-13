import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchLots = createAsyncThunk('lotList/fetchLots', async () => {
  const response = await axiosInstance.get(ENDPOINTS.LOTS);

  return response.data;
});

export const updateLot = createAsyncThunk(
  'lotList/updateLot',
  async ({ id, lotData }) => {
    const response = await axiosInstance.put(
      `${ENDPOINTS.LOTS}/${id}`,
      lotData
    );

    return response.data;
  }
);

export const fetchLotDetails = createAsyncThunk(
  'lotList/fetchLotDetails',
  async (id) => {
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}/${id}`);

    return response.data;
  }
);

export const createLot = createAsyncThunk(
  'lotList/createLot',
  async (formData) => {
    const response = await axiosInstance.post(ENDPOINTS.LOTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  }
);

export const deleteLot = createAsyncThunk(
  'lotList/deleteLot',
  async ({ id }) => {
    const response = await axiosInstance.delete(`${ENDPOINTS.LOTS}/${id}`);

    return response.data;
  }
);

export const filteredLots = createAsyncThunk(
  'lotList/filteredLots',
  async (values) => {
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}?${values}`);

    return response.data;
  }
);
