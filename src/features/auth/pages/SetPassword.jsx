import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, App, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { setPassword } from '../authService';

const { Title } = Typography;

const SetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { notification, modal } = App.useApp();
    const [form] = Form.useForm();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            notification.error({
                message: 'Token Tidak Valid',
                description: 'Link yang Anda gunakan tidak memiliki token. Silakan periksa kembali email Anda.',
            });
        }
    }, [token, notification]);


    const onFinish = async (values) => {
        setLoading(true);
        try {
            await setPassword(token, values.password);
            modal.success({
                title: 'Password Berhasil Diatur!',
                content: 'Anda sekarang dapat login menggunakan password baru Anda.',
            });
        } catch (err) {
            notification.error({
                message: 'Gagal',
                description: err.response?.data?.message || 'Token mungkin sudah kedaluwarsa atau tidak valid.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Atur Password Anda
                </Title>
                
                {!token ? (
                    <Alert
                        message="Token Tidak Ditemukan"
                        description="Pastikan Anda mengakses halaman ini dari link yang dikirimkan ke email Anda."
                        type="error"
                        showIcon
                    />
                ) : (
                    <Form
                        form={form}
                        name="set_password_form"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="password"
                            label="Password Baru"
                            rules={[
                                { required: true, message: 'Password tidak boleh kosong!' },
                                { min: 8, message: 'Password minimal harus 8 karakter.' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password Baru" />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            label="Konfirmasi Password Baru"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Harap konfirmasi password Anda!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Password yang Anda masukkan tidak cocok!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Konfirmasi Password" />
                        </Form.Item>
                        
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                                Atur Password
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default SetPasswordPage;