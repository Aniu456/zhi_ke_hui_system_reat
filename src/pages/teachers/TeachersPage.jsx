import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Space, Modal, Form, Select,
  message, Card, Avatar, Tag, Popconfirm, Tabs, Descriptions, Divider
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, UserOutlined, ExclamationCircleOutlined,
  IdcardOutlined, BookOutlined, MailOutlined, PhoneOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

function TeachersPage() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [form] = Form.useForm();

  // 模拟获取教师数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const mockTeachers = [
        {
          id: 101,
          name: '张教授',
          teacherId: 'T20180101',
          gender: '男',
          age: 45,
          title: '教授',
          department: '计算机科学系',
          subject: '计算机科学',
          email: 'zhang@example.com',
          phone: '13900138001',
          office: '科技楼A301',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
          joinDate: '2018-07-01',
          courses: [
            { id: 1, name: 'Java程序设计', students: 45, semester: '2023-2024-1' },
            { id: 7, name: '计算机网络', students: 58, semester: '2023-2024-1' }
          ],
          research: ['人工智能', '机器学习', '计算机视觉'],
          education: [
            { degree: '博士', school: '清华大学', major: '计算机科学', year: '2005' },
            { degree: '硕士', school: '北京大学', major: '软件工程', year: '2002' },
            { degree: '学士', school: '浙江大学', major: '计算机科学', year: '1999' }
          ]
        },
        {
          id: 102,
          name: '李教授',
          teacherId: 'T20180102',
          gender: '男',
          age: 42,
          title: '教授',
          department: '软件工程系',
          subject: '软件工程',
          email: 'li@example.com',
          phone: '13900138002',
          office: '科技楼B201',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
          joinDate: '2018-07-01',
          courses: [
            { id: 2, name: 'Web前端开发', students: 38, semester: '2023-2024-1' }
          ],
          research: ['软件测试', 'Web技术', '软件工程方法学'],
          education: [
            { degree: '博士', school: '上海交通大学', major: '软件工程', year: '2007' },
            { degree: '硕士', school: '复旦大学', major: '计算机科学', year: '2004' },
            { degree: '学士', school: '南京大学', major: '计算机科学', year: '2001' }
          ]
        },
        {
          id: 103,
          name: '王教授',
          teacherId: 'T20180103',
          gender: '男',
          age: 48,
          title: '教授',
          department: '数据科学系',
          subject: '数据科学',
          email: 'wang@example.com',
          phone: '13900138003',
          office: '科技楼A401',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
          joinDate: '2018-07-01',
          courses: [
            { id: 3, name: '数据结构与算法', students: 52, semester: '2023-2024-1' }
          ],
          research: ['数据挖掘', '大数据分析', '算法设计'],
          education: [
            { degree: '博士', school: '北京大学', major: '计算机科学', year: '2003' },
            { degree: '硕士', school: '中国科学院', major: '应用数学', year: '2000' },
            { degree: '学士', school: '武汉大学', major: '数学', year: '1997' }
          ]
        },
        {
          id: 104,
          name: '刘教授',
          teacherId: 'T20190101',
          gender: '男',
          age: 40,
          title: '副教授',
          department: '人工智能学院',
          subject: '人工智能',
          email: 'liu@example.com',
          phone: '13900138004',
          office: '创新楼A501',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu',
          joinDate: '2019-07-01',
          courses: [
            { id: 4, name: '人工智能导论', students: 60, semester: '2023-2024-1' }
          ],
          research: ['深度学习', '自然语言处理', '计算机视觉'],
          education: [
            { degree: '博士', school: '斯坦福大学', major: '计算机科学', year: '2010' },
            { degree: '硕士', school: '麻省理工学院', major: '电子工程', year: '2007' },
            { degree: '学士', school: '复旦大学', major: '计算机科学', year: '2004' }
          ]
        },
        {
          id: 105,
          name: '陈教授',
          teacherId: 'T20190102',
          gender: '女',
          age: 38,
          title: '副教授',
          department: '移动开发中心',
          subject: '移动开发',
          email: 'chen@example.com',
          phone: '13900138005',
          office: '创新楼B301',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
          joinDate: '2019-07-01',
          courses: [
            { id: 5, name: '移动应用开发', students: 35, semester: '2023-2024-1' }
          ],
          research: ['移动计算', '用户界面设计', 'iOS/Android开发'],
          education: [
            { degree: '博士', school: '香港科技大学', major: '计算机科学', year: '2012' },
            { degree: '硕士', school: '浙江大学', major: '软件工程', year: '2009' },
            { degree: '学士', school: '华中科技大学', major: '计算机科学', year: '2006' }
          ]
        },
        {
          id: 106,
          name: '赵教授',
          teacherId: 'T20200101',
          gender: '男',
          age: 44,
          title: '教授',
          department: '数据库系统研究中心',
          subject: '数据库系统',
          email: 'zhao@example.com',
          phone: '13900138006',
          office: '科技楼C201',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
          joinDate: '2020-07-01',
          courses: [
            { id: 6, name: '数据库系统', students: 50, semester: '2023-2024-1' }
          ],
          research: ['分布式数据库', '数据库安全', 'NoSQL系统'],
          education: [
            { degree: '博士', school: '清华大学', major: '计算机科学', year: '2008' },
            { degree: '硕士', school: '北京大学', major: '软件工程', year: '2005' },
            { degree: '学士', school: '哈尔滨工业大学', major: '计算机科学', year: '2002' }
          ]
        },
        {
          id: 107,
          name: '孙教授',
          teacherId: 'T20200102',
          gender: '女',
          age: 41,
          title: '副教授',
          department: '网络安全实验室',
          subject: '网络安全',
          email: 'sun@example.com',
          phone: '13900138007',
          office: '科技楼C301',
          status: 'leave', // 休假
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sun',
          joinDate: '2020-07-01',
          courses: [],
          research: ['网络安全', '密码学', '安全协议'],
          education: [
            { degree: '博士', school: '北京邮电大学', major: '信息安全', year: '2010' },
            { degree: '硕士', school: '西安电子科技大学', major: '计算机科学', year: '2007' },
            { degree: '学士', school: '电子科技大学', major: '通信工程', year: '2004' }
          ]
        }
      ];
      
      setTeachers(mockTeachers);
      setLoading(false);
    }, 1000);
  }, []);

  // 过滤教师数据
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchText.toLowerCase())
  );

  // 查看教师详情
  const showTeacherDetails = (teacher) => {
    setCurrentTeacher(teacher);
    setDetailsModalVisible(true);
  };

  // 打开创建/编辑教师模态框
  const showModal = (teacher = null) => {
    setEditingTeacher(teacher);
    form.resetFields();
    
    if (teacher) {
      form.setFieldsValue({
        name: teacher.name,
        gender: teacher.gender,
        age: teacher.age,
        title: teacher.title,
        department: teacher.department,
        subject: teacher.subject,
        email: teacher.email,
        phone: teacher.phone,
        office: teacher.office,
      });
    }
    
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API请求
      setTimeout(() => {
        if (editingTeacher) {
          // 编辑现有教师
          const updatedTeacher = {
            ...editingTeacher,
            ...values,
          };
          
          setTeachers(prevTeachers =>
            prevTeachers.map(t => (t.id === editingTeacher.id ? updatedTeacher : t))
          );
          
          message.success('教师信息更新成功！');
        } else {
          // 创建新教师
          const year = new Date().getFullYear();
          const newTeacherId = `T${year}${String(Math.floor(1000 + Math.random() * 9000)).substring(0, 4)}`;
          
          const newTeacher = {
            ...values,
            id: Math.max(...teachers.map(t => t.id)) + 1,
            teacherId: newTeacherId,
            status: 'active',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
            joinDate: `${year}-07-01`,
            courses: [],
            research: [],
            education: []
          };
          
          setTeachers(prevTeachers => [...prevTeachers, newTeacher]);
          message.success('教师添加成功！');
        }
        
        setLoading(false);
        setIsModalVisible(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除教师
  const handleDelete = (id) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== id));
      setLoading(false);
      message.success('教师删除成功！');
    }, 1000);
  };

  // 表格列配置
  const columns = [
    {
      title: '工号',
      dataIndex: 'teacherId',
      key: 'teacherId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <a onClick={() => showTeacherDetails(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: '职称',
      dataIndex: 'title',
      key: 'title',
      filters: [
        { text: '教授', value: '教授' },
        { text: '副教授', value: '副教授' },
        { text: '讲师', value: '讲师' },
      ],
      onFilter: (value, record) => record.title === value,
    },
    {
      title: '系部',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '研究方向',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: '授课数量',
      key: 'courseCount',
      render: (_, record) => record.courses.length,
      sorter: (a, b) => a.courses.length - b.courses.length,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? '在职' : '休假'}
        </Tag>
      ),
      filters: [
        { text: '在职', value: 'active' },
        { text: '休假', value: 'leave' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该教师吗？"
            description="此操作不可撤销！"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 教师课程表格列
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: '学生人数',
      dataIndex: 'students',
      key: 'students',
    },
  ];

  return (
    <div className="teachers-container">
      <Card
        title="教师管理"
        extra={
          <Space>
            <Input
              placeholder="搜索教师姓名、工号、系部或研究方向"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              添加教师
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredTeachers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 创建/编辑教师模态框 */}
      <Modal
        title={editingTeacher ? '编辑教师信息' : '添加教师'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入教师姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入教师姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <Input type="number" min={25} max={70} placeholder="请输入年龄" />
          </Form.Item>

          <Form.Item
            name="title"
            label="职称"
            rules={[{ required: true, message: '请选择职称' }]}
          >
            <Select placeholder="请选择职称">
              <Option value="教授">教授</Option>
              <Option value="副教授">副教授</Option>
              <Option value="讲师">讲师</Option>
              <Option value="助教">助教</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="所属系部"
            rules={[{ required: true, message: '请输入所属系部' }]}
          >
            <Input placeholder="请输入所属系部" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="研究方向"
            rules={[{ required: true, message: '请输入研究方向' }]}
          >
            <Input placeholder="请输入研究方向" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
              { required: true, message: '请输入邮箱' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
              { required: true, message: '请输入联系电话' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="office"
            label="办公室"
          >
            <Input placeholder="请输入办公室位置" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 教师详情模态框 */}
      <Modal
        title="教师详细信息"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentTeacher && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab={<span><IdcardOutlined />基本信息</span>} key="basic">
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <Avatar 
                  src={currentTeacher.avatar} 
                  size={64} 
                  style={{ marginRight: '20px' }}
                />
                <div>
                  <h2 style={{ margin: '0 0 5px 0' }}>
                    {currentTeacher.name}
                    <Tag 
                      color={currentTeacher.status === 'active' ? 'green' : 'orange'}
                      style={{ marginLeft: '10px' }}
                    >
                      {currentTeacher.status === 'active' ? '在职' : '休假'}
                    </Tag>
                  </h2>
                  <p style={{ margin: 0, color: '#888' }}>
                    {currentTeacher.title} · {currentTeacher.department}
                  </p>
                  <p style={{ margin: '5px 0 0 0', color: '#888' }}>
                    工号: {currentTeacher.teacherId}
                  </p>
                </div>
              </div>

              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="性别">{currentTeacher.gender}</Descriptions.Item>
                <Descriptions.Item label="年龄">{currentTeacher.age}岁</Descriptions.Item>
                <Descriptions.Item label="研究方向">{currentTeacher.subject}</Descriptions.Item>
                <Descriptions.Item label="入职日期">{currentTeacher.joinDate}</Descriptions.Item>
                <Descriptions.Item label="邮箱" span={2}>{currentTeacher.email}</Descriptions.Item>
                <Descriptions.Item label="联系电话" span={2}>{currentTeacher.phone}</Descriptions.Item>
                <Descriptions.Item label="办公室" span={2}>{currentTeacher.office}</Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab={<span><BookOutlined />授课信息</span>} key="courses">
              {currentTeacher.courses.length > 0 ? (
                <Table
                  dataSource={currentTeacher.courses}
                  columns={courseColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  暂无授课信息
                </div>
              )}
            </TabPane>

            <TabPane tab={<span><TrophyOutlined />教育背景</span>} key="education">
              {currentTeacher.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: index !== currentTeacher.education.length - 1 ? '16px' : '0' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {edu.degree} · {edu.school}
                  </p>
                  <p style={{ margin: '0', color: '#888' }}>
                    {edu.major} · {edu.year}年
                  </p>
                  {index !== currentTeacher.education.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                </div>
              ))}
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
}

export default TeachersPage;
