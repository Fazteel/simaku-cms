import React from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../authService';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();

  // GANTI SELURUH FUNGSI onFinish DENGAN YANG INI
  const onFinish = async (values) => {
    try {
      const response = await login(values);

      // --- PERBAIKAN VALIDASI ROLE ADMIN ---
      // Akses role melalui 'response.data.user.role'
      if (response.data.user.role !== 'admin') {
        notification.error({
          message: 'Login Gagal',
          description: 'Anda tidak memiliki hak akses sebagai admin.',
        });
        return;
      }

      // --- PERBAIKAN SIMPAN TOKEN & REDIRECT ---
      // Ambil token dari 'response.data.authorization'
      // Kita hilangkan "Bearer " jika ada, untuk menyimpan token murninya saja
      const token = response.data.authorization.split(' ')[ 1 ] || response.data.authorization;
      localStorage.setItem('token', token);

      notification.success({
        message: 'Login Berhasil!',
        // Ambil nama dari 'response.data.user.name'
        description: `Selamat datang, ${response.data.user.name}!`,
      });

      // Arahkan ke halaman dashboard
      navigate('/');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email atau password salah!';
      notification.error({
        message: 'Login Gagal',
        description: errorMessage,
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ display: 'grid', textAlign: 'center', marginBottom: '24px' }}>
          <span style={{fontWeight: 'bold'}}>SIMAKU</span>
          <span style={{fontSize: '20px'}}>Admin Login</span>
        </Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[ { required: true, message: 'Silakan masukkan email Anda!' } ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[ { required: true, message: 'Silakan masukkan password Anda!' } ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;