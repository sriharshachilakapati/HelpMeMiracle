const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const autoIncrement = require('mongoose-auto-increment');

// Load the environment variables
require('dotenv').config();

let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbName = process.env.DB_NAME;

let httpPort = process.env.port || 8080;

mongoose.Promise = global.Promise;

// Connect to the DB first using mongoose
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, mongooseErr =>
{
    if (mongooseErr)
        throw mongooseErr;

    autoIncrement.initialize(mongoose.connection);

    const authCheck = require('./apis/authCheck');
    const loginAPI = require('./apis/login');
    const registerAPI = require('./apis/register');
    const ticketAPI = require('./apis/ticket');
    const replyAPI = require('./apis/reply');
    const userAPI = require('./apis/user');

    // Create an HTTP server using Express
    let app = express();

    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ "extended": true }));
    app.use(express.static(path.join(__dirname, "public")));

    app.use((req, res, next) =>
    {
        if (req.originalUrl.includes("."))
            res.status(404).send();
        else
            next();
    });

    app.use('/users', userAPI);
    app.use('/login', loginAPI);
    app.use('/tickets', ticketAPI.openAPI);

    app.use(authCheck);

    app.use('/register', registerAPI);
    app.use('/tickets', ticketAPI.authAPI);
    app.use('/replies', replyAPI.authAPI);

    // Start the HTTP server
    app.listen(httpPort, expressErr =>
    {
        if (expressErr)
            throw expressErr;

        console.log(`Server is running on port ${httpPort}`);
    });
});
