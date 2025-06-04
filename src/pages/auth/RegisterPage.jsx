import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { register } from '../../api/auth';
import './AuthPage.css';

const { Option } = Select;

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 处理注册
  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await register(values);
      message.success('注册成功！请登录');
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
      const errorMsg = error.response?.data?.message || error.message || '注册失败，请稍后再试';
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

      {/* 右侧部分 - 注册表单 */}
      <div className="right-panel">
        <div className="form-wrapper">
          <h2 className="title">用户注册</h2>

          <Form
            name="register"
            onFinish={handleRegister}
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
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少为6个字符' }
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
              />
            </Form.Item>

            <Form.Item
              name="realName"
              rules={[{ required: true, message: '请输入真实姓名' }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="真实姓名"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { type: 'email', message: '邮箱格式不正确' },
                { required: true, message: '请输入邮箱' }
              ]}>
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}>
              <Input
                prefix={<PhoneOutlined />}
                placeholder="手机号（选填）"
              />
            </Form.Item>

            <Form.Item
              name="role"
              rules={[{ required: true, message: '请选择角色' }]}>
              <Select placeholder="请选择角色">
                <Option value="teacher">教师</Option>
                <Option value="student">学生</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="submit-btn">
                注册
              </Button>
            </Form.Item>

            <div className="register-link">
              已有账号？ <Link to="/login">立即登录</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 