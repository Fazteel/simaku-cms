import React, { useState, useEffect } from 'react';
import { Typography, Spin, Alert, Divider } from 'antd';
import { getAllAttendance } from '../attendanceService';
import AttendanceTable from '../components/AttendanceTable';

const { Title } = Typography;

const AttendanceListPage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        const dataFromApi = await getAllAttendance();
        
        const dataWithRowNumber = dataFromApi.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
        
        setAttendances(dataWithRowNumber);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data absensi.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  return (
    <div>
      <Title level={2} style={{ margin: 0 }}>Riwayat Absensi</Title>
      <Divider />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <AttendanceTable attendances={attendances} loading={loading} />
      )}
    </div>
  );
};

export default AttendanceListPage;