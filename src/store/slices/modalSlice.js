import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalAdapter = createEntityAdapter();

const initialState = modalAdapter.getInitialState({
  status: false,
});

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.status = action.payload;
    },
    closeModal: (state, action) => {
      state.status = action.payload;
    },
  },
});

const { reducer, actions } = modalSlice;

export const { openModal, closeModal } = actions;

export default reducer;
