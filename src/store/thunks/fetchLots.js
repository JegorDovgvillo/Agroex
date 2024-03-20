import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchLots = createAsyncThunk('lotList/fetchLots', async () => {
  const response = await axiosInstance.get(ENDPOINTS.LOTS);

  return response.data;
});

export const updateLot = createAsyncThunk(
  'lotList/updateLot',
  async ({ id, lotData, currency }) => {
    const response = await axiosInstance.put(
      `${ENDPOINTS.LOTS}/${id}`,
      lotData,
      { headers: { currency } }
    );

    return response.data;
  }
);

export const fetchLotDetails = createAsyncThunk(
  'lotList/fetchLotDetails',
  async ({ id, currency }) => {
    console.log(id);
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}/${id}`, {
      headers: { currency },
    });

    return response.data;
  }
);

export const createLot = createAsyncThunk(
  'lotList/createLot',
  async ({ formData, currency }) => {
    const response = await axiosInstance.post(ENDPOINTS.LOTS, formData, {
      headers: { currency },
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
  async ({ values, currency }) => {
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}?${values}`, {
      headers: { currency },
    });

    return response.data;
  }
);

export const getFilteredLots = createAsyncThunk(
  'lotList/getFilteredLots',
  async ({ params, currency }) => {
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}`, {
      params: params,
      headers: { currency },
    });

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
  async ({ lotId, status, adminComment, currency }, { rejectWithValue }) => {
    const endpoints = {
      onModeration: 'moderate',
      approved: 'approve',
      rejected: 'reject',
    };
    const targetEndpoint = endpoints[status];

    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.LOTS}/${lotId}/${targetEndpoint}`,
        null,
        {
          params: {
            adminComment,
          },
          headers: { currency },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDeal = createAsyncThunk(
  'lotList/fetchDeal',
  async ({ values, currency }) => {
    const response = await axiosInstance.post(
      `${ENDPOINTS.LOTS}/${values.id}/buy`,
      null,
      {
        headers: { currency },
        params: { userId: values.userId },
      }
    );

    return response.data;
  }
);

export const fetchUserActivityLots = createAsyncThunk(
  'lotList/fetchUserActivityLots',
  async ({ userId, currency }) => {
    const response = await axiosInstance.get(`${ENDPOINTS.LOTS}/activity`, {
      params: { userId },
      headers: { currency },
    });

    return response.data;
  }
);
