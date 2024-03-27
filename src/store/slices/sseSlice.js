import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

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

      if (newMessage.id) {
        const existingMessageIds = state.messages.map((message) => message.id);

        if (!existingMessageIds.includes(newMessage.id)) {
          state.messages = [...state.messages, newMessage];
        }
      }
    },
  },
});

const { reducer, actions } = sseSlice;

export const { setMessage } = actions;

export default reducer;
