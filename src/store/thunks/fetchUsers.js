import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuthSession } from 'aws-amplify/auth';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';
import getCookie from '@helpers/getCookie';

export const fetchUsers = createAsyncThunk('usersList/fetchUsers', async () => {
  const response = await axiosInstance.get(ENDPOINTS.USERS);

  return response.data;
});

export const deleteUser = createAsyncThunk(
  'usersList/deleteUser',
  async ({ id }) => {
    const cookie = await getCookie();

    const response = await axiosInstance.delete(`${ENDPOINTS.USERS}/${id}`, {
      headers: { Authorization: `Bearer ${cookie}` },
    });

    return response.data;
  }
);

// export const createUser = createAsyncThunk(
//   'usersList/createUser',
//   async (userData) => {
//     const response = await axiosInstance.post(ENDPOINTS.USERS, userData);

//     return response.data;
//   }
// );

export const updateUser = createAsyncThunk(
  'usersList/updateUser',
  async ({ id, userData }) => {
    const cookie = await getCookie();

    const response = await axiosInstance.put(
      `${ENDPOINTS.USERS}/${id}`,
      userData,
      {
        headers: { Authorization: `Bearer ${cookie}` },
      }
    );

    return response.data;
  }
);

export const fetchUser = createAsyncThunk('usersList/fetchUser', async (id) => {
  const response = await axiosInstance.get(`${ENDPOINTS.USERS}/${id}`);

  return response.data;
});

export const getUserFromCognito = createAsyncThunk(
  'usersList/getUserFromCognito',
  async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const userInfo = { ...idToken.payload, id: idToken.payload.sub };
    return userInfo;
  }
);

export const updateToken = createAsyncThunk(
  'usersList/updateToken',
  async () => {
    const { idToken } =
      (await fetchAuthSession({ forceRefresh: true })).tokens ?? {};
    const userInfo = { ...idToken.payload, id: idToken.payload.sub };
    return userInfo;
  }
);

export const createUser = createAsyncThunk(
  'usersList/createUser',
  async (id) => {
    const cookie = await getCookie();

    const response = await axiosInstance.post('/auth/register', id, {
      headers: { Authorization: `Bearer ${cookie}` },
    });

    return response.data;
  }
);
