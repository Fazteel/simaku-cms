import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Table, Image, Spin, Alert, Card, Space } from 'antd';
import { getTodaysLeaderboard } from '../attendanceService'; // Sesuaikan path
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Import locale Bahasa Indonesia untuk dayjs

const { Title, Text } = Typography;

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    dayjs.locale('id'); 

    const storedQrData = localStorage.getItem('currentQrData');
    if (storedQrData) {
      setQrData(JSON.parse(storedQrData));
    }

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getTodaysLeaderboard();
        const rankedData = response.data.data.map((item, index) => ({ ...item, no: index + 1 }));
        setLeaderboardData(rankedData);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data leaderboard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  // 2. Efek baru untuk mengupdate jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    // Cleanup function untuk membersihkan interval saat komponen di-unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  const columns = [
    { title: 'No', dataIndex: 'no', key: 'no', width: 80 },
    { title: 'Nama Siswa', render: (record) => record.User?.name || 'N/A' },
    { title: 'Waktu Hadir', dataIndex: 'check_in', key: 'check_in' },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: '#002ba6', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: 0, color: '#fff' }}>Leaderboard</Title>
        <Text style={{color: '#fff'}}>{currentTime.format('dddd, DD MMMM YYYY')}</Text>
      </div>

      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Daftar Kehadiran">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>
              ) : error ? (
                <Alert message={error} type="error" showIcon />
              ) : (
                <Table
                  columns={columns}
                  dataSource={leaderboardData}
                  rowKey="id"
                  pagination={false}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Waktu Sekarang</Text>
                  <Title level={1} style={{ margin: 0, letterSpacing: '2px' }}>
                    {currentTime.format('HH:mm:ss')}
                  </Title>
                </div>
              </Card>

              <Card title="Scan QR Absensi">
                <div style={{ textAlign: 'center' }}>
                  {qrData ? (
                    <Image width={250} src={qrData.qr_image} preview={false} />
                  ) : (
                    <div style={{ padding: '50px' }}>
                      <Spin tip="Memuat QR..." />
                    </div>
                  )}
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LeaderboardPage;