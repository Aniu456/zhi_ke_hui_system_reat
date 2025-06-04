import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../api/auth';
import { useAuth } from '../../context';
import './AuthPage.css';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUserInfo } = useAuth();

  // 处理登录
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      
      // 调用登录API
      const response = await login(values);
      const { access_token, user } = response.data;
      
      // 确保user有sub字段（如果缺少但有id）
      let userToStore = user;
      if (user && !user.sub && user.id) {
        userToStore = { ...user, sub: user.id };
        console.log('登录时为用户添加sub字段:', userToStore);
      }
      
      // 保存登录信息
      setToken(access_token);
      setUserInfo(userToStore);
      
      message.success('登录成功！');
      navigate('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      const errorMsg = error.response?.data?.message || error.message || '登录失败，请检查用户名或密码';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* 左侧部分 - 蓝色背景和图片 */}
      <div className="left-panel">
        <div className="slogan">
          <h1>智课汇教育</h1>
          <h2>一站式教育管理系统</h2>
        </div>
      </div>

      {/* 右侧部分 - 登录表单 */}
      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="title">用户登录</h2>

          <Form
            name="login"
            onFinish={handleLogin}
            size="large"
            className="login-form">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-btn">
                登录
              </Button>
            </Form.Item>

            <div className="register-link">
              还没有账号？ <Link to="/register">立即注册</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 