import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context';

// 私有路由组件，未登录时重定向到登录页
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  // 如果正在加载认证状态，显示加载中
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin spinning={true} size="large">
          <div className="content" style={{ padding: '50px', textAlign: 'center' }}>
            加载中...
          </div>
        </Spin>
      </div>
    );
  }

  // 未登录时重定向到登录页
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 已登录显示子组件
  return children;
}

export default PrivateRoute; 