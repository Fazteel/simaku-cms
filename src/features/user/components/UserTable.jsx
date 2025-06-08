import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  const columns = [
    { title: 'No.', dataIndex: 'no', key: 'no', width: 80 },
    { title: 'Nama', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Peran',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = role === 'admin' ? 'volcano' : role === 'guru' ? 'green' : 'blue';
        return <Tag color={color}>{role ? role.toUpperCase() : 'N/A'}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button shape="circle" color='orange' variant='solid' icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      style={{ marginTop: '24px' }}
    />
  );
};

export default UserTable;