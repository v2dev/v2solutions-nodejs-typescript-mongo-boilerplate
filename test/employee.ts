/* eslint-disable no-undef */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.should();
chai.use(chaiHttp);

let id: string;
// please enter JWT token here.
let token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmc2Fyc2hhaWtoODdAZ21haWwuY29tIiwiaWF0IjoxNzAxODQ1NDk4LCJleHAiOjE3MDE4NDY2OTh9.kNqf3C9UB6nEakk48Oeb2ZhHv-nfmIcA9_ZD9Xd6lOw';

describe('Employee Crud', () => {
    describe('Add Employee', () => {
        it('Add new employee', (done) => {
            chai.request(app)
                .post('/employees')
                .set('Authorization', token)
                .send({
                    name: 'Afsar Shaikh',
                    email: 'afsar@gmail.com',
                    dob: '1994-08-09',
                    designation: 'Senior Software Engineer',
                    education: 'BE',
                })
                .end((error: any, response: any) => {
                    id = response.body.newEmployee
                        ? response.body.newEmployee._id
                        : null;

                    // Update the assertion in the 'Add new employee' test case
                    response.body.should.be.a('object');
                    response.body.should.have
                        .property('error')
                        .eql('Email is already in use.');
                    done();
                });
        });
    });
    describe('Get Employee', () => {
        it('fetch all employee list', (done) => {
            chai.request(app)
                .get('/employees')
                .set('Authorization', token)
                .end((error: any, response: any) => {
                    response.body.should.be.an('array');
                    response.body.forEach((employee: any) => {
                        employee.should.be.a('object');
                        employee.should.have.property('_id');
                        employee.should.have.property('name');
                        employee.should.have.property('email');
                        employee.should.have.property('dob');
                        employee.should.have.property('designation');
                        employee.should.have.property('education');
                    });
                    done();
                });
        });
    });
    describe('Update Employee', () => {
        it('Update employee data', (done) => {
            chai.request(app)
                .put(`/employees/${id}`)
                .set('Authorization', token)
                .send({
                    name: 'Afsar Shaikh 111',
                })
                .end((error: any, response: any) => {
                    response.body.should.be.a('object');
                    response.body.should.have
                        .property('message')
                        .eql('Something went wrong');
                    done();
                });
        });
    });
    it('delete employee by id', (done) => {
        chai.request(app)
            .delete(`/employees/${id}`)
            .set('Authorization', token)
            .end((error: any, response: any) => {
                if (response.body.error) {
                    response.body.should.be.a('object');
                    response.body.should.have.property('error');
                } else {
                    response.body.should.be.a('object');
                    response.body.should.have
                        .property('message')
                        .eql(`Employee deleted successfully for id - ${id}`);
                }
                done();
            });
    });
});
