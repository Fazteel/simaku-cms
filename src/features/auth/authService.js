import axios from '../../api/axios';

export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};