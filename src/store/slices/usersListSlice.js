import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchUsers } from '../thunks/fetchUsers';

const usersListAdapter = createEntityAdapter();

const initialState = usersListAdapter.getInitialState({
  loadingStatus: 'idle',
});

const usersListSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.addMany(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { selectAll } = usersListAdapter.getSelectors((state) => state.usersList);

export const usersListSelector = createSelector([selectAll], (usersList) =>
  Object.values(usersList)
);

const { reducer } = usersListSlice;

export default reducer;
