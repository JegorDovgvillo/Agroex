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
    const response = await axiosInstance.post(ENDPOINTS.LOTS, formData);

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

export const changeLotStatusByUser = createAsyncThunk(
  'lotList/changeLotStatusByUser',
  async ({ lotId, isActive }) => {
    const response = await axiosInstance.post(
      `${ENDPOINTS.LOTS}/${lotId}/userStatus`,
      null,
      {
        params: {
          status: isActive,
        },
      }
    );

    return response.data;
  }
);

export const changeLotStatusByAdmin = createAsyncThunk(
  'lotList/changeLotStatusByAdmin',
  async ({ lotId, status, adminComment }, { rejectWithValue }) => {
    const endpoints = {
      onModeration: 'moderate',
      approved: 'approve',
      rejected: 'reject',
    };
    const targetEndpoint = endpoints[status];

    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.LOTS}/${lotId}/${targetEndpoint}`,
        { lotId, adminComment }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
