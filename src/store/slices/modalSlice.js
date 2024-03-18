import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { isArray, find, findIndex } from 'lodash';

const modalAdapter = createEntityAdapter();

const initialState = modalAdapter.getInitialState({
  modals: [
    { id: 'creatingModal', isOpen: false },
    { id: 'updatingModal', isOpen: false },
    { id: 'updatingUserDataModal', isOpen: false },
    { id: 'infoModal', isOpen: false },
    {
      id: 'confirmModal',
      isOpen: false,
      text: 'Do you confirm the action?',
      confirmStatus: false,
      action: '',
    },
    { id: 'confirmNestedModal', isOpen: false },
    { id: 'snackbar', isOpen: false, message: '', severity: 'info' },
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
      const modalIndex = findIndex(state.modals, { id: modalId });
      state.modals[modalIndex].isOpen = !state.modals[modalIndex].isOpen;
    },

    setModalFields: (state, action) => {
      const { modalId, ...changes } = action.payload;
      const modalIndex = state.modals.findIndex(
        (modal) => modal.id === modalId
      );

      if (modalIndex !== -1) {
        state.modals[modalIndex] = {
          ...state.modals[modalIndex],
          ...changes,
        };
      }
    },

    clearModalsFields: (state, action) => {
      const modalIds = isArray(action.payload)
        ? action.payload
        : [action.payload];

      modalIds.forEach((modalId) => {
        const modalIndex = findIndex(state.modals, { id: modalId });

        if (modalIndex !== -1) {
          const initialModalState = find(initialState.modals, { id: modalId });

          state.modals[modalIndex] = { ...initialModalState };
        }
      });
    },
  },
});

const { reducer, actions } = modalSlice;

export const { toggleModal, setModalFields, clearModalsFields } = actions;

export const selectModalState = (state, modalId) => {
  const modal = find(state.modal.modals, { id: modalId });

  return modal ? modal.isOpen : false;
};

export const selectModal = (state, modalId) => {
  const modal = find(state.modal.modals, { id: modalId });

  return modal;
};

export default reducer;
