import React, { useState, useEffect } from 'react';
import { Typography, Image, Spin, Card, Flex } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

import WaveBackground from '../../../assets/wave.svg';

const { Title, Text } = Typography;

const ScanPage = () => {
    const [qrData, setQrData] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('currentQrData');
        if (storedData) {
            setQrData(JSON.parse(storedData));
        }
        dayjs.locale('id');
    }, []);

    

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: `url(${WaveBackground})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: '100% auto',
        }}>
            <Card style={{ width: 900, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
                <Flex justify="space-around" align="center" gap="large">
                    
                    <div>
                        {qrData ? (
                            <Image width={300} src={qrData.qr_image} preview={false} style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'}} />
                        ) : (
                            <div style={{ width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Spin tip="Memuat QR Code..." size="large" />
                            </div>
                        )}
                    </div>
                    <Flex vertical style={{ textAlign: 'start' }}>
                        <Title level={2}>Scan Attendance QR</Title>
                        <Title level={5} style={{ marginTop: '16px', fontWeight: 'normal' }}>
                            SMK PGRI Telagasari
                        </Title>
                        <Text type="secondary">{dayjs().format('dddd, DD MMMM YYYY')}</Text>
                    
                        <Text style={{ marginTop: '20px' }}>
                            Silakan pindai QR Code di samping untuk mencatat kehadiran.
                        </Text>
                    </Flex>
                </Flex>
            </Card>
        </div>
    );
};

export default ScanPage;