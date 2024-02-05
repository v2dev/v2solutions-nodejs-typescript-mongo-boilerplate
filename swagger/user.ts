require('dotenv').config();
const express = require('express');
import { Router } from 'express';

const {
    loginUser,
    registerUser,
    mfaVerifyUser,
    forgetUser,
    resetUser,
    validateEmail,
    verifyGoogleToken,
} = require('../controllers/AuthController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the employee
 *         email:
 *           type: string
 *           description: The email of the employee
 *         password:
 *           type: string
 *           description: password
 *         country:
 *           type: string
 *           description: country name
 *       example:
 *         name: Afsar
 *         email: afsar@gmail.com
 *         password: "12345"
 *         country: India
 *
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the employee
 *         password:
 *           type: string
 *           description: password
 *       example:
 *         email: afsar@gmail.com
 *         password: "12345"
 *
 *
 *     Mfaverify:
 *       type: object
 *       required:
 *         - email
 *         - mfaToken
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the employee
 *         mfaToken:
 *           type: string
 *           description: Toekn generated by google authenticator app
 *       example:
 *         email: afsar@gmail.com
 *         mfaToken: "123456"
 *
 *     Forget:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the employee
 *       example:
 *         email: afsar@gmail.com
 *
 *     Reset:
 *       type: object
 *       required:
 *         - otp
 *         - token
 *         - password
 *         - confirmPassword
 *       properties:
 *         token:
 *           type: integer
 *           description: token send to registered email id.
 *         otp:
 *           type: integer
 *           description: 6 digit otp sent to email
 *         password:
 *           required: true
 *           type: string
 *           description: new password
 *         confirmPassword:
 *           required: true
 *           type: string
 *           description: confirm password
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmc2Fyc2hhaWtoODdAZ21haWwuY29tIiwiaWQiOiI2NTU1ZGY0YjIyMTM0YTk2ZDU3N2ZjM2EiLCJpYXQiOjE3MDEwNzgwMjQsImV4cCI6MTcwMTA3ODMyNH0.2BiVsPLoe9IZHv-QeCNBP8HhC8rJg8U1TR6J4420Cx8111"
 *         otp: "123456"
 *         password: "1234567890"
 *         confirmPassword: "1234567890"
 *
 *     Google:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: integer
 *           description: token send to registered email id.
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI"
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registaration of user
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: The User will redirect to google auth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 */
router.post('/signup', registerUser);

router.post('/validateEmail', validateEmail);

/**
 * @swagger
 * /mfa-verify:
 *   post:
 *     summary: Authenticate user by google authenticator app
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mfaverify'
 *     responses:
 *       200:
 *         description: The User will redirect to google auth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mfaverify'
 *       500:
 *         description: Some server error
 */

router.post('/mfa-verify', mfaVerifyUser);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: To send OTP and reset link to registered email id.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Forget'
 *     responses:
 *       200:
 *         description: It will send OTP to registered email id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forget'
 *       500:
 *         description: Some server error
 */

router.post('/forgot-password', forgetUser);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: To verify OTP and Token recieved from user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reset'
 *     responses:
 *       200:
 *         description: To reset password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reset'
 *       500:
 *         description: Some server error
 */

router.post('/reset-password', resetUser);

/**
 * @swagger
 * /verify-google-token:
 *   post:
 *     summary: login from google auth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Google'
 *     responses:
 *       200:
 *         description: To verfiy from google auth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Google'
 *       500:
 *         description: Some server error
 */

router.post('/verify-google-token', verifyGoogleToken);

module.exports = router;
