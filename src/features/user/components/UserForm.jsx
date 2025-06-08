import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ role: 'siswa', name: '', email: '' }}
      autoComplete="off"
    >
      <Form.Item
        label="Nama Lengkap"
        name="name"
        rules={[{ required: true, message: 'Nama tidak boleh kosong!' }]}
      >
        <Input placeholder="Masukkan nama user" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email tidak boleh kosong!' },
          { type: 'email', message: 'Format email tidak valid!' }
        ]}
      >
        <Input placeholder="Masukkan email user" />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: 'Silakan pilih role!' }]}
      >
        <Select placeholder="Pilih role untuk user">
          <Option value="siswa">Siswa</Option>
          <Option value="guru">Guru</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default UserForm;