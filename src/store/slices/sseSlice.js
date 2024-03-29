import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import _ from 'lodash';
const sseAdapter = createEntityAdapter();

const initialState = sseAdapter.getInitialState({
  loadingStatus: 'idle',
  messages: [],
});

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      const newMessage = action.payload;

      if (newMessage.id && !_.some(state.messages, { id: newMessage.id })) {
        state.messages = [...state.messages, newMessage];
      }
    },
    deleteMessage: (state, action) => {
      state.messages = _.filter(
        state.messages,
        (item) => item.id !== action.payload
      );
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

const { reducer, actions } = sseSlice;

export const { setMessage, deleteMessage, clearMessages } = actions;

export default reducer;
