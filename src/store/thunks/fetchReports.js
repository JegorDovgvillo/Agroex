import { createAsyncThunk } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async ({ reportType, params }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.REPORTS}/${reportType}`,
        params,
        {
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      });

      FileSaver.saveAs(blob, `${reportType}.xlsx`);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
