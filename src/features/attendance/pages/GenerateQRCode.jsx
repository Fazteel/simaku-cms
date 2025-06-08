import React, { useState } from 'react';
import { Typography, Button, Space, Input, Card, App, Spin, Alert } from 'antd';
import { QrcodeOutlined, LinkOutlined, TrophyOutlined } from '@ant-design/icons';
import { generateQr } from '../attendanceService';

const { Title, Text } = Typography;
const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const GenerateQrPage = () => {
  const [ qrData, setQrData ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const { notification } = App.useApp();

  const baseUrl = window.location.origin;
  const qrLink = qrData ? `${baseUrl}/scan/${qrData.secret}` : '';

  const content = <div style={contentStyle} />;

const handleGenerateQr = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await generateQr();
        console.log('Struktur Asli dari response.data:', response.data);
        const newQrData = response.data;

        if (newQrData && newQrData.secret) {
            setQrData(newQrData);
            localStorage.setItem('currentQrData', JSON.stringify(newQrData));
            notification.success({ message: 'QR Code berhasil dibuat!' });
        } else {
            setError('Format respon dari API tidak valid atau data tidak ditemukan.');
            notification.error({ message: 'Gagal Memproses Data', description: 'Server merespon berhasil, tetapi format data tidak dikenali.' });
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Terjadi kesalahan pada server.';
        setError(errorMessage);
        notification.error({ message: 'Gagal Membuat QR Code', description: errorMessage });
    } finally {
        setLoading(false);
    }
};

  const handleOpenLink = () => {
    if (qrLink) {
      window.open(qrLink, '_blank');
    } else {
      notification.warning({ message: 'Harap generate QR Code terlebih dahulu.' });
    }
  };

  const handleOpenLeaderboard = () => {
    if (qrData) {
      window.open('/leaderboard', '_blank');
    } else {
      notification.warning({ message: 'Harap generate QR Code terlebih dahulu untuk melihat leaderboard terkait.' });
    }
  };

  return (
    <Card>
      <Title level={2} style={{ margin: 0 }}>Generate QR Code Absensi</Title>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin tip="Loading">{content}</Spin>
        </div>
      ) : error ? (
        <Alert message='Error' description={error} type='error' showIcon />
      ) : (
        <>
          <Text type="secondary">Gunakan halaman ini untuk membuat QR Code absensi harian.</Text>

          <Input
            style={{ marginTop: '24px' }}
            addonBefore={<LinkOutlined />}
            value={qrLink}
            readOnly
            placeholder="Link QR Code akan muncul di sini..."
          />

          <Space style={{ marginTop: '24px' }}>
            <Button type="primary" icon={<QrcodeOutlined />} onClick={handleGenerateQr} loading={loading}>
              Generate QR Code
            </Button>
            <Button icon={<LinkOutlined />} onClick={handleOpenLink}>
              Open Link
            </Button>
            <Button icon={<TrophyOutlined />} onClick={handleOpenLeaderboard}>
              Leaderboard
            </Button>
          </Space>
        </>
      )}
    </Card>
  );
};

export default GenerateQrPage;