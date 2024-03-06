import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalAdapter = createEntityAdapter();

const initialState = modalAdapter.getInitialState({
  modals: [
    { id: 'creatingModal', isOpen: false },
    { id: 'updatingModal', isOpen: false },
    { id: 'infoModal', isOpen: false },
    {
      id: 'confirmModal',
      isOpen: false,
      text: 'Do you confirm the action?',
      confirmStatus: false,
      action: '',
    },
    { id: 'confirmNestedModal', isOpen: false },
    { id: 'snackbar', isOpen: false },
    { id: 'codeModal', isOpen: false },
    { id: 'adminMessageModal', isOpen: false, adminMessage: '' },
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

    setModalField: (state, action) => {
      const { modalId, field, value } = action.payload;
      const modalIndex = state.modals.findIndex(
        (modal) => modal.id === modalId
      );

      if (modalIndex !== -1) {
        state.modals[modalIndex][field] = value;
      }
    },

    clearModalFields: (state, action) => {
      const modalId = action.payload;
      const modalIndex = state.modals.findIndex((modal) => {
        return modal.id === modalId;
      });

      if (modalIndex !== -1) {
        const initialModalState = initialState.modals.find(
          (modal) => modal.id === modalId
        );

        state.modals[modalIndex] = { ...initialModalState };
      }
    },
  },
});

const { reducer, actions } = modalSlice;

export const { toggleModal, setModalField, clearModalFields } = actions;

export const selectModalState = (state, modalId) => {
  const modal = state.modal.modals.find((modal) => modal.id === modalId);

  return modal ? modal.isOpen : false;
};

export const selectModal = (state, modalId) => {
  const modal = state.modal.modals.find((modal) => modal.id === modalId);

  return modal;
};

export default reducer;
