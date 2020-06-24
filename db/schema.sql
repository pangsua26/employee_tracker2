DROP DATABASE IF EXISTS employees_db;
CREATE database employees_db;

USE employees_db;

CREATE TABLE department (
id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INTEGER NOT NULL
);

CREATE TABLE employee (
id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
manager_id VARCHAR(30) DEFAULT "none"
);


