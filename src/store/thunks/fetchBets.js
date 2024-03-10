import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchPlaceBet = createAsyncThunk(
  'bets/fetchBets',
  async ({ id, betData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.BETS}/${id}`,
        betData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBetsByLotId = createAsyncThunk(
  'bets/fetchBetsByLotId',
  async ({ id }) => {
    const response = await axiosInstance.get(`${ENDPOINTS.BETS}/${id}`);

    return response.data;
  }
);
