import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { fetchReport } from '@thunks/fetchReports';

const reportsAdapter = createEntityAdapter();

const initialState = reportsAdapter.getInitialState({
  loadingStatus: null,
  errors: null,
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchReport.fulfilled, (state) => {
        state.loadingStatus = false;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      });
  },
});

const { reducer } = reportsSlice;

export default reducer;
