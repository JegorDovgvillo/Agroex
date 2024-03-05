import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async () => {
    const response = await axiosInstance.get(ENDPOINTS.COUNTRIES);

    return response.data;
  }
);

export const fetchCountry = createAsyncThunk(
  'countries/fetchCountry',
  async ({ id }) => {
    const response = await axiosInstance.get(`${ENDPOINTS.COUNTRIES}/${id}`);

    return response.data;
  }
);

export const getCordinate = createAsyncThunk(
  'countries/getCordinate',
  async ({ countryName }) => {
    const response = await axiosInstance.get(
      `https://nominatim.openstreetmap.org/search?format=json&country=${countryName}`
    );

    return response.data[0];
  }
);

export const getAddress = createAsyncThunk(
  'countries/getAddress',
  async ({ latitude, longitude }) => {
    const response = await axiosInstance.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: { 'Accept-Language': 'en-US' },
      }
    );

    return response.data.address;
  }
);
