import React from 'react';
import { Table, Tag } from 'antd';
import dayjs from 'dayjs';

const AttendanceTable = ({ attendances, loading }) => {
  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 60,
    },
    {
      title: 'Nama Siswa',
      key: 'name',
      render: (record) => record.User ? record.User.name : 'User Tidak Ditemukan',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (tanggal) => dayjs(tanggal).format('DD MMMM YYYY'),
    },
    {
      title: 'Jam Masuk',
      dataIndex: 'check_in',
      key: 'check_in',
      render: (time) => time || '-',
    },
    {
      title: 'Jam Pulang',
      dataIndex: 'check_out',
      key: 'check_out',
      render: (time) => time || '-',
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      key: 'keterangan',
      render: (keterangan) => {
        let color;
        const lowerCaseKeterangan = keterangan.toLowerCase();
        if (lowerCaseKeterangan === 'hadir') {
          color = 'green';
        } else if (lowerCaseKeterangan === 'sakit') {
          color = 'orange';
        } else if (lowerCaseKeterangan === 'izin') {
          color = 'blue';
        } else if (lowerCaseKeterangan === 'alpha') {
          color = 'red';
        } else {
          color = 'default';
        }
        return <Tag color={color}>{keterangan.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Alasan',
      dataIndex: 'alasan',
      key: 'alasan',
      render: (text) => text || '-',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={attendances}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      style={{ marginTop: '24px' }}
      scroll={{ x: 800 }}
    />
  );
};

export default AttendanceTable;