import axiosInstance from '../../api/axios';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const setPassword = (token, password) => {
  return axiosInstance.post('/auth/set-password', { token, password });
};