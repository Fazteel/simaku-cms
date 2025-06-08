// src/AppRoutes.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserList from '../features/user/pages/UserList';
import StudentList from '../features/user/pages/StudentList';
import VacancyListPage from '../features/vacancy/pages/VacancyList';
import AttendanceListPage from '../features/attendance/pages/AttendanceList';
import GenerateQrPage from '../features/attendance/pages/GenerateQRCode';
import ScanPage from '../features/attendance/pages/ScanPage';
import LeaderboardPage from '../features/attendance/pages/LeaderboardPage';
import DashboardPage from '../components/layout/DashboardPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/scan/:secret" element={<ScanPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserList />} />
          <Route path="student" element={<StudentList />} />
          <Route path="vacancies" element={<VacancyListPage />} />
          <Route path="attendance" element={<AttendanceListPage />} />
          <Route path="generate-qr" element={<GenerateQrPage />} />
        </Route>
      </Route>

    </Routes>
  </Router>
);

export default AppRoutes;