import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalAdapter = createEntityAdapter();

const initialState = modalAdapter.getInitialState({
  creatingModalIsOpen: false,
  updatingModalIsOpen: false,
  infoModalIsOpen: false,
});

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openCreatingModal: (state) => {
      state.creatingModalIsOpen = true;
    },
    closeCreatingModal: (state) => {
      state.creatingModalIsOpen = false;
    },
    openUpdatingModal: (state) => {
      state.updatingModalIsOpen = true;
    },
    closeUpdatingModal: (state) => {
      state.updatingModalIsOpen = false;
    },
    openInfoModal: (state) => {
      state.infoModalIsOpen = true;
    },
    closeInfoModal: (state) => {
      state.infoModalIsOpen = false;
    },
  },
});

const { reducer, actions } = modalSlice;

export const {
  openCreatingModal,
  closeCreatingModal,
  openUpdatingModal,
  closeUpdatingModal,
  closeInfoModal,
  openInfoModal,
} = actions;

export default reducer;
