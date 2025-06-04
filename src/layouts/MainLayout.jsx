import { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button, Drawer, Timeline, Empty, Card } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ReadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  LogoutOutlined,
  TeamOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useAuth } from '../context';
import { useHistory } from '../context/HistoryContext';
import { formatRelativeTime } from '../utils/format';

const { Header, Sider, Content } = Layout;

// 添加baseApiUrl常量
const baseApiUrl = 'http://localhost:3001';

// 菜单配置
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '学校师生总数据',
  },
  {
    key: '/courses',
    icon: <ReadOutlined />,
    label: '课程管理',
  },
  {
    key: '/students',
    icon: <UserOutlined />,
    label: '学生管理',
  },
  {
    key: '/teachers',
    icon: <TeamOutlined />,
    label: '教师管理',
  },
  // {
  //   key: '/profile', // 从侧边栏移除
  //   icon: <ProfileOutlined />,
  //   label: '个人中心',
  // },
];

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const { userInfo, clearUserInfo } = useAuth();
  const { visitHistory, addVisitRecord, clearHistory } = useHistory();
  const navigate = useNavigate();
  const location = useLocation();

  // 使用useMemo计算当前菜单标题，避免重新计算
  const currentMenuTitle = useMemo(() => {
    // 特殊处理个人中心页面
    if (location.pathname === '/profile') {
      return '个人中心';
    }
    return menuItems.find(item => item.key === location.pathname)?.label || '首页';
  }, [location.pathname]);

  // 监听路由变化，记录访问历史
  useEffect(() => {
    // 只有当路径和标题都存在时才添加记录
    if (location.pathname && currentMenuTitle && addVisitRecord) {
      addVisitRecord(location.pathname, currentMenuTitle);
    }
  }, [location.pathname, currentMenuTitle, addVisitRecord]);

  // 跳转到历史记录路径
  const goToHistory = (path) => {
    navigate(path);
    setShowHistoryDrawer(false);
  };

  // 退出登录
  const handleLogout = () => {
    clearUserInfo();
    navigate('/login');
  };

  const dropdownItems = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/profile'), // 点击跳转到个人中心
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{ 
          overflow: 'auto', 
          height: '100vh', 
          position: 'fixed', 
          left: 0,
          top: 0,
          bottom: 0,
          background: '#35495e'
        }}
        width={220}
      >
        <div style={{ 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          padding: '0 10px'
        }}>
          {!collapsed ? <h1>智课汇后台</h1> : <span style={{ fontSize: '26px' }}>智</span>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onSelect={({ key }) => navigate(key)}
          style={{ backgroundColor: '#35495e', borderRight: 'none' }}
        />
      </Sider>

      {/* 主体内容 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'all 0.2s' }}>
        {/* 头部 */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 20px', 
          borderBottom: '1px solid #dcdfe6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collapsed ? 
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: '20px', cursor: 'pointer' }} /> : 
              <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
            }
            <Breadcrumb style={{ marginLeft: '20px' }} items={[
              { title: '首页' },
              ...(currentMenuTitle === '首页' ? [] : [{ title: currentMenuTitle }])
            ]} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* 历史记录按钮 */}
            <Button 
              type="text" 
              icon={<ClockCircleOutlined />} 
              onClick={() => setShowHistoryDrawer(true)}
              style={{ marginRight: '20px' }}
            >
              访问历史
            </Button>

            {/* 用户信息下拉菜单 */}
            <Dropdown menu={{ items: dropdownItems }}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar 
                  src={userInfo?.avatar ? 
                    (userInfo.avatar.startsWith('http') ? userInfo.avatar : `${baseApiUrl}${userInfo.avatar}`) : 
                    undefined} 
                  style={{ marginRight: '8px' }} 
                />
                <span>{userInfo?.realName || '用户'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content style={{ margin: '5px', padding: '12px', background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>

      {/* 历史记录抽屉 */}
      <Drawer 
        title="访问历史" 
        placement="right" 
        onClose={() => setShowHistoryDrawer(false)} 
        open={showHistoryDrawer}
        width={300}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <Button type="link" icon={<DeleteOutlined />} onClick={clearHistory}>
            清空历史
          </Button>
        </div>

        {visitHistory.length === 0 ? (
          <Empty description="暂无访问记录" />
        ) : (
          <Timeline>
            {visitHistory.map((record, index) => (
              <Timeline.Item 
                key={index} 
                color={index === 0 ? 'blue' : 'gray'}
              >
                <Card 
                  size="small" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => goToHistory(record.path)}
                >
                  <div>{record.title}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {formatRelativeTime(record.timestamp)}
                  </div>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Drawer>
    </Layout>
  );
}

export default MainLayout; 