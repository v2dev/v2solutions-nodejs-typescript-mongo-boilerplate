const express = require('express');
const auth = require('../services/authentication');
import { Request, Response } from 'express';

const {
    getEmployees,
    addEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeesById,
} = require('../controllers/EmployeeController');

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     GetEmployee:
 *       type: object
 *       required:
 *         - sortedColumn
 *         - limit
 *         - page
 *         - sort
 *         - filter
 *
 *       properties:
 *         sortedColumn:
 *           type: string
 *           description: Require column name on which sorting will be performed.
 *         limit:
 *           type: number
 *           description: limit the data
 *         page:
 *           type: number
 *           description: page number
 *         sort:
 *           type: string
 *           description: Provide 'asc' and 'desc'
 *         filter:
 *           type: string
 *           description: Pass value which need to searched.
 *       example:
 *           sortedColumn: name,
 *           limit: 5,
 *           page: 1,
 *           dob: 16/05/1981,
 *           sort: desc,
 *           filter: afsar,
 *
 *     AddEmployee:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - dob
 *         - designation
 *         - education
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the employee
 *         email:
 *           type: string
 *           description: email
 *         dob:
 *           type: string
 *           description: dob
 *         designation:
 *           type: string
 *           description: designation
 *         education:
 *           type: string
 *           description: education
 *       example:
 *         name: "Afsar"
 *         email: "afsar@gmail.com"
 *         dob: "20/05/1993"
 *         designation: "Software Engineer"
 *         education: "BE"
 */

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: CRUD Operation on Employees data
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Fetch all the employees list
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: limit the docs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Number of pages
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           description: It will filter bases on the name column.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Sorting - 'asc' or 'desc'
 *       - in: query
 *         name: sortedColumn
 *         schema:
 *           type: string
 *           description: Column name i.e email, dob, desgination...
 *     responses:
 *       200:
 *         description: It will display record based on the filter applied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetEmployee'
 *       500:
 *         description: Some server error
 */

router.get('/employees', getEmployees);
/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Get Employee by unique id.
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           required: true
 *           description: Id of the employee
 *     responses:
 *       200:
 *         description: Get employee data
 *         content:
 *           application/json:
 *       500:
 *         description: Some server error
 */

router.get('/employees/:id', getEmployeesById);

/**
 * @swagger
 * /employees:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Add New Employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddEmployee'
 *     responses:
 *       200:
 *         description: New Employee will be added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddEmployee'
 *       500:
 *         description: Some server error
 */

router.post('/employees', addEmployees);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     security:
 *       - Authorization: []
 *     summary: Update employee by unique id.
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddEmployee'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           required: true
 *           description: Id of the employee
 *     responses:
 *       200:
 *         description: Update employee data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddEmployee'
 *       500:
 *         description: Some server error
 */

router.put('/employees/:id', updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: Delete employee by unique id
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           required: true
 *           description: Id of the employee
 *     responses:
 *       200:
 *         description: Update employee data
 *         content:
 *           application/json:
 *       500:
 *         description: Some server error
 */

router.delete('/employees/:id', deleteEmployee);

module.exports = router;
