import axiosInstance  from '../../api/axios';

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/user/');
      return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/user/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};