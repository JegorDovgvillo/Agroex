import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const sseAdapter = createEntityAdapter();

const initialState = sseAdapter.getInitialState({
  loadingStatus: 'idle',
});

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {},
});

const { reducer } = sseSlice;

export default reducer;
