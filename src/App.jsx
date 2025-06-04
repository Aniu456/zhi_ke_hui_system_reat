import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './context';
import { HistoryProvider } from './context/HistoryContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CoursesPage from './pages/courses/CoursesPage';
import StudentsPage from './pages/students/StudentsPage';
import TeachersPage from './pages/teachers/TeachersPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/error/NotFoundPage';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <HistoryProvider>
          <Routes>
            {/* 公共路由 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* 受保护路由 */}
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* 重定向到404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </HistoryProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
