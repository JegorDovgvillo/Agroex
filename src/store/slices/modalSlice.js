import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalAdapter = createEntityAdapter();

const initialState = modalAdapter.getInitialState({
  modals: [
    { id: 'creatingModal', isOpen: false },
    { id: 'updatingModal', isOpen: false },
    { id: 'infoModal', isOpen: false },
    { id: 'confirmModal', isOpen: false },
    { id: 'confirmNestedModal', isOpen: false },
    { id: 'snackbar', isOpen: false },
    { id: 'adminMessageModal', isOpen: false },
    { id: 'codeModal', isOpen: false },
    { id: 'placeBetModal', isOpen: false },
  ],
});

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      const modalId = action.payload;
      const modalIndex = state.modals.findIndex(
        (modal) => modal.id === modalId
      );
      state.modals[modalIndex].isOpen = !state.modals[modalIndex].isOpen;
    },
  },
});

const { reducer, actions } = modalSlice;

export const { toggleModal } = actions;

export const selectModalState = (state, modalId) => {
  const modal = state.modal.modals.find((modal) => modal.id === modalId);

  return modal ? modal.isOpen : false;
};

export default reducer;
