-- 创建用户
CREATE USER 'ts'@'%' IDENTIFIED BY 'typescript';

-- 授权
GRANT ALL PRIVILEGES ON *.* TO 'ts'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 建表
CREATE DATABASE employee_system;

USE employee_system;

CREATE TABLE `level` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `level` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `level` (`level`)
VALUES
  ('1级'),
  ('2级'),
  ('3级'),
  ('4级'),
  ('5级');

CREATE TABLE `department` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `department` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `department` (`department`)
VALUES
  ('技术部'),
  ('产品部'),
  ('市场部'),
  ('运营部');

CREATE TABLE `employee` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `departmentId` int(10) DEFAULT NULL,
  `hiredate` varchar(10) DEFAULT NULL,
  `levelId` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `employee` (`name`, `departmentId`, `hiredate`, `levelId`)
VALUES
  ('小赵', 5, '2015-07-01', 5),
  ('小钱', 4, '2016-07-01', 4),
  ('小孙', 3, '2017-07-01', 3),
  ('小李', 2, '2018-07-01', 2),
  ('小周', 1, '2019-07-01', 1);

-- 查询所有
SELECT employee.*, level.level, department.department
FROM employee, level, department
WHERE employee.levelId = level.id AND employee.departmentId = department.id;