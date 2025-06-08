import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Typography, Button, Modal, Form, App, Divider, Spin, Alert, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import VacancyForm from '../components/VacancyForm';
import VacancyCard from '../components/VacancyCard';
import { createVacancy, deleteVacancy, getAllVacancies, updateVacancy } from '../vacancyService';

const { Title } = Typography;
const contentStyle = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const VacancyListPage = () => {
    const [ loading, setLoading ] = useState(false);
    const [ vacancies, setVacancies ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ isAddModalOpen, setIsAddModalOpen ] = useState(false);
    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
    const [ editingVacancy, setEditingVacancy ] = useState(null);
    const [ loadingSubmit, setLoadingSubmit ] = useState(false);
    const [ refreshKey, setRefreshKey ] = useState(0);

    const [ addForm ] = Form.useForm();
    const [ editForm ] = Form.useForm();

    const content = <div style={contentStyle} />;

    const { notification, modal } = App.useApp();

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                setLoading(true);
                const response = await getAllVacancies();
                setVacancies(response.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat data lowongan.');
            } finally {
                setLoading(false);
            }
        };
        fetchVacancies();
    }, [ refreshKey ]);

    const triggerRefresh = () => setRefreshKey(prev => prev + 1);

    const handleAddSubmit = async (values) => {
        setLoadingSubmit(true);
        const formattedValues = { ...values, tanggal_dibuka: values.tanggal_dibuka.format('YYYY-MM-DD') };
        try {
            await createVacancy(formattedValues);
            notification.success({ message: 'Lowongan baru berhasil ditambahkan.' });
            setIsAddModalOpen(false);
            addForm.resetFields();
            triggerRefresh();
        } catch (err) {
            notification.error({ message: err.response?.data?.message || 'Gagal menambahkan lowongan.' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleEditClick = (record) => {
        setEditingVacancy(record);
        const initialValues = {
            ...record,
            tanggal_dibuka: record.tanggal_dibuka ? dayjs(record.tanggal_dibuka, 'YYYY-MM-DD') : null,
        };
        editForm.setFieldsValue(initialValues);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        setLoadingSubmit(true);
        try {
            const values = await editForm.validateFields();
            const formattedValues = { ...values, tanggal_dibuka: values.tanggal_dibuka.format('YYYY-MM-DD') };

            await updateVacancy(editingVacancy.id, formattedValues);
            notification.success({ message: 'Lowongan berhasil diperbarui!' });
            setIsEditModalOpen(false);
            editForm.resetFields();
            triggerRefresh();
        } catch (err) {
            notification.error({ message: err.response?.data?.message || 'Gagal memperbarui lowongan.' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleDeleteClick = (record) => {
        modal.confirm({
            title: 'Konfirmasi Hapus',
            content: `Apakah Anda yakin ingin menghapus lowongan ${record.nama_perusahaan}?`,
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await deleteVacancy(record.id);
                    notification.success({ message: 'Lowongan berhasil dihapus!' });
                    triggerRefresh();
                } catch (err) {
                    notification.error({ message: err.response?.data?.message || 'Gagal menghapus lowongan.' });
                }
            },
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Manajemen Lowongan</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                    Tambah Lowongan
                </Button>
            </div>
            <Divider />

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Spin tip="Loading">{content}</Spin>
                </div>
            ) : error ? (
                <Alert message='Error' description={error} type='error' showIcon />
            ) : (
                <Row gutter={[ 16, 16 ]}>
                    {vacancies.map((vacancy) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={vacancy.id}>
                            <VacancyCard
                                vacancy={vacancy}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                title="Tambah Lowongan Baru"
                style={{top: 20}}
                open={isAddModalOpen}
                onOk={() => addForm.submit()}
                onCancel={() => { setIsAddModalOpen(false); addForm.resetFields(); }}
                confirmLoading={loadingSubmit}
                okText="Simpan"
                cancelText="Batal"
            >
                <VacancyForm form={addForm} onFinish={handleAddSubmit} />
            </Modal>

            <Modal
                title={`Edit Lowongan: ${editingVacancy?.nama_perusahaan}`}
                style={{top: 20}}
                open={isEditModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => { setIsEditModalOpen(false); editForm.resetFields(); }}
                confirmLoading={loadingSubmit}
                okText="Simpan Perubahan"
                cancelText="Batal"
            >
                <VacancyForm form={editForm} />
            </Modal>
        </div>
    );
};

export default VacancyListPage;