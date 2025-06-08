import React from 'react';
import { Card, Typography, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const VacancyCard = ({ vacancy, onEdit, onDelete }) => {
  return (
    <Card
      title={vacancy.nama_perusahaan}
      hoverable
      actions={[
        <EditOutlined key="edit" style={{color: 'orange'}} onClick={() => onEdit(vacancy)} />,
        <Popconfirm
          title="Hapus Lowongan"
          description="Apakah Anda yakin ingin menghapus lowongan ini?"
          onConfirm={() => onDelete(vacancy.id)}
          okText="Ya, Hapus"
          cancelText="Batal"
        >
          <DeleteOutlined key="delete" style={{ color: 'red' }} />
        </Popconfirm>,
      ]}
    >
      <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'lebih lanjut' }}>
        {vacancy.deskripsi}
      </Paragraph>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text><EnvironmentOutlined /> {vacancy.lokasi}</Text>
        <Text><TeamOutlined /> Kuota: {vacancy.kuota} orang</Text>
        <Text><CalendarOutlined /> Dibuka: {new Date(vacancy.tanggal_dibuka).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </Space>
    </Card>
  );
};

export default VacancyCard;