import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';
import { MAP_URL } from '@helpers/endpoints';

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',

  async ({ existed }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.COUNTRIES}?lot_existed=${existed}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCountry = createAsyncThunk(
  'countries/fetchCountry',
  async ({ id }) => {
    const response = await axiosInstance.get(`${ENDPOINTS.COUNTRIES}/${id}`);

    return response.data;
  }
);

export const getCoordinate = createAsyncThunk(
  'countries/getCoordinate',
  async ({ countryName }) => {
    const response = await axiosInstance.get(
      `${MAP_URL}/search?format=json&country=${countryName}`,
      {
        headers: { 'Accept-Language': 'en-US' },
      }
    );

    return response.data[0];
  }
);

export const getAddress = createAsyncThunk(
  'countries/getAddress',
  async ({ latitude, longitude }) => {
    const response = await axiosInstance.get(
      `${MAP_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: { 'Accept-Language': 'en-US' },
      }
    );

    return response.data.address;
  }
);
