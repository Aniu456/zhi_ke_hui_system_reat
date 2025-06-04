import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Space, Modal, Form, Select,
  message, Card, Avatar, Tag, Popconfirm, Tabs, Descriptions, Badge
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, UserOutlined, ExclamationCircleOutlined,
  IdcardOutlined, BookOutlined, MailOutlined, PhoneOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

function StudentsPage() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [form] = Form.useForm();

  // 模拟获取学生数据
  useEffect(() => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockStudents = [
        {
          id: 1,
          name: '李明',
          studentId: '20210001',
          gender: '男',
          age: 20,
          grade: '2021',
          major: '计算机科学',
          class: '计算机2101',
          email: 'liming@example.com',
          phone: '13800138001',
          address: '北京市海淀区',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liming',
          enrollDate: '2021-09-01',
          courses: [
            { id: 1, name: 'Java程序设计', score: 88 },
            { id: 3, name: '数据结构与算法', score: 92 },
            { id: 7, name: '计算机网络', score: 76 }
          ]
        },
        {
          id: 2,
          name: '王芳',
          studentId: '20210002',
          gender: '女',
          age: 19,
          grade: '2021',
          major: '电子工程',
          class: '电子2102',
          email: 'wangfang@example.com',
          phone: '13800138002',
          address: '上海市浦东新区',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang',
          enrollDate: '2021-09-01',
          courses: [
            { id: 2, name: 'Web前端开发', score: 95 },
            { id: 4, name: '人工智能导论', score: 85 },
            { id: 6, name: '数据库系统', score: 88 }
          ]
        },
        {
          id: 3,
          name: '张伟',
          studentId: '20210003',
          gender: '男',
          age: 21,
          grade: '2021',
          major: '软件工程',
          class: '软件2101',
          email: 'zhangwei@example.com',
          phone: '13800138003',
          address: '广州市天河区',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei',
          enrollDate: '2021-09-01',
          courses: [
            { id: 1, name: 'Java程序设计', score: 82 },
            { id: 2, name: 'Web前端开发', score: 90 },
            { id: 5, name: '移动应用开发', score: 87 }
          ]
        },
        {
          id: 4,
          name: '刘洋',
          studentId: '20210004',
          gender: '男',
          age: 20,
          grade: '2021',
          major: '通信工程',
          class: '通信2103',
          email: 'liuyang@example.com',
          phone: '13800138004',
          address: '深圳市南山区',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang',
          enrollDate: '2021-09-01',
          courses: [
            { id: 3, name: '数据结构与算法', score: 78 },
            { id: 6, name: '数据库系统', score: 80 },
            { id: 7, name: '计算机网络', score: 85 }
          ]
        },
        {
          id: 5,
          name: '陈晓',
          studentId: '20210005',
          gender: '女',
          age: 22,
          grade: '2021',
          major: '人工智能',
          class: '人工智能2101',
          email: 'chenxiao@example.com',
          phone: '13800138005',
          address: '杭州市西湖区',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenxiao',
          enrollDate: '2021-09-01',
          courses: [
            { id: 1, name: 'Java程序设计', score: 75 },
            { id: 4, name: '人工智能导论', score: 96 },
            { id: 5, name: '移动应用开发', score: 83 }
          ]
        },
        {
          id: 6,
          name: '赵强',
          studentId: '20220001',
          gender: '男',
          age: 19,
          grade: '2022',
          major: '计算机科学',
          class: '计算机2201',
          email: 'zhaoqiang@example.com',
          phone: '13800138006',
          address: '成都市武侯区',
          status: 'active',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoqiang',
          enrollDate: '2022-09-01',
          courses: [
            { id: 2, name: 'Web前端开发', score: 89 },
            { id: 3, name: '数据结构与算法', score: 76 },
            { id: 6, name: '数据库系统', score: 82 }
          ]
        },
        {
          id: 7,
          name: '孙燕',
          studentId: '20220002',
          gender: '女',
          age: 20,
          grade: '2022',
          major: '软件工程',
          class: '软件2201',
          email: 'sunyan@example.com',
          phone: '13800138007',
          address: '武汉市洪山区',
          status: 'suspend', // 休学
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunyan',
          enrollDate: '2022-09-01',
          courses: [
            { id: 1, name: 'Java程序设计', score: 81 },
            { id: 5, name: '移动应用开发', score: 88 },
            { id: 7, name: '计算机网络', score: 79 }
          ]
        },
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  // 过滤学生数据
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
      student.major.toLowerCase().includes(searchText.toLowerCase()) ||
      student.class.toLowerCase().includes(searchText.toLowerCase())
  );

  // 查看学生详情
  const showStudentDetails = (student) => {
    setCurrentStudent(student);
    setDetailsModalVisible(true);
  };

  // 打开创建/编辑学生模态框
  const showModal = (student = null) => {
    setEditingStudent(student);
    form.resetFields();
    
    if (student) {
      form.setFieldsValue({
        name: student.name,
        gender: student.gender,
        age: student.age,
        grade: student.grade,
        major: student.major,
        class: student.class,
        email: student.email,
        phone: student.phone,
        address: student.address,
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
        if (editingStudent) {
          // 编辑现有学生
          const updatedStudent = {
            ...editingStudent,
            ...values,
          };
          
          setStudents(prevStudents =>
            prevStudents.map(s => (s.id === editingStudent.id ? updatedStudent : s))
          );
          
          message.success('学生信息更新成功！');
        } else {
          // 创建新学生
          const year = new Date().getFullYear();
          const newStudentId = `${year}${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`;
          
          const newStudent = {
            ...values,
            id: Math.max(...students.map(s => s.id)) + 1,
            studentId: newStudentId,
            status: 'active',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.name}`,
            enrollDate: `${year}-09-01`,
            courses: []
          };
          
          setStudents(prevStudents => [...prevStudents, newStudent]);
          message.success('学生添加成功！');
        }
        
        setLoading(false);
        setIsModalVisible(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除学生
  const handleDelete = (id) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
      setLoading(false);
      message.success('学生删除成功！');
    }, 1000);
  };

  // 计算学生GPA
  const calculateGPA = (courses) => {
    if (!courses || courses.length === 0) return 0;
    const totalScore = courses.reduce((sum, course) => sum + course.score, 0);
    return (totalScore / courses.length).toFixed(2);
  };

  // 表格列配置
  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <a onClick={() => showStudentDetails(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: '班级',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      filters: Array.from(new Set(students.map(s => s.major))).map(major => ({
        text: major,
        value: major,
      })),
      onFilter: (value, record) => record.major === value,
    },
    {
      title: '入学年份',
      dataIndex: 'grade',
      key: 'grade',
      filters: Array.from(new Set(students.map(s => s.grade))).map(grade => ({
        text: grade,
        value: grade,
      })),
      onFilter: (value, record) => record.grade === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? '在读' : '休学'}
        </Tag>
      ),
      filters: [
        { text: '在读', value: 'active' },
        { text: '休学', value: 'suspend' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'GPA',
      key: 'gpa',
      render: (_, record) => calculateGPA(record.courses),
      sorter: (a, b) => calculateGPA(a.courses) - calculateGPA(b.courses),
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
            title="确定删除该学生吗？"
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

  // 学生课程表格列
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      render: (score) => {
        let color = 'green';
        if (score < 60) color = 'red';
        else if (score < 80) color = 'orange';
        return <Tag color={color}>{score}</Tag>;
      },
    },
  ];

  return (
    <div className="students-container">
      <Card
        title="学生管理"
        extra={
          <Space>
            <Input
              placeholder="搜索学生姓名、学号、专业或班级"
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
              添加学生
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredStudents}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 创建/编辑学生模态框 */}
      <Modal
        title={editingStudent ? '编辑学生信息' : '添加学生'}
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
            rules={[{ required: true, message: '请输入学生姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入学生姓名" />
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
            <Input type="number" min={16} max={50} placeholder="请输入年龄" />
          </Form.Item>

          <Form.Item
            name="grade"
            label="入学年份"
            rules={[{ required: true, message: '请选择入学年份' }]}
          >
            <Select placeholder="请选择入学年份">
              {['2020', '2021', '2022', '2023'].map(year => (
                <Option key={year} value={year}>{year}级</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="major"
            label="专业"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Select placeholder="请选择专业">
              {[
                '计算机科学', '软件工程', '电子工程', '通信工程',
                '人工智能', '数据科学', '信息安全'
              ].map(major => (
                <Option key={major} value={major}>{major}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="class"
            label="班级"
            rules={[{ required: true, message: '请输入班级' }]}
          >
            <Input placeholder="请输入班级" />
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
            name="address"
            label="住址"
          >
            <Input placeholder="请输入住址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 学生详情模态框 */}
      <Modal
        title="学生详细信息"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentStudent && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab={<span><IdcardOutlined />基本信息</span>} key="basic">
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <Avatar 
                  src={currentStudent.avatar} 
                  size={64} 
                  style={{ marginRight: '20px' }}
                />
                <div>
                  <h2 style={{ margin: '0 0 5px 0' }}>
                    {currentStudent.name}
                    <Tag 
                      color={currentStudent.status === 'active' ? 'green' : 'orange'}
                      style={{ marginLeft: '10px' }}
                    >
                      {currentStudent.status === 'active' ? '在读' : '休学'}
                    </Tag>
                  </h2>
                  <p style={{ margin: 0, color: '#888' }}>
                    学号: {currentStudent.studentId}
                  </p>
                </div>
              </div>

              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="性别">{currentStudent.gender}</Descriptions.Item>
                <Descriptions.Item label="年龄">{currentStudent.age}岁</Descriptions.Item>
                <Descriptions.Item label="专业">{currentStudent.major}</Descriptions.Item>
                <Descriptions.Item label="班级">{currentStudent.class}</Descriptions.Item>
                <Descriptions.Item label="入学年份">{currentStudent.grade}级</Descriptions.Item>
                <Descriptions.Item label="入学日期">{currentStudent.enrollDate}</Descriptions.Item>
                <Descriptions.Item label="邮箱" span={2}>{currentStudent.email}</Descriptions.Item>
                <Descriptions.Item label="联系电话" span={2}>{currentStudent.phone}</Descriptions.Item>
                <Descriptions.Item label="住址" span={2}>{currentStudent.address}</Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab={<span><BookOutlined />选修课程</span>} key="courses">
              <Card title={`平均分: ${calculateGPA(currentStudent.courses)}`}>
                <Table
                  dataSource={currentStudent.courses}
                  columns={courseColumns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
}

export default StudentsPage; 