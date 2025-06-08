import React, { useState, useEffect } from 'react';
import { Typography, App, Spin, Alert, Button, Modal, Form, Input, Select, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';
import { createUser, getAllUsers, updateUser, deleteUser } from '../userService';

const { Title } = Typography;
const { Option } = Select;
const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const UserManagementPage = () => {
  const [ users, setUsers ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ refreshKey, setRefreshKey ] = useState(0);

  const [ isAddModalOpen, setIsAddModalOpen ] = useState(false);
  const [ addForm ] = Form.useForm();

  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
  const [ editingUser, setEditingUser ] = useState(null);
  const [ editForm ] = Form.useForm();

  const content = <div style={contentStyle} />;

  const { modal, notification } = App.useApp();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data.map((user, index) => ({ ...user, no: index + 1 })));
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data user');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [ refreshKey ]);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleAddSubmit = async (values) => {
    try {
      await createUser(values);
      notification.success({ message: 'User berhasil ditambahkan!' });
      setIsAddModalOpen(false);
      addForm.resetFields();
      triggerRefresh();
    } catch (err) {
      notification.error({ message: err.response?.data?.message || 'Gagal menambahkan user.' });
    }
  };

  const handleEditClick = (record) => {
    setEditingUser(record);
    editForm.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      await updateUser(editingUser.id, values);
      notification.success({ message: 'User berhasil diperbarui!' });
      setIsEditModalOpen(false);
      triggerRefresh();
    } catch (err) {
      notification.error({ message: err.response?.data?.message || 'Gagal memperbarui user.' });
    }
  };

  const handleDeleteClick = (record) => {
    modal.confirm({
      title: 'Konfirmasi Hapus',
      content: `Apakah Anda yakin ingin menghapus user ${record.name}?`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await deleteUser(record.id);
          notification.success({ message: 'User berhasil dihapus!' });
          triggerRefresh();
        } catch (err) {
          notification.error({ message: err.response?.data?.message || 'Gagal menghapus user.' });
        }
      },
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Manajemen User</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
          Tambah User
        </Button>
      </div>
      <Divider />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin tip="Loading">{content}</Spin>
        </div>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: '24px' }} />
      ) : (
        <UserTable users={users} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      )}

      <Modal
        title="Tambah User Baru"
        style={{ top: 20 }}
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => addForm.submit()}
        okText="Simpan"
        cancelText="Batal">
        <UserForm form={addForm} onFinish={handleAddSubmit} />
      </Modal>

      <Modal title="Edit User" open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} onOk={handleEditSubmit} okText="Simpan Perubahan" cancelText="Batal">
        <Form layout="vertical" form={editForm}>
          <Form.Item name="name" label="Nama" rules={[ { required: true } ]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[ { required: true } ]}>
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="guru">Guru</Option>
              <Option value="siswa">Siswa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;