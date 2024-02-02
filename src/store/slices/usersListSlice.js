import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import { fetchUsers,deleteUser,createUser,updateUser } from '../thunks/fetchUsers';

const usersListAdapter = createEntityAdapter();

const initialState = usersListAdapter.getInitialState({
  loadingStatus: 'idle',
  userId:null
});

const usersListSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
    setUserId:(state, action) => {
      state.userId = action.payload;
    }
  },
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
      })
      .addCase(deleteUser.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(createUser.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.setOne(state, action.payload);
      })
      .addCase(createUser.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(updateUser.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateUser.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { selectAll } = usersListAdapter.getSelectors((state) => state.usersList);

export const usersListSelector = createSelector([selectAll], (usersList) =>
  Object.values(usersList)
);

const { actions,reducer } = usersListSlice;

export const { setUserId } = actions;

export default reducer;
