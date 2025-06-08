import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  QrcodeOutlined,
  UserOutlined,
  TeamOutlined,
  BarcodeOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import Title from 'antd/es/skeleton/Title';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <NavLink to="/">Dashboard</NavLink>,
    },
    {
      key: 'attendance_hub',
      icon: <QrcodeOutlined />,
      label: 'Attendance',
      children: [
        {
          key: '/attendance',
          icon: <SolutionOutlined />,
          label: <NavLink to="/attendance">Attendance</NavLink>,
        },
        {
          key: '/generate-qr',
          icon: <BarcodeOutlined />,
          label: <NavLink to="/generate-qr">Generate QR</NavLink>,
        },
      ]
    },
    {
      key: 'user_management_sub',
      icon: <UserOutlined />,
      label: 'Manajemen Pengguna',
      children: [
        {
          key: '/users',
          icon: <UserOutlined />,
          label: <NavLink to="/users">User</NavLink>,
        },
        {
          key: '/student',
          icon: <TeamOutlined />,
          label: <NavLink to="/student">Student</NavLink>,
        },
      ]
    },
    {
      key: '/vacancies',
      icon: <ProjectOutlined />,
      label: <NavLink to="/vacancies">Vacancy</NavLink>,
    },
  ];

  return (
    <Sider trigger={null} collapsible={collapsed} style={{ height: '100vh', position: 'sticky', top: 0, left: 0, }}>
      <div className="demo-logo-vertical" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }}>
        <Title level={4} style={{ color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {collapsed ? 'S' : 'SIMAKU'}
        </Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[ location.pathname ]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;