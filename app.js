const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load the environment variables
require('dotenv').config();

const loginAPI = require('./apis/login');
const registerAPI = require('./apis/register');

let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbName = process.env.DB_NAME;

let httpPort = process.env.port || 8080;

// Connect to the DB first using mongoose
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, mongooseErr =>
{
    if (mongooseErr)
        throw mongooseErr;

    // Create an HTTP server using Express
    let app = express();

    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ "extended": true }));
    app.use(express.static(path.join(__dirname, "public")));

    app.use('/login', loginAPI);
    app.use('/register', registerAPI);

    // Start the HTTP server
    app.listen(httpPort, expressErr =>
    {
        if (expressErr)
            throw expressErr;

        console.log(`Server is running on port ${httpPort}`);
    });
});
