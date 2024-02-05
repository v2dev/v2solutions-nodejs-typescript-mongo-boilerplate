import bunyan from 'bunyan';
import moment from 'moment';

const env = process.env.NODE_ENV || 'development';

interface CustomRequest {
    functionName?: string;
    API_URL?: string;
    requestObj?: string;
    response?: string;
}

const loglevels = {
    ERROR: 50,
    WARN: 40,
    INFO: 30,
    VERBOSE: 20,
    DEBUG: 10,
    SILLY: 5,
};

function Ec_Service_call(req: CustomRequest) {
    return {
        v2_function: req.functionName || 'V2BackEnd',
        ex_api_url: req.API_URL || '',
        ex_api_payload: req.requestObj || '',
        ex_api_response: req.response || '',
        log_time: moment().format('MMMM Do YYYY  h:mm:ss a'),
    };
}

const logger = bunyan.createLogger({
    name: 'Backend',
    application: 'log',
    app_env: env,
    serializers: {
        Ex_serviceErr_call: Ec_Service_call,
    },
    streams: [
        {
            stream: process.stdout,
            level: 'debug',
        },
        {
            stream: process.stdout,
            level: 'warn',
        },
        {
            stream: process.stdout,
            level: 'error',
        },
        {
            stream: process.stdout,
            level: 'info',
        },
    ],
});

module.exports = logger;
