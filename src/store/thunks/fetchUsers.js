import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchUsers = createAsyncThunk('usersList/fetchUsers', async () => {
  const response = await axiosInstance.get(ENDPOINTS.USERS);

  return response.data;
});

export const deleteUser = createAsyncThunk(
  'usersList/deleteUser',
  async ({ id }) => {
    const response = await axiosInstance.delete(`${ENDPOINTS.USERS}/${id}`);

    return response.data;
  }
);

export const createUser = createAsyncThunk(
  'usersList/createUser',
  async (userData) => {
    const response = await axiosInstance.post(ENDPOINTS.USERS, userData);

    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'usersList/updateUser',
  async ({ id, userData }) => {
    const response = await axiosInstance.put(
      `${ENDPOINTS.USERS}/${id}`,
      userData
    );

    return response.data;
  }
);

export const fetchUser = createAsyncThunk('usersList/fetchUser', async (id) => {
  const response = await axiosInstance.get(`${ENDPOINTS.USERS}/${id}`);

  return response.data;
});
