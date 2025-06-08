import axiosInstance  from '../../api/axios';

export const generateQr = async () => {
  const response = await axiosInstance.post('/attendance/generate-qr');
  return response.data;
};

export const getAllAttendance = async () => {
  try {
    const response = await axiosInstance.get('/attendance/');
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const getAttendanceByUserId = async (id) => {
  const response = await axiosInstance.get(`/attendance/user/${id}`);
  return response.data;
};

export const getTodaysLeaderboard = () => {
  return axiosInstance.get('/attendance/leaderboard-today'); 
};