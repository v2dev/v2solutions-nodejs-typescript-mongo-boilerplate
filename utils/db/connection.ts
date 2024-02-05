/* eslint-disable no-undef */
require('dotenv').config();
const mongoose = require('mongoose');
export const logger1 = require('../../logger/bunyanLogger.ts').child({
    module: 'NodeJS boilerplate accelerator',
});

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        logger1.info('MongoDB connected Successfully');
    })
    .catch((err: any) => {
        logger1.error(err.message);
    });
