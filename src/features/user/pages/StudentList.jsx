import React, { useState, useEffect } from 'react';
import { Typography, Spin, Alert, App, Divider, Modal, Form, Input, Select } from 'antd';
import UserTable from '../components/UserTable';

import { getAllUsers, updateUser, deleteUser } from '../userService';

const { Title } = Typography;
const { Option } = Select;
const contentStyle = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const StudentListPage = () => {
    const [ users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const [ refreshKey, setRefreshKey ] = useState(0);
    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
    const [ editingUser, setEditingUser ] = useState(null);
    const [ editForm ] = Form.useForm();

    const content = <div style={contentStyle} />;

    const { modal, notification } = App.useApp();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const responseData = await getAllUsers();
                const filteredSiswa = responseData.filter(user => user.role === 'siswa');
                const data = filteredSiswa.map((user, index) => ({
                    ...user,
                    no: index + 1,
                }));
                setUsers(data);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Gagal memuat data siswa';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [ refreshKey ]);

    const triggerRefresh = () => setRefreshKey(prev => prev + 1);

    const handleEditClick = (record) => {
        setEditingUser(record);
        editForm.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            const values = await editForm.validateFields();
            delete values.email;
            await updateUser(editingUser.id, values);
            notification.success({ message: 'Data siswa berhasil diperbarui!' });
            setIsEditModalOpen(false);
            triggerRefresh();
        } catch (err) {
            notification.error({ message: err.response?.data?.message || 'Gagal memperbarui data siswa.' });
        }
    };

    const handleDeleteClick = (record) => {
        modal.confirm({
            title: 'Konfirmasi Hapus',
            content: `Apakah Anda yakin ingin menghapus siswa bernama ${record.name}?`,
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await deleteUser(record.id);
                    notification.success({ message: 'Siswa berhasil dihapus!' });
                    triggerRefresh();
                } catch (err) {
                    notification.error({ message: err.response?.data?.message || 'Gagal menghapus siswa.' });
                }
            },
        });
    };

    return (
        <div>
            <Title level={2} style={{margin: 0}}>Daftar Siswa</Title>
            <Divider />

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Spin tip="Loading">{content}</Spin>
                </div>
            ) : error ? (
                <Alert message='Error' description={error} type='error' showIcon />
            ) : (
                <UserTable users={users} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            )}

            <Modal
                title="Edit Data Siswa"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleEditSubmit}
                okText="Simpan Perubahan"
                cancelText="Batal"
            >
                <Form layout="vertical" form={editForm}>
                    <Form.Item name="name" label="Nama" rules={[ { required: true } ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[ { required: true } ]}>
                        <Select>
                            <Option value="guru">Guru</Option>
                            <Option value="siswa">Siswa</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StudentListPage;