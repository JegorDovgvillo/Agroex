import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const userProfileAdapter = createEntityAdapter();

const initialState = userProfileAdapter.getInitialState({
  location: null,
});

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
});

const { reducer, actions } = userProfileSlice;

export const { setLocation } = actions;

export default reducer;
