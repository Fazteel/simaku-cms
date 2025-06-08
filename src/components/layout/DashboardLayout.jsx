import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Layout, theme, App } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Sidebar from './Sidebar';

const { Header, Content } = Layout;

const DashboardLayout = () => {
  const [ collapsed, setCollapsed ] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const { notification, modal } = App.useApp();

  const handleLogout = () => {
    modal.confirm({
      title: 'Konfirmasi Logout',
      content: `Apakah Anda yakin ingin keluar dari aplikasi`,
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          localStorage.removeItem('token');
          notification.success({
            message: 'Logout Berhasil',
            description: 'Anda telah berhasil keluar.',
            placement: 'topRight'
          });
          navigate('/login');
        } catch (error) {
          notification.error({ message: error.response?.data?.message || 'Gagal melakukan logout' });
        }
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }} >
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Button
            type='danger'
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginRight: '16px' }}
          />
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 112px)',
              background: colorBgContainer,
              borderRadius: '8px',
            }}
          >
            <Outlet />
          </div>
        </Content>
        
      </Layout>
    </Layout >
  );
};

export default DashboardLayout;