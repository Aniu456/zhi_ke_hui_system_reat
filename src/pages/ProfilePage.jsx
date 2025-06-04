import React, { useState, useEffect } from 'react';
import { 
  Typography, Card, Descriptions, Avatar, Divider, Empty, Form, 
  Input, Button, message, Upload, Modal, Tabs, Badge, Row, Col,
  Space, Tooltip, Progress
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, 
  UploadOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, 
  PlusOutlined, EditOutlined, SaveOutlined, CameraOutlined,
  CheckCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function ProfilePage() {
  const { userInfo, setUserInfo, clearUserInfo } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();
  
  // 头像上传相关状态
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  // 成功状态管理
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 资料完整度计算
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const baseApiUrl = 'http://localhost:3001';

  // 计算资料完整度
  useEffect(() => {
    if (userInfo) {
      let completedFields = 0;
      const totalFields = 5; // username, realName, email, phone, avatar
      
      if (userInfo.username) completedFields++;
      if (userInfo.realName) completedFields++;
      if (userInfo.email) completedFields++;
      if (userInfo.phone) completedFields++;
      if (userInfo.avatar || avatarUrl) completedFields++;
      
      setProfileCompleteness(Math.round((completedFields / totalFields) * 100));
    }
  }, [userInfo, avatarUrl]);

  useEffect(() => {
    // 确保用户信息已加载
    if (!userInfo) {
      // 尝试从localStorage获取
      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(savedUserInfo);
          
          // 确保parsedUserInfo有sub属性
          if (!parsedUserInfo.sub && parsedUserInfo.id) {
            parsedUserInfo.sub = parsedUserInfo.id;
            console.log('从localStorage恢复userInfo时添加sub字段:', parsedUserInfo);
          }
          
          setUserInfo(parsedUserInfo);
        } catch (e) {
          console.error('解析存储的用户信息失败', e);
        }
      }
    } else if (!userInfo.sub && userInfo.id) {
      // 如果userInfo已存在但没有sub字段，使用id作为sub
      const updatedUserInfo = { ...userInfo, sub: userInfo.id };
      console.log('现有userInfo中添加sub字段:', updatedUserInfo);
      setUserInfo(updatedUserInfo);
    }

    if (userInfo) {
      form.setFieldsValue({
        realName: userInfo.realName,
        email: userInfo.email,
        phone: userInfo.phone,
      });
      
      if (userInfo.avatar) {
        const fullAvatarUrl = userInfo.avatar.startsWith('http') 
          ? userInfo.avatar 
          : `${baseApiUrl}${userInfo.avatar}`;
        console.log('设置头像URL:', fullAvatarUrl);
        setAvatarUrl(fullAvatarUrl);
      }
    }
  }, [userInfo, form, setUserInfo]);

  const showSuccessModal = (message) => {
    setSuccessMessage(message);
    setSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const handleUpdateProfile = async (values) => {
    const userId = userInfo?.sub || userInfo?.id;
    if (!userId) {
      message.error('无法获取用户ID，更新失败');
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await request.patch(`/users/${userId}`, values);
      setUserInfo(response.data);
      showSuccessModal('个人信息更新成功！');
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMsg = error.response?.data?.message || error.message || '信息更新失败，请稍后再试。';
      message.error(errorMsg);
    }
    setIsUpdating(false);
  };

  const handleChangePassword = async (values) => {
    const userId = userInfo?.sub || userInfo?.id;
    if (!userId) {
      message.error('无法获取用户ID，修改密码失败');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await request.patch(`/users/${userId}/password`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      
      Modal.success({
        title: '密码修改成功',
        content: '您的密码已成功修改，请使用新密码重新登录。',
        okText: '确定',
        onOk: () => {
          clearUserInfo();
          navigate('/login');
        }
      });
      
      passwordForm.resetFields();
    } catch (error) {
      console.error('Failed to change password:', error);
      const errorMsg = error.response?.data?.message || error.message || '修改密码失败，请检查旧密码是否正确。';
      message.error(errorMsg);
    }
    setIsChangingPassword(false);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
      return false;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarUrl(reader.result);
    };

    return false;
  };
  
  // 删除旧头像文件
  const deleteOldAvatar = async (oldAvatarPath) => {
    if (!oldAvatarPath) return;
    
    // 提取文件名 - 从路径中获取最后一个斜杠后的内容
    const filename = oldAvatarPath.substring(oldAvatarPath.lastIndexOf('/') + 1);
    
    try {
      await request.delete(`/files/delete/${filename}`);
      console.log('成功删除旧头像文件:', filename);
    } catch (error) {
      console.error('删除旧头像文件失败:', error);
    }
  };

  const handleAvatarUpload = async () => {
    if (!fileList.length || !fileList[0]?.originFileObj) {
      message.error('请先选择有效的头像图片');
      return;
    }

    if (!userInfo) {
      message.error('用户信息未加载，请刷新页面重试');
      return;
    }

    const userId = userInfo.sub || userInfo.id;
    if (!userId) {
      message.error('无法获取用户ID，请重新登录');
      return;
    }

    const file = fileList[0].originFileObj;
    
    try {
      // 保存旧的头像路径，用于上传成功后删除旧文件
      const oldAvatarPath = userInfo.avatar;
      
      const formData = new FormData();
      formData.append('avatar', file); // 字段名必须与后端 FileInterceptor('avatar') 的参数一致
      
      console.log('上传头像请求的用户ID:', userId);
      const response = await request.patch(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data) {
        const updatedUser = response.data;
        if (updatedUser.avatar && !updatedUser.avatar.startsWith('http')) {
          updatedUser.avatar = `${baseApiUrl}${updatedUser.avatar}`;
          setAvatarUrl(updatedUser.avatar);
        }
        
        setUserInfo(updatedUser);
        
        if (oldAvatarPath && oldAvatarPath !== updatedUser.avatar) {
          deleteOldAvatar(oldAvatarPath);
        }
        
        showSuccessModal('头像更新成功！');
        setFileList([]);
      } else {
        message.error('头像更新成功，但未能获取最新用户信息。请尝试刷新页面。');
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
      const errorMsg = error.response?.data?.message || error.message || '上传头像失败，请稍后重试';
      message.error(errorMsg);
    }
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(fileList[0].originFileObj);
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
    } else {
      if (userInfo?.avatar) {
        const fullAvatarUrl = userInfo.avatar.startsWith('http') 
          ? userInfo.avatar 
          : `${baseApiUrl}${userInfo.avatar}`;
        setAvatarUrl(fullAvatarUrl);
      } else {
        setAvatarUrl('');
      }
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || '头像预览');
  };

  const previewCurrentAvatar = () => {
    if (avatarUrl) {
      setPreviewImage(avatarUrl);
      setPreviewVisible(true);
      setPreviewTitle('当前头像');
    }
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  if (!userInfo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px'
      }}>
        <Card style={{ textAlign: 'center', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <Empty description="正在加载用户信息..." />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      // minHeight: '100vh',
      // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      background: '#f5f2f1',
      // padding: '14px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 头部个人信息卡片 */}
        <Card 
          style={{ 
            marginBottom: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar 
                  src={avatarUrl} 
                  size={120} 
                  icon={<UserOutlined />} 
                  style={{ 
                    border: '4px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={previewCurrentAvatar}
                />
                <Badge 
                  count={<CameraOutlined style={{ color: '#fff' }} />}
                  style={{ 
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderRadius: '50%',
                    padding: '4px'
                  }}
                />
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  maxCount={1}
                >
                  <Button 
                    type="primary" 
                    ghost 
                    icon={<UploadOutlined />}
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: '#fff',
                      marginTop: '8px'
                    }}
                  >
                    更换头像
                  </Button>
                </Upload>
                
                {fileList.length > 0 && (
                  <Button 
                    type="primary" 
                    onClick={handleAvatarUpload} 
                    style={{ 
                      marginTop: '8px',
                      marginLeft: '8px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderColor: 'transparent'
                    }}
                    icon={<SaveOutlined />}
                  >
                    保存头像
                  </Button>
                )}
              </div>
            </Col>
            
            <Col xs={24} md={16}>
              <div style={{ color: '#fff' }}>
                <Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>
                  {userInfo.realName || userInfo.username}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                  @{userInfo.username}
                </Text>
                
                <div style={{ marginTop: '24px' }}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text style={{ color: 'rgba(255,255,255,0.9)' }}>资料完整度</Text>
                      <Progress 
                        percent={profileCompleteness} 
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                    
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Space>
                          <MailOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                          <Text style={{ color: '#fff' }}>
                            {userInfo.email || '未设置'}
                          </Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space>
                          <PhoneOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />
                          <Text style={{ color: '#fff' }}>
                            {userInfo.phone || '未设置'}
                          </Text>
                        </Space>
                      </Col>
                    </Row>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 主要内容区域 */}
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: 'none'
            
          }}
        >
          <Tabs 
            defaultActiveKey="info"
            size="large"
            style={{
              '.ant-tabs-tab': {
                padding: '12px 24px',
                fontSize: '16px'
              }
            }}
          >
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  个人信息
                </span>
              } 
              key="info"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <InfoCircleOutlined />
                        基本信息
                      </Space>
                    }
                    style={{ 
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Descriptions column={1} labelStyle={{ fontWeight: 600 }}>
                      <Descriptions.Item label="用户名">
                        <Text copyable>{userInfo.username || '未设置'}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="真实姓名">
                        {userInfo.realName || '未设置'}
                      </Descriptions.Item>
                      <Descriptions.Item label="邮箱地址">
                        <Text copyable>{userInfo.email || '未设置'}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="手机号码">
                        <Text copyable>{userInfo.phone || '未设置'}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <EditOutlined />
                        修改资料
                      </Space>
                    }
                    style={{ 
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleUpdateProfile}
                    >
                      <Form.Item
                        name="realName"
                        label="真实姓名"
                        rules={[{ required: true, message: '请输入真实姓名' }]}
                      >
                        <Input 
                          placeholder="请输入您的真实姓名"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="邮箱地址"
                        rules={[
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input 
                          placeholder="请输入您的邮箱地址"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="phone"
                        label="手机号码"
                      >
                        <Input 
                          placeholder="请输入您的手机号码"
                          style={{ borderRadius: '8px' }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          loading={isUpdating}
                          icon={<SaveOutlined />}
                          size="large"
                          style={{ 
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                          }}
                        >
                          保存更改
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <LockOutlined />
                  修改密码
                </span>
              } 
              key="password"
            >
              <Row justify="center">
                <Col xs={24} md={16} lg={12}>
                  <Card
                    title={
                      <Space>
                        <LockOutlined />
                        密码设置
                      </Space>
                    }
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handleChangePassword}
                    >
                      <Form.Item
                        name="oldPassword"
                        label="当前密码"
                        rules={[{ required: true, message: '请输入当前密码' }]}
                      >
                        <Input.Password 
                          prefix={<LockOutlined />}
                          placeholder="请输入当前密码"
                          style={{ borderRadius: '8px' }}
                          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </Form.Item>
                      <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                          { required: true, message: '请输入新密码' },
                          { min: 6, message: '密码长度不能小于6位' }
                        ]}
                      >
                        <Input.Password 
                          prefix={<LockOutlined />}
                          placeholder="请输入新密码"
                          style={{ borderRadius: '8px' }}
                          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </Form.Item>
                      <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true, message: '请确认新密码' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('两次输入的密码不一致'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password 
                          prefix={<LockOutlined />}
                          placeholder="请再次输入新密码"
                          style={{ borderRadius: '8px' }}
                          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button 
                          type="primary" 
                          htmlType="submit" 
                          loading={isChangingPassword}
                          size="large"
                          block
                          style={{ 
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                            border: 'none',
                            marginTop: '16px'
                          }}
                        >
                          修改密码
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>
      
      {/* 头像预览模态框 */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
        style={{ top: 20 }}
      >
        <img alt="头像预览" style={{ width: '100%', borderRadius: '8px' }} src={previewImage} />
      </Modal>
      
      {/* 操作成功提示弹窗 */}
      <Modal
        open={successModalVisible}
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            操作成功
          </Space>
        }
        onCancel={closeSuccessModal}
        footer={[
          <Button 
            key="ok" 
            type="primary" 
            onClick={closeSuccessModal}
            style={{ borderRadius: '6px' }}
          >
            确定
          </Button>,
        ]}
      >
        <p style={{ margin: '16px 0', fontSize: '16px' }}>{successMessage}</p>
      </Modal>
    </div>
  );
}

export default ProfilePage;