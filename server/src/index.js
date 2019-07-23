require('dotenv').config({path: 'variables.env'});

const createServer = require('./createServer');
const db = require('./db');

const serevr = createServer();



serevr.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, info => {
    console.log(`Server is running on port ${info.port}`);
});