import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchPlaceBet = createAsyncThunk(
  'bets/fetchBets',
  async ({ id, betData, currency }, { rejectWithValue }) => {
    console.log(currency);
    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.BETS}/${id}`,
        betData,
        {
          headers: { currency },
        }
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
