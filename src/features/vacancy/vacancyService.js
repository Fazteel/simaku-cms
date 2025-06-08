import axiosInstance from '../../api/axios';

export const createVacancy = async (data) => {
  const response = await axiosInstance.post('/vacancy/', data);
  return response.data;
};

export const getAllVacancies = () => {
  return axiosInstance.get('/vacancy/');
};

export const updateVacancy = async (id, data) => {
  const response = await axiosInstance.put(`/vacancy/${id}`, data);
  return response.data;
};

export const deleteVacancy = async (id) => {
  const response = await axiosInstance.delete(`/vacancy/${id}`);
  return response.data;
};
