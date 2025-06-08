import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Statistic, List, Avatar, Spin, Alert } from 'antd';
import { TeamOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import dayjs from 'dayjs';

import { getAllUsers } from '../../features/user/userService'; 
import { getAllAttendance } from '../../features/attendance/attendanceService'; 

const { Title, Text } = Typography;

const DashboardPage = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [allUsers, allAttendances] = await Promise.all([
                    getAllUsers(),
                    getAllAttendance()
                ]);

                const totalGuru = allUsers.filter(u => u.role === 'guru').length;
                const totalSiswa = allUsers.filter(u => u.role === 'siswa').length;

                const todayString = dayjs().format('YYYY-MM-DD');
                const todayAttendances = allAttendances.filter(a => a.tanggal === todayString && a.keterangan.toLowerCase() === 'hadir');
                const hadirHariIni = todayAttendances.length;
                const absenHariIni = totalSiswa - hadirHariIni;

                const guruHadir = todayAttendances
                    .filter(a => a.User?.role === 'guru')
                    .map(a => a.User);

                const siswaHadir = todayAttendances
                    .filter(a => a.User?.role === 'siswa')
                    .map(a => a.User);

                const weeklyStats = [];
                for (let i = 6; i >= 0; i--) {
                    const date = dayjs().subtract(i, 'day');
                    const dayName = date.format('dddd');
                    const dateString = date.format('YYYY-MM-DD');
                    
                    const dailyCount = allAttendances.filter(a => a.tanggal === dateString && a.keterangan.toLowerCase() === 'hadir').length;
                    
                    weeklyStats.push({ day: dayName, count: dailyCount });
                }

                setPageData({
                    totalGuru,
                    totalSiswa,
                    hadirHariIni,
                    absenHariIni,
                    statistikMingguan: weeklyStats,
                    guruHadir,
                    siswaHadir,
                });

            } catch (err) {
                setError("Gagal memuat data dashboard. Pastikan API berjalan.");
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); 

    const chartConfig = {
        data: pageData?.statistikMingguan || [],
        xField: 'day',
        yField: 'count',
        colorField: 'day',
        legend: false,
        yAxis: { title: { text: 'Jumlah Kehadiran' } },
        xAxis: { title: { text: 'Hari' } },
    };

    const cardStyle = {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
        borderRadius: '12px',
        border: 'none',
        height: '100%'
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Spin size="large" tip="Memuat Data Dashboard..." /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Title level={2} style={{ color: '#323334', marginBottom: '24px', marginTop: 0 }}>
                Dashboard
            </Title>
            
            <Card style={cardStyle} bodyStyle={{ padding: '16px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic title={<Text style={{ color: '#323334' }}>Tanggal Hari Ini</Text>} value={dayjs().format('DD MMMM YYYY')} />
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <Statistic title="Total Guru" value={pageData.totalGuru} prefix={<TeamOutlined />} />
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <Statistic title="Total Siswa" value={pageData.totalSiswa} prefix={<UserOutlined />} />
                    </Col>
                    <Col xs={12} sm={6} lg={6}>
                        <Statistic title="Hadir Hari Ini" value={pageData.hadirHariIni} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#3f8600' }} />
                    </Col>
                    <Col xs={12} sm={6} lg={6}>
                        <Statistic title="Absen Hari Ini" value={pageData.absenHariIni} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#cf1322' }} />
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card style={cardStyle} title={<Title level={4} style={{color: '#323334'}}>Statistik Kehadiran (7 Hari Terakhir)</Title>}>
                        <Bar {...chartConfig} height={250} />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card style={cardStyle} title={<Title level={5} style={{color: '#323334'}}>Guru Hadir Hari Ini</Title>}>
                                <List
                                    dataSource={pageData.guruHadir}
                                    renderItem={(item) => (
                                        <List.Item style={{padding: '8px 0'}}>
                                            <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={<Text style={{color: '#323334'}}>{item.name}</Text>} />
                                        </List.Item>
                                    )}
                                    size="small"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card style={cardStyle} title={<Title level={5} style={{color: '#323334'}}>Siswa Hadir Hari Ini</Title>}>
                                <List
                                    dataSource={pageData.siswaHadir}
                                    renderItem={(item) => (
                                        <List.Item style={{padding: '8px 0'}}>
                                            <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={<Text style={{color: '#323334'}}>{item.name}</Text>} />
                                        </List.Item>
                                    )}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;