import { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Input, Space, Modal, Form, Select, 
  message, Card, Tooltip, Tag, Popconfirm 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, ExclamationCircleOutlined 
} from '@ant-design/icons';

const { Option } = Select;

function CoursesPage() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);

  // 使用useCallback包装数据获取函数，避免不必要的重新创建
  const fetchCourses = useCallback(() => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockCourses = [
        { 
          id: 1, 
          name: 'Java程序设计', 
          teacherId: 101, 
          teacher: '张教授', 
          credits: 4,
          hours: 64,
          capacity: 50,
          enrolledCount: 45, 
          status: 'active',
          description: 'Java编程基础课程，面向对象编程',
          startDate: '2023-09-10' 
        },
        { 
          id: 2, 
          name: 'Web前端开发', 
          teacherId: 102, 
          teacher: '李教授', 
          credits: 3,
          hours: 48,
          capacity: 45,
          enrolledCount: 38, 
          status: 'active',
          description: 'HTML, CSS, JavaScript基础课程',
          startDate: '2023-09-12' 
        },
        { 
          id: 3, 
          name: '数据结构与算法', 
          teacherId: 103, 
          teacher: '王教授', 
          credits: 4,
          hours: 64,
          capacity: 60,
          enrolledCount: 52, 
          status: 'active',
          description: '常用数据结构和算法分析',
          startDate: '2023-09-15' 
        },
        { 
          id: 4, 
          name: '人工智能导论', 
          teacherId: 104, 
          teacher: '刘教授', 
          credits: 3,
          hours: 48,
          capacity: 65,
          enrolledCount: 60, 
          status: 'active',
          description: '人工智能基础概念和应用',
          startDate: '2023-09-20' 
        },
        { 
          id: 5, 
          name: '移动应用开发', 
          teacherId: 105, 
          teacher: '陈教授', 
          credits: 3,
          hours: 48,
          capacity: 40,
          enrolledCount: 35, 
          status: 'active',
          description: '移动设备应用开发指南',
          startDate: '2023-09-25' 
        },
        { 
          id: 6, 
          name: '数据库系统', 
          teacherId: 106, 
          teacher: '赵教授', 
          credits: 4,
          hours: 64,
          capacity: 55,
          enrolledCount: 50, 
          status: 'active',
          description: '关系型数据库理论与实践',
          startDate: '2023-09-28' 
        },
        { 
          id: 7, 
          name: '计算机网络', 
          teacherId: 107, 
          teacher: '孙教授', 
          credits: 3,
          hours: 48,
          capacity: 60,
          enrolledCount: 58, 
          status: 'active',
          description: '计算机网络原理与协议',
          startDate: '2023-10-05' 
        }
      ];
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  // 使用useCallback包装教师数据获取函数
  const fetchTeachers = useCallback(() => {
    // 模拟API请求
    setTimeout(() => {
      const mockTeachers = [
        { id: 101, name: '张教授', subject: '计算机科学' },
        { id: 102, name: '李教授', subject: '软件工程' },
        { id: 103, name: '王教授', subject: '数据科学' },
        { id: 104, name: '刘教授', subject: '人工智能' },
        { id: 105, name: '陈教授', subject: '移动开发' },
        { id: 106, name: '赵教授', subject: '数据库系统' },
        { id: 107, name: '孙教授', subject: '网络安全' },
      ];
      setTeachers(mockTeachers);
    }, 500);
  }, []);

  // 组件挂载时只获取一次数据
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, [fetchCourses, fetchTeachers]);

  // 过滤课程数据
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchText.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchText.toLowerCase())
  );

  // 打开创建/编辑课程模态框
  const showModal = (course = null) => {
    setEditingCourse(course);
    form.resetFields();
    
    if (course) {
      form.setFieldsValue({
        name: course.name,
        teacherId: course.teacherId,
        credits: course.credits,
        hours: course.hours,
        capacity: course.capacity,
        description: course.description,
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
        if (editingCourse) {
          // 编辑现有课程
          const updatedCourse = {
            ...editingCourse,
            ...values,
            teacher: teachers.find(t => t.id === values.teacherId)?.name || '',
          };
          
          setCourses(prevCourses =>
            prevCourses.map(c => (c.id === editingCourse.id ? updatedCourse : c))
          );
          
          message.success('课程更新成功！');
        } else {
          // 创建新课程
          const newCourse = {
            ...values,
            id: Math.max(...courses.map(c => c.id)) + 1,
            teacher: teachers.find(t => t.id === values.teacherId)?.name || '',
            enrolledCount: 0,
            status: 'active',
            startDate: new Date().toISOString().split('T')[0],
          };
          
          setCourses(prevCourses => [...prevCourses, newCourse]);
          message.success('课程创建成功！');
        }
        
        setLoading(false);
        setIsModalVisible(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除课程
  const handleDelete = (id) => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      setLoading(false);
      message.success('课程删除成功！');
    }, 1000);
  };

  // 表格列配置
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Tooltip title={record.description}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '授课教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '学分',
      dataIndex: 'credits',
      key: 'credits',
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: '学时',
      dataIndex: 'hours',
      key: 'hours',
    },
    {
      title: '容量/已选',
      key: 'capacity',
      render: (_, record) => `${record.enrolledCount}/${record.capacity}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'volcano'}>
          {status === 'active' ? '进行中' : '已结束'}
        </Tag>
      ),
    },
    {
      title: '开课日期',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
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
            title="确定删除该课程吗？"
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

  return (
    <div className="courses-container">
      <Card
        title="课程管理"
        extra={
          <Space>
            <Input
              placeholder="搜索课程或教师"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              添加课程
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredCourses}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 创建/编辑课程模态框 */}
      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>

          <Form.Item
            name="teacherId"
            label="授课教师"
            rules={[{ required: true, message: '请选择授课教师' }]}
          >
            <Select placeholder="请选择授课教师">
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.subject})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="credits"
            label="学分"
            rules={[{ required: true, message: '请输入学分' }]}
          >
            <Select placeholder="请选择学分">
              {[1, 2, 3, 4, 5].map(credit => (
                <Option key={credit} value={credit}>
                  {credit} 学分
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hours"
            label="学时"
            rules={[{ required: true, message: '请输入学时' }]}
          >
            <Select placeholder="请选择学时">
              {[16, 32, 48, 64, 80, 96].map(hour => (
                <Option key={hour} value={hour}>
                  {hour} 学时
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="capacity"
            label="课程容量"
            rules={[{ required: true, message: '请输入课程容量' }]}
          >
            <Input type="number" placeholder="请输入课程容量" min={1} />
          </Form.Item>

          <Form.Item name="description" label="课程描述">
            <Input.TextArea placeholder="请输入课程描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CoursesPage; 