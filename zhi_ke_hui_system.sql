/*
 Navicat Premium Data Transfer

 Source Server         : 本地xs123456
 Source Server Type    : MySQL
 Source Server Version : 80034
 Source Host           : localhost:3306
 Source Schema         : zhi_ke_hui_system

 Target Server Type    : MySQL
 Target Server Version : 80034
 File Encoding         : 65001

 Date: 06/06/2025 22:32:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for classrooms
-- ----------------------------
DROP TABLE IF EXISTS `classrooms`;
CREATE TABLE `classrooms`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '教室名称',
  `building` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '所在建筑',
  `room_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '教室类型',
  `capacity` int NOT NULL DEFAULT 50 COMMENT '容量',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-可用 0-不可用',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of classrooms
-- ----------------------------
INSERT INTO `classrooms` VALUES (1, '教1-101', '第一教学楼', '多媒体教室', 100, 1, '2025-06-06 17:16:06.714976', '2025-06-06 17:16:06.714976', NULL);
INSERT INTO `classrooms` VALUES (2, '教2-305', '第二教学楼', '多媒体教室', 80, 1, '2025-06-06 17:16:06.714976', '2025-06-06 17:16:06.714976', NULL);
INSERT INTO `classrooms` VALUES (3, '实验楼-501', '实验楼', '计算机房', 60, 1, '2025-06-06 17:16:06.714976', '2025-06-06 17:16:06.714976', NULL);

-- ----------------------------
-- Table structure for course_categories
-- ----------------------------
DROP TABLE IF EXISTS `course_categories`;
CREATE TABLE `course_categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `parent_id` int NULL DEFAULT NULL COMMENT '上级分类ID',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-启用 0-禁用',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of course_categories
-- ----------------------------
INSERT INTO `course_categories` VALUES (1, '专业必修课', '学生必须修读的课程', NULL, 0, 1, '2025-06-06 17:16:06.709339', '2025-06-06 17:16:06.709339', NULL);
INSERT INTO `course_categories` VALUES (2, '专业选修课', '学生可以根据兴趣选择的专业课程', NULL, 0, 1, '2025-06-06 17:16:06.709339', '2025-06-06 17:16:06.709339', NULL);
INSERT INTO `course_categories` VALUES (3, '通识选修课', '面向全校学生开设的公共课程', NULL, 0, 1, '2025-06-06 17:16:06.709339', '2025-06-06 17:16:06.709339', NULL);

-- ----------------------------
-- Table structure for course_offerings
-- ----------------------------
DROP TABLE IF EXISTS `course_offerings`;
CREATE TABLE `course_offerings`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL COMMENT '关联课程ID',
  `teacher_id` int NOT NULL COMMENT '授课教师ID',
  `term_id` int NOT NULL COMMENT '所属学期ID',
  `class_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '教学班代码，唯一标识',
  `max_students` int NOT NULL DEFAULT 50 COMMENT '最大学生数',
  `current_students` int NOT NULL DEFAULT 0 COMMENT '当前学生数',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'open' COMMENT '状态：open-开放选课, closed-关闭选课, in_progress-进行中, completed-已结课, cancelled-已取消',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_class_code`(`class_code` ASC) USING BTREE,
  INDEX `fk_offering_course`(`course_id` ASC) USING BTREE,
  INDEX `fk_offering_teacher`(`teacher_id` ASC) USING BTREE,
  INDEX `fk_offering_term`(`term_id` ASC) USING BTREE,
  CONSTRAINT `fk_offering_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_offering_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_offering_term` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '课程开设表，核心业务表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of course_offerings
-- ----------------------------
INSERT INTO `course_offerings` VALUES (1, 1, 1, 1, 'CS101-24A', 80, 0, 'open', NULL, '2025-06-06 17:16:06.726710', '2025-06-06 17:16:06.726710', NULL);
INSERT INTO `course_offerings` VALUES (2, 2, 1, 1, 'CS102-24A', 80, 0, 'open', NULL, '2025-06-06 17:16:06.726710', '2025-06-06 17:16:06.726710', NULL);
INSERT INTO `course_offerings` VALUES (3, 3, 2, 1, 'FL201-24A', 50, 0, 'open', NULL, '2025-06-06 17:16:06.726710', '2025-06-06 17:16:06.726710', NULL);
INSERT INTO `course_offerings` VALUES (4, 5, 2, 1, 'ART001-24A', 100, 0, 'open', NULL, '2025-06-06 17:16:06.726710', '2025-06-06 17:16:06.726710', NULL);

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '课程代码',
  `department_id` int NULL DEFAULT NULL COMMENT '开课学院',
  `category_id` int NULL DEFAULT NULL COMMENT '课程分类',
  `credit` decimal(3, 1) NOT NULL DEFAULT 2.0 COMMENT '学分',
  `hours` int NOT NULL DEFAULT 32 COMMENT '学时',
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-启用 0-禁用',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_course_code`(`code` ASC) USING BTREE,
  INDEX `fk_course_department`(`department_id` ASC) USING BTREE,
  INDEX `fk_course_category`(`category_id` ASC) USING BTREE,
  CONSTRAINT `fk_course_category` FOREIGN KEY (`category_id`) REFERENCES `course_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES (1, '数据库系统原理', 'CS101', 1, 1, 3.0, 48, NULL, NULL, 1, '2025-06-06 17:16:06.712151', '2025-06-06 17:16:06.712151', NULL);
INSERT INTO `courses` VALUES (2, '计算机网络', 'CS102', 1, 1, 3.0, 48, NULL, NULL, 1, '2025-06-06 17:16:06.712151', '2025-06-06 17:16:06.712151', NULL);
INSERT INTO `courses` VALUES (3, '高级英语听说', 'FL201', 2, 1, 2.0, 32, NULL, NULL, 1, '2025-06-06 17:16:06.712151', '2025-06-06 17:16:06.712151', NULL);
INSERT INTO `courses` VALUES (4, '西方经济学', 'ECO301', 3, 2, 2.0, 32, NULL, NULL, 1, '2025-06-06 17:16:06.712151', '2025-06-06 17:16:06.712151', NULL);
INSERT INTO `courses` VALUES (5, '音乐鉴赏', 'ART001', NULL, 3, 1.0, 16, NULL, NULL, 1, '2025-06-06 17:16:06.712151', '2025-06-06 17:16:06.712151', NULL);

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dept_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '部门代码',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-启用 0-禁用',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_dept_code`(`dept_code` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES (1, '计算机科学与技术学院', 'CS', NULL, 1, '2025-06-06 17:16:06.704006', '2025-06-06 17:16:06.704006', NULL);
INSERT INTO `departments` VALUES (2, '外国语学院', 'FL', NULL, 1, '2025-06-06 17:16:06.704006', '2025-06-06 17:16:06.704006', NULL);
INSERT INTO `departments` VALUES (3, '经济管理学院', 'SEM', NULL, 1, '2025-06-06 17:16:06.704006', '2025-06-06 17:16:06.704006', NULL);

-- ----------------------------
-- Table structure for enrollments
-- ----------------------------
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL COMMENT '学生ID',
  `offering_id` int NOT NULL COMMENT '课程开设ID',
  `score` decimal(5, 2) NULL DEFAULT NULL COMMENT '总成绩',
  `grade` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '等级成绩 A/B/C/D/F',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-选课中 2-已完成 3-已退课',
  `selected_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '选课时间',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_student_offering`(`student_id` ASC, `offering_id` ASC) USING BTREE COMMENT '一个学生只能选同一门开设课程一次',
  INDEX `fk_enrollment_offering`(`offering_id` ASC) USING BTREE,
  CONSTRAINT `fk_enrollment_offering` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '学生选课记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of enrollments
-- ----------------------------
INSERT INTO `enrollments` VALUES (1, 1, 1, 92.00, 'A', 2, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');
INSERT INTO `enrollments` VALUES (2, 1, 2, NULL, NULL, 1, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');
INSERT INTO `enrollments` VALUES (3, 1, 4, 88.00, 'B', 2, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');
INSERT INTO `enrollments` VALUES (4, 2, 1, 85.00, 'B', 2, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');
INSERT INTO `enrollments` VALUES (5, 2, 2, NULL, NULL, 1, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');
INSERT INTO `enrollments` VALUES (6, 3, 3, 95.00, 'A', 2, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');
INSERT INTO `enrollments` VALUES (7, 3, 4, NULL, NULL, 3, '2025-06-06 17:16:06', '2025-06-06 17:16:06.732869', '2025-06-06 17:16:06.732869');

-- ----------------------------
-- Table structure for majors
-- ----------------------------
DROP TABLE IF EXISTS `majors`;
CREATE TABLE `majors`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `major_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '专业名称',
  `major_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '专业代码',
  `department_id` int NOT NULL COMMENT '所属学院ID',
  `duration` tinyint NULL DEFAULT 4 COMMENT '学制年数',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：1-启用，0-停用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_major_code`(`major_code` ASC) USING BTREE,
  INDEX `fk_major_department`(`department_id` ASC) USING BTREE,
  CONSTRAINT `fk_major_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of majors
-- ----------------------------
INSERT INTO `majors` VALUES (1, '软件工程', 'SE', 1, 4, 1, '2025-06-06 17:16:06');
INSERT INTO `majors` VALUES (2, '网络工程', 'NE', 1, 4, 1, '2025-06-06 17:16:06');
INSERT INTO `majors` VALUES (3, '英语', 'ENG', 2, 4, 1, '2025-06-06 17:16:06');
INSERT INTO `majors` VALUES (4, '工商管理', 'BA', 3, 4, 1, '2025-06-06 17:16:06');

-- ----------------------------
-- Table structure for menus
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NULL DEFAULT NULL COMMENT '父菜单ID，NULL为一级菜单',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '菜单名称',
  `path` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '前端路由',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图标',
  `sort_order` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-显示 0-隐藏',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES (1, NULL, '仪表盘', '/dashboard', 'dashboard', 0, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (100, NULL, '系统管理', '/system', 'system', 100, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (101, 100, '用户管理', '/system/users', 'user', 101, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (102, 100, '角色管理', '/system/roles', 'role', 102, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (103, 100, '菜单管理', '/system/menus', 'menu', 103, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (200, NULL, '教学管理', '/education', 'education', 200, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (201, 200, '院系管理', '/education/departments', 'dept', 201, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (202, 200, '专业管理', '/education/majors', 'major', 202, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (203, 200, '课程管理', '/education/courses', 'course', 203, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (204, 200, '开课管理', '/education/offerings', 'offering', 204, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);
INSERT INTO `menus` VALUES (300, NULL, '我的课程', '/my-courses', 'my-course', 300, 1, '2025-06-06 17:16:06.735738', '2025-06-06 17:16:06.735738', NULL);

-- ----------------------------
-- Table structure for role_menus
-- ----------------------------
DROP TABLE IF EXISTS `role_menus`;
CREATE TABLE `role_menus`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_role_menu`(`role_id` ASC, `menu_id` ASC) USING BTREE,
  INDEX `fk_rolemenus_menu`(`menu_id` ASC) USING BTREE,
  CONSTRAINT `fk_rolemenus_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rolemenus_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_menus
-- ----------------------------
INSERT INTO `role_menus` VALUES (1, 1, 1, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (2, 1, 100, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (3, 1, 101, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (4, 1, 102, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (5, 1, 103, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (6, 1, 200, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (7, 1, 201, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (8, 1, 202, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (9, 1, 203, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (10, 1, 204, '2025-06-06 17:16:06.738722', '2025-06-06 17:16:06.738722');
INSERT INTO `role_menus` VALUES (11, 2, 1, '2025-06-06 17:16:06.741480', '2025-06-06 17:16:06.741480');
INSERT INTO `role_menus` VALUES (12, 2, 200, '2025-06-06 17:16:06.741480', '2025-06-06 17:16:06.741480');
INSERT INTO `role_menus` VALUES (13, 2, 203, '2025-06-06 17:16:06.741480', '2025-06-06 17:16:06.741480');
INSERT INTO `role_menus` VALUES (14, 2, 204, '2025-06-06 17:16:06.741480', '2025-06-06 17:16:06.741480');
INSERT INTO `role_menus` VALUES (15, 2, 300, '2025-06-06 17:16:06.741480', '2025-06-06 17:16:06.741480');
INSERT INTO `role_menus` VALUES (16, 3, 1, '2025-06-06 17:16:06.742833', '2025-06-06 17:16:06.742833');
INSERT INTO `role_menus` VALUES (17, 3, 300, '2025-06-06 17:16:06.742833', '2025-06-06 17:16:06.742833');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色标识, e.g., admin, teacher, student',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-启用 0-禁用',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_role_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '123', '系统管理员', 1, '2025-06-06 17:16:06.698234', '2025-06-06 22:28:53.119108', NULL);
INSERT INTO `roles` VALUES (2, 'teacher', '教师', 1, '2025-06-06 17:16:06.698234', '2025-06-06 17:16:06.698234', NULL);
INSERT INTO `roles` VALUES (3, 'student', '学生', 1, '2025-06-06 17:16:06.698234', '2025-06-06 17:16:06.698234', NULL);

-- ----------------------------
-- Table structure for schedules
-- ----------------------------
DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `offering_id` int NOT NULL COMMENT '课程开设ID',
  `classroom_id` int NOT NULL COMMENT '教室ID',
  `day_of_week` tinyint NOT NULL COMMENT '星期几 (1-7, 1代表周一)',
  `start_time` time NOT NULL COMMENT '开始时间',
  `end_time` time NOT NULL COMMENT '结束时间',
  `weeks` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '上课周次, 如 \"1-16\" 或 \"1,3,5-9\"',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_schedule_offering`(`offering_id` ASC) USING BTREE,
  INDEX `fk_schedule_classroom`(`classroom_id` ASC) USING BTREE,
  CONSTRAINT `fk_schedule_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_offering` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of schedules
-- ----------------------------
INSERT INTO `schedules` VALUES (1, 1, 1, 1, '08:00:00', '09:40:00', '1-16', '2025-06-06 17:16:06.729916', '2025-06-06 17:16:06.729916', NULL);
INSERT INTO `schedules` VALUES (2, 1, 3, 3, '14:00:00', '15:40:00', '1-8', '2025-06-06 17:16:06.729916', '2025-06-06 17:16:06.729916', NULL);
INSERT INTO `schedules` VALUES (3, 2, 2, 2, '10:00:00', '11:40:00', '1-16', '2025-06-06 17:16:06.729916', '2025-06-06 17:16:06.729916', NULL);
INSERT INTO `schedules` VALUES (4, 3, 2, 4, '16:00:00', '17:40:00', '1-16', '2025-06-06 17:16:06.729916', '2025-06-06 17:16:06.729916', NULL);
INSERT INTO `schedules` VALUES (5, 4, 1, 5, '19:00:00', '20:40:00', '3-10', '2025-06-06 17:16:06.729916', '2025-06-06 17:16:06.729916', NULL);

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `student_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '学号',
  `department_id` int NULL DEFAULT NULL COMMENT '所属学院ID',
  `major_id` int NULL DEFAULT NULL COMMENT '所属专业ID',
  `grade` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '年级',
  `enrollment_date` date NULL DEFAULT NULL COMMENT '入学日期',
  `graduation_date` date NULL DEFAULT NULL COMMENT '毕业日期',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-在读 2-毕业 3-休学 0-退学',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_student_no`(`student_no` ASC) USING BTREE,
  UNIQUE INDEX `UNIQ_student_user_id`(`user_id` ASC) USING BTREE,
  INDEX `fk_student_department`(`department_id` ASC) USING BTREE,
  INDEX `fk_student_major`(`major_id` ASC) USING BTREE,
  CONSTRAINT `fk_student_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_student_major` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (1, 4, 'S2023001', 1, 1, '2023级', NULL, NULL, 1, '2025-06-06 17:16:06.723528', '2025-06-06 17:16:06.723528', NULL);
INSERT INTO `students` VALUES (2, 5, 'S2023002', 1, 2, '2023级', NULL, NULL, 1, '2025-06-06 17:16:06.723528', '2025-06-06 17:16:06.723528', NULL);
INSERT INTO `students` VALUES (3, 6, 'S2022001', 2, 3, '2022级', NULL, NULL, 1, '2025-06-06 17:16:06.723528', '2025-06-06 17:16:06.723528', NULL);

-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `teacher_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '工号',
  `department_id` int NULL DEFAULT NULL COMMENT '所属部门',
  `title` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '职称',
  `hire_date` date NULL DEFAULT NULL COMMENT '入职日期',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_teacher_no`(`teacher_no` ASC) USING BTREE,
  UNIQUE INDEX `UNIQ_teacher_user_id`(`user_id` ASC) USING BTREE,
  INDEX `fk_teacher_department`(`department_id` ASC) USING BTREE,
  CONSTRAINT `fk_teacher_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of teachers
-- ----------------------------
INSERT INTO `teachers` VALUES (1, 2, 'T2024001', 1, '教授', NULL, '2025-06-06 17:16:06.720383', '2025-06-06 17:16:06.720383', NULL);
INSERT INTO `teachers` VALUES (2, 3, 'T2024002', 2, '副教授', NULL, '2025-06-06 17:16:06.720383', '2025-06-06 17:16:06.720383', NULL);

-- ----------------------------
-- Table structure for terms
-- ----------------------------
DROP TABLE IF EXISTS `terms`;
CREATE TABLE `terms`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `term_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '学期名称, 如：2024-2025学年第一学期',
  `start_date` date NOT NULL COMMENT '开始日期',
  `end_date` date NOT NULL COMMENT '结束日期',
  `is_current` tinyint NOT NULL DEFAULT 0 COMMENT '是否当前学期 1-是 0-否',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UNIQ_term_name`(`term_name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of terms
-- ----------------------------
INSERT INTO `terms` VALUES (1, '2024-2025学年第一学期', '2024-09-01', '2025-01-15', 1, '2025-06-06 17:16:06.717725', '2025-06-06 17:16:06.717725', NULL);
INSERT INTO `terms` VALUES (2, '2024-2025学年第二学期', '2025-02-10', '2025-06-30', 0, '2025-06-06 17:16:06.717725', '2025-06-06 17:16:06.717725', NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1-正常 0-禁用',
  `last_login_at` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `IDX_email`(`email` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '123', '$2b$10$uwnQATFr7xUu1SsywKMSj.Pwgg3ewAUZShZhy0eVmbQDrHwDsIjv2', '123', '13222321232', '123@163.com', '/uploads/bae51a4a-dbc4-4eab-b1dd-467a2e25e18d-zzx.jpg', 1, NULL, '2025-06-06 21:49:56.991790', '2025-06-06 22:29:45.378562', NULL);
INSERT INTO `users` VALUES (2, 'teacher001', 'e10adc3949ba59abbe56e057f20f883e', '张三', NULL, 'zhangsan@zhikehui.com', NULL, 1, NULL, '2025-06-06 17:16:06.701035', '2025-06-06 17:16:06.701035', NULL);
INSERT INTO `users` VALUES (3, 'teacher002', 'e10adc3949ba59abbe56e057f20f883e', '李四', NULL, 'lisi@zhikehui.com', NULL, 1, NULL, '2025-06-06 17:16:06.701035', '2025-06-06 17:16:06.701035', NULL);
INSERT INTO `users` VALUES (4, 'student001', 'e10adc3949ba59abbe56e057f20f883e', '王五', NULL, 'wangwu@zhikehui.com', NULL, 1, NULL, '2025-06-06 17:16:06.701035', '2025-06-06 17:16:06.701035', NULL);
INSERT INTO `users` VALUES (5, 'student002', 'e10adc3949ba59abbe56e057f20f883e', '赵六', NULL, 'zhaoliu@zhikehui.com', NULL, 1, NULL, '2025-06-06 17:16:06.701035', '2025-06-06 17:16:06.701035', NULL);
INSERT INTO `users` VALUES (6, 'student003', 'e10adc3949ba59abbe56e057f20f883e', '孙七', NULL, 'sunqi@zhikehui.com', NULL, 1, NULL, '2025-06-06 17:16:06.701035', '2025-06-06 17:16:06.701035', NULL);

SET FOREIGN_KEY_CHECKS = 1;
