import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import { UserOutlined, ReadOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
// import request from '../../utils/request';

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    courseCount: 0,
    activeCount: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  // 获取统计数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 模拟数据，实际项目中应该从后端获取
        // const response = await request.get('/dashboard/stats');
        // const data = response.data;
        
        // 模拟数据
        setTimeout(() => {
          setStats({
            studentCount: 1256,
            teacherCount: 68,
            courseCount: 137,
            activeCount: 92,
          });
          
          setRecentStudents([
            { id: 1, name: '李明', age: 20, major: '计算机科学', joinDate: '2023-09-01' },
            { id: 2, name: '王芳', age: 19, major: '电子工程', joinDate: '2023-09-02' },
            { id: 3, name: '张伟', age: 21, major: '软件工程', joinDate: '2023-09-03' },
            { id: 4, name: '刘洋', age: 20, major: '通信工程', joinDate: '2023-09-05' },
            { id: 5, name: '陈晓', age: 22, major: '人工智能', joinDate: '2023-09-10' },
          ]);
          
          setRecentCourses([
            { id: 1, name: 'Java程序设计', teacher: '张教授', students: 45, startDate: '2023-09-10' },
            { id: 2, name: 'Web前端开发', teacher: '李教授', students: 38, startDate: '2023-09-12' },
            { id: 3, name: '数据结构与算法', teacher: '王教授', students: 52, startDate: '2023-09-15' },
            { id: 4, name: '人工智能导论', teacher: '刘教授', students: 60, startDate: '2023-09-20' },
            { id: 5, name: '移动应用开发', teacher: '陈教授', students: 35, startDate: '2023-09-25' },
          ]);
          
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 学生表格列
  const studentColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '入学日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
  ];

  // 课程表格列
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '授课教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '学生人数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '开课日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <Spin spinning={loading}>
        <div style={{ minHeight: '200px' }}>
          <h2 style={{ marginBottom: '24px' }}>学校总览</h2>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card 
                className="clickable-card" 
                onClick={() => handleCardClick('/students')}
                hoverable
              >
                <Statistic 
                  title="学生总数" 
                  value={stats.studentCount} 
                  prefix={<UserOutlined />} 
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                className="clickable-card" 
                onClick={() => handleCardClick('/teachers')}
                hoverable
              >
                <Statistic 
                  title="教师总数" 
                  value={stats.teacherCount} 
                  prefix={<TeamOutlined />} 
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                className="clickable-card" 
                onClick={() => handleCardClick('/courses')}
                hoverable
              >
                <Statistic 
                  title="课程总数" 
                  value={stats.courseCount} 
                  prefix={<ReadOutlined />} 
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic 
                  title="活跃课程数" 
                  value={stats.activeCount} 
                  prefix={<BookOutlined />} 
                  valueStyle={{ color: '#fa541c' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="最近加入的学生">
                <Table 
                  dataSource={recentStudents} 
                  columns={studentColumns} 
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="最近开设的课程">
                <Table 
                  dataSource={recentCourses} 
                  columns={courseColumns} 
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
}

export default DashboardPage; 