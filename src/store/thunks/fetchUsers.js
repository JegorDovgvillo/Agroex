import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuthSession } from 'aws-amplify/auth';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

export const fetchUsers = createAsyncThunk(
  'usersList/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.USERS);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'usersList/deleteUser',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${ENDPOINTS.USERS}/${id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  'usersList/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${ENDPOINTS.USERS}/${id}`,
        userData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const fetchUser = createAsyncThunk(
  'usersList/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.USERS}/${id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const getUserFromCognito = createAsyncThunk(
  'usersList/getUserFromCognito',
  async (_, { rejectWithValue }) => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      const userInfo = { ...idToken.payload, id: idToken.payload.sub };

      return userInfo;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const updateToken = createAsyncThunk(
  'usersList/updateToken',
  async (_, { rejectWithValue }) => {
    try {
      const { idToken } =
        (await fetchAuthSession({ forceRefresh: true })).tokens ?? {};
      const userInfo = { ...idToken.payload, id: idToken.payload.sub };

      return userInfo;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const createUser = createAsyncThunk(
  'usersList/createUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${ENDPOINTS.AUTH}${id}`, {});

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const changeUserStatus = createAsyncThunk(
  'usersList/changeUserStatus',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${ENDPOINTS.USERS}/${id}/enable`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);

export const updateUsersInTheDataBase = createAsyncThunk(
  'usersList/updateDataBase',
  async (_, { rejectWithValue }) => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      const response = await axiosInstance.get(ENDPOINTS.UPDATE_DB, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
);
