import { Request, Response } from 'express';
import { StatusCode } from '../utils/constant';
import {
    addData,
    getData,
    updateData,
    deleteData,
    getDataById,
} from '../utils/wrapper/collections';
import { EmployeeModel } from '../model/Employee';

const getEmployeesById = async (req: Request, res: Response) => {
    const data = await getDataById(EmployeeModel, req, res);
    res.status(StatusCode.success).json({ data });
};

const getEmployees = async (req: Request, res: Response) => {
    let { data, page, totalPages, totalRecords, sortedColumn, sortDirection } =
        await getData(EmployeeModel, req, res);

    if (req.query.page && req.query.limit) {
        res.status(StatusCode.success).json({
            data,
            page,
            totalPages,
            totalRecords,
            sortedColumn,
            sortDirection,
        });
    }
};

const addEmployees = async (req: Request, res: Response) => {
    const newRecords = await addData(EmployeeModel, req, res);
    return res.status(200).json({
        message: 'Employee added successfully',
        newRecords: newRecords,
    });
};

const updateEmployee = async (req: Request, res: Response) => {
    try {
        const updatedList = await updateData(EmployeeModel, req, res);
        res.status(StatusCode.success).json({
            message: 'Updated Successfully',
            updatedList: updatedList,
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(StatusCode.internal_server).json({
            error: 'Failed to update employee',
        });
    }
};

const deleteEmployee = async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    await deleteData(EmployeeModel, req, res);
    return res.status(StatusCode.success).json({
        employeeId: employeeId,
    });
};

export {
    getEmployeesById,
    getEmployees,
    addEmployees,
    updateEmployee,
    deleteEmployee,
};
