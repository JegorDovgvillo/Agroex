import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import {
  fetchUsers,
  deleteUser,
  fetchUser,
  getUserFromCognito,
  updateToken,
  changeUserStatus,
} from '@thunks/fetchUsers';

const usersListAdapter = createEntityAdapter();

const initialState = usersListAdapter.getInitialState({
  loadingStatus: 'idle',
  userId: null,
  userInfo: null,
});

const usersListSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.setMany(state, action.payload);
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
      .addCase(fetchUser.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(getUserFromCognito.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(getUserFromCognito.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        //usersListAdapter.upsertOne(state, action.payload);
        state.userId = action.payload.id;
        state.userInfo = action.payload;
      })
      .addCase(getUserFromCognito.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(updateToken.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(updateToken.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.upsertOne(state, action.payload);
        state.userId = action.payload.id;
      })
      .addCase(updateToken.rejected, (state) => {
        state.loadingStatus = 'rejected';
      })
      .addCase(changeUserStatus.pending, (state) => {
        state.loadingStatus = 'pending';
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.loadingStatus = 'fulfilled';
        usersListAdapter.upsertOne(state, action.payload);
      })
      .addCase(changeUserStatus.rejected, (state) => {
        state.loadingStatus = 'rejected';
      });
  },
});

const { selectAll } = usersListAdapter.getSelectors((state) => state.usersList);

export const usersListSelector = createSelector([selectAll], (usersList) =>
  Object.values(usersList)
);

export const { selectById: selectUserById } = usersListAdapter.getSelectors(
  (state) => state.usersList
);

const { actions, reducer } = usersListSlice;

export const { setUserId, setUserInfo } = actions;

export default reducer;
