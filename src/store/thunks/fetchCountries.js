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
  async (id) => {
    const response = await axiosInstance.get(`${ENDPOINTS.COUNTRIES}/${id}`);

    return response.data;
  }
);
