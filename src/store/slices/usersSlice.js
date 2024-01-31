import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchUsers } from '../thunks/fetchUsers';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  loadingStatus: 'idle',
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        (state.loadingStatus = 'fulfilled'),
        usersAdapter.addMany(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { selectAll } = usersAdapter.getSelectors((state) => state.users);

export const usersSelector = createSelector([selectAll], (users) =>
  Object.values(users)
);

const { reducer } = usersSlice;

export default reducer;
