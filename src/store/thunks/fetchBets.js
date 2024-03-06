import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchPlaceBet = createAsyncThunk(
  'bets/fetchBets',
  async ({ id, betData }) => {
    const response = await axiosInstance.post(
      `${ENDPOINTS.BETS}/${id}`,
      betData
    );

    return response.data;
  }
);
