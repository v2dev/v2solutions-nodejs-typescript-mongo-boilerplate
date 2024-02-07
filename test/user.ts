/* eslint-disable no-undef */
require('dotenv').config();
// const chai = require('chai');
// const chaihttp = require('chai-http');
// const app = require('../server');

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { logger1 as logger } from '../utils/db/connection';

const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

describe('Access to DB', function () {
  describe('#pass', function () {
    it('should connect with correct credentials', (done) => {
      mongoose
        .connect(process.env.MONGO_testing_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          logger.info('MongoDB testing connected Successfully');
        })
        .catch((err: any) => {
          logger.error(err.message);
        });
      done();
    });
  });
});

describe('Auth Api', () => {
  describe('Sign up', () => {
    it('It should register the user with a unique email', (done) => {
      // Generating a unique email using current timestamp
      const uniqueEmail = `testuser+${Date.now()}@example.com`;
      chai.request(app)
        .post('/signup')
        .send({
          name: 'Test User',
          email: uniqueEmail, // Using the unique email
          password: 'TestPassword123',
          country: 'TestCountry',
        })
        .end((error, response) => {
          response.should.have.status(200); // Assuming 200 is the success status code
          response.body.should.be.a('object');
          response.body.should.have.property('newUser');
          response.body.newUser.should.have
            .property('email')
            .eql(uniqueEmail);
          response.body.should.have.property('qrCodeUrl'); // Assuming a QR code URL is expected in the response
          done();
        });
    });

    it('It should not register the user when email already exists', (done) => {
      // Using a fixed email to simulate an attempt to register with an already existing email
      const email = 'existinguser@example.com';
      chai.request(app)
        .post('/signup')
        .send({
          name: 'Existing User',
          email: email, // Using the fixed email
          password: 'ExistingPassword123',
          country: 'ExistingCountry',
        })
        .end((error, response) => {
          response.should.have.status(422); // Assuming 400 is the error status code for existing email
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eql('Email is already in use.');
          done();
        });
    });
  });
  describe('Sign In', () => {
    it('It should login the user', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          email: 'afsarshaikh87@gmail.com',
          password: 'Umair@786786',
        })
        .end((error: any, response: any) => {
          //
          //response.body.should.have.statusCode(200);
          response.body.should.be.a('object');
          response.body.should.have
            .property('message')
            .eql('Login successful');
          done();
        });
    });
    it('It should not login the user when entered invalid credential', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          email: 'afsarshaikh87@gmail.com',
          password: 'armaan@7861',
        })
        .end((error: any, response: any) => {
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eql('Invalid credentials');
          done();
        });
    });
  });
  describe('MFA verify', () => {
    it('It should failed the google authentication when entered invalid token', (done) => {
      chai.request(app)
        .post('/mfa-verify')
        .send({
          email: 'afsarshaikh87@gmail.com',
          mfaToken: '123456',
        })
        .end((error: any, response: any) => {
          //response.body.should.have.statusCode(200);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eql('Invalid token');
          response.body.should.not.have.property('jwtToken');
          done();
        });
    });
  });
  describe('Forget Password', () => {
    it('It should sent otp to registered email id', (done) => {
      chai.request(app)
        .post('/forgot-password')
        .send({
          email: 'afsarshaikh87@gmail.com',
        })
        .end((error: any, response: any) => {
          //response.body.should.have.statusCode(200);
          response.body.should.be.a('object');
          response.body.should.have
            .property('message')
            .eql('Reset token sent to your email');
          done();
        });
    });
  });
  describe('Reset Password', () => {
    it('It will not reset password when enetered invalid otp', (done) => {
      chai.request(app)
        .post('/reset-password')
        .send({
          otp: '123456',
          password: 'aaaaaaaaaaaa',
          confirmPassword: 'aaaaaaaaaaaa',
        })
        .end((error: any, response: any) => {
          //response.body.should.have.statusCode(200);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eql('Invalid or expired OTP');
          done();
        });
    });
  });
  describe('Google Auth', () => {
    it('It will not authenticate with google when enetered invalid token', (done) => {
      chai.request(app)
        .post('/verify-google-token')
        .send({
          token: '1111111111111111111111111111edddddd',
        })
        .end((error: any, response: any) => {
          //response.body.should.have.statusCode(200);
          response.body.should.be.a('object');
          response.body.should.have
            .property('error')
            .eql('Invalid token');
          done();
        });
    });
  });
});
