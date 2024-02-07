import { Response } from 'express';
import { StatusCode } from '../constant';

const addData = async (
  schemaName: any,
  req: any,
  res: Response,
): Promise<any> => {
  try {
    const { email, name, dob, designation, education } = req.body;
    console.log(name);
    if (!email || !name || !dob || !designation || !education) {
      res.status(StatusCode.unprocess).json({
        error: 'Please provide all the details to add a new employee',
      });
    }
    const user = await schemaName.findOne({ email });
    if (user) {
      res.status(StatusCode.unprocess).json({
        error: 'Email is already in use.',
      });
    }

    const newRecords = new schemaName(req.body);

    await newRecords.save();

    console.log(newRecords);

    return newRecords;
  } catch (error) {
    console.error('Error creating a new employee:', error);
    res.status(StatusCode.internal_server).json({
      error: 'Failed to create a new employee',
    });
  }
};

const getData = async (
  schemaName: any,
  req: any,
  res: Response,
): Promise<any> => {
  try {
    let { page, limit, sort, filter, sortedColumn } = req.query;
    if (!page && !limit) {
      const data = await schemaName.find();
      return res.status(StatusCode.success).json(data);
    }
    page = parseInt(page);
    limit = parseInt(limit);
    let offset = (page - 1) * limit;
    const query: any = {};
    const sortOption: any = {};

    // Implement the filter based on the 'filter' query parameter
    if (filter) {
      query.name = { $regex: new RegExp(filter, 'i') };
      offset = 0;
      // You can extend this based on your specific filter criteria
    }

    if (!sortedColumn) {
      sortedColumn = 'name'; // Default column to sort
    }

    let sortDirection = 1; // Default sort direction (ascending)

    if (sort) {
      sortDirection = sort == 'desc' ? -1 : 1;
    }

    sortOption[sortedColumn] = sortDirection;

    const totalRecords = await schemaName.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await schemaName
      .find(query)
      .collation({ locale: 'en' })
      .sort(sortOption)
      .limit(limit)
      .skip(offset);

    const result = {
      data,
      page,
      totalPages,
      totalRecords,
      sortedColumn,
      sortDirection,
    };
    return res.status(StatusCode.success).json(result);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(StatusCode.internal_server).json({
      error: 'Failed to fetch employees',
    });
  }
};

const updateData = async (
  schemaName: any,
  req: any,
  res: Response,
): Promise<any> => {
  try {
    const employeeId = req.params.id;
    const updatedData = req.body;
    const updatedList = await schemaName.findByIdAndUpdate(
      employeeId,
      updatedData,
      {
        new: true,
      },
    );
    if (updatedList) {
      return updatedList;
    } else {
      return res.status(StatusCode.internal_server).json({
        error: 'Employee not found',
      });
    }
  } catch (error) {
    return res.status(StatusCode.internal_server).json({
      message: 'Something went wrong',
    });
  }
};

const deleteData = async (
  schemaName: any,
  req: any,
  res: Response,
): Promise<any> => {
  try {
    const employeeId = req.params.id;
    const result = await schemaName.findByIdAndDelete(employeeId);
    if (result) {
      return result;
    } else {
      return res
        .status(StatusCode.unprocess)
        .json({ error: 'Employee not found' });
    }
  } catch (error) {
    return res.status(StatusCode.internal_server).json({
      error: 'Failed to delete an employee',
    });
  }
};

const getDataById = async (
  schemaName: any,
  req: any,
  res: Response,
): Promise<any> => {
  try {
    const employeeId = req.params.id;
    const data = await schemaName.findById(employeeId);
    console.log(data);
    if (!data) {
      return res
        .status(StatusCode.unprocess)
        .json({ error: 'Id not found' });
    }
    return res.status(StatusCode.success).json(data);
    if (!data) {
      return res
        .status(StatusCode.unprocess)
        .json({ error: 'Id not found' });
    }
    return res.status(StatusCode.success).json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    return res.status(StatusCode.internal_server).json({
      error: 'Failed to fetch data',
    });
  }
};

export { addData, getData, updateData, deleteData, getDataById };
