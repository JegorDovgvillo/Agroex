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
const stateId = 'usersList';

const initialState = usersListAdapter.getInitialState({
  stateId,
  loadingStatus: false,
  userId: null,
  userInfo: null,
  errors: null,
});

const usersListSlice = createSlice({
  name: stateId,
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    deleteUserInfo: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingStatus = false;
        usersListAdapter.setMany(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loadingStatus = false;
        usersListAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loadingStatus = false;
        usersListAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(getUserFromCognito.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(getUserFromCognito.fulfilled, (state, action) => {
        state.loadingStatus = false;
        usersListAdapter.upsertOne(state, action.payload);
        state.userId = action.payload.id;
        state.userInfo = action.payload;
      })
      .addCase(getUserFromCognito.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(updateToken.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(updateToken.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.userInfo = action.payload;
        state.userId = action.payload.id;
      })
      .addCase(updateToken.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
      })
      .addCase(changeUserStatus.pending, (state) => {
        state.errors = null;
        state.loadingStatus = true;
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.loadingStatus = false;
        usersListAdapter.upsertOne(state, action.payload);
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors = action.payload;
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

export const { setUserId, setUserInfo, deleteUserInfo } = actions;

export default reducer;
