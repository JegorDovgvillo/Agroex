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
    markAMessageAsRead: (state, action) => {
      const messageId = action.payload;
      const updatedMessages = state.messages.map((message) => {
        if (message.id === messageId) {
          return { ...message, readStatus: 'read' };
        }

        return message;
      });

      state.messages = updatedMessages;
    },
    markAsReadFromLotId: (state, action) => {
      const lotId = action.payload;
      const updatedMessages = state.messages.map((message) => {
        if (message.lotId === Number(lotId)) {
          return { ...message, readStatus: 'read' };
        }

        return message;
      });

      state.messages = updatedMessages;
    },
  },
});

const { reducer, actions } = sseSlice;

export const {
  setMessage,
  deleteMessage,
  clearMessages,
  markAMessageAsRead,
  markAsReadFromLotId,
} = actions;

export default reducer;
