import express, { Request, Response, NextFunction } from 'express';

require('dotenv').config();
const logger = require('./logger/bunyanLogger.ts').child({
    module: 'NodeJS boilerplate accelerator',
});

const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');

const UserRoute = require('./swagger/user');
const EmployeeRoute = require('./swagger/employee');

// eslint-disable-next-line no-unused-vars
const connection = require('./utils/db/connection');

// Define a custom error class
class AppError extends Error {
    status?: string;
    statusCode?: number;

    constructor(message: string, statusCode: number, status: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
    }
}

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'V2Solutions Nodejs BolierPlate',
            version: '1.0.0',
            description:
                'Server with SignIn and Sign Up and CRUD Operation on employee table',
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: 'Bearer <JWT token here>',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./swagger/*.js'],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use(morgan('dev'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(UserRoute);
app.use(EmployeeRoute);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new AppError(`can't find ${req.originalUrl} on the server!`, 404, 'fail');
    next(err);
});

app.use((error: any, req: Request, res: Response) => {
    // Handle the custom error class
    res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
    });
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info('Server Connected', PORT);
});


// Add this at the end of your server.ts file
// module.exports = app; // For CommonJS
// or
export default app; // For ES Modules, if you're using ES6+ syntax