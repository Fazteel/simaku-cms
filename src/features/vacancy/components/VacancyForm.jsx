import React from 'react';
import { Form, Input, InputNumber, DatePicker } from 'antd';

const { TextArea } = Input;

const VacancyForm = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="nama_perusahaan"
        label="Nama Perusahaan"
        rules={[{ required: true, message: 'Nama perusahaan wajib diisi!' }]}
      >
        <Input placeholder="Contoh: PT Teknologi Nusantara" />
      </Form.Item>

      <Form.Item
        name="deskripsi"
        label="Deskripsi Lowongan"
        rules={[{ required: true, message: 'Deskripsi wajib diisi!' }]}
      >
        <TextArea rows={4} placeholder="Jelaskan detail lowongan, kualifikasi, durasi, dll." />
      </Form.Item>

      <Form.Item
        name="lokasi"
        label="Lokasi"
        rules={[{ required: true, message: 'Lokasi wajib diisi!' }]}
      >
        <Input placeholder="Contoh: Jakarta Selatan" />
      </Form.Item>

      <Form.Item
        name="kuota"
        label="Kuota Tersedia"
        rules={[{ required: true, message: 'Kuota wajib diisi!' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="Jumlah siswa yang dibutuhkan" />
      </Form.Item>

      <Form.Item
        name="tanggal_dibuka"
        label="Tanggal Dibuka"
        rules={[{ required: true, message: 'Tanggal dibuka wajib dipilih!' }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Pilih tanggal" />
      </Form.Item>
    </Form>
  );
};

export default VacancyForm;