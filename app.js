const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const users = require('./models/user');

// Load the environment variables
require('dotenv').config();

let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbName = process.env.DB_NAME;
let secret = process.env.SECRET;

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

    app.post('/register', (req, res) =>
    {
        users.create(req.body, err =>
        {
            if (err)
            {
                res.send({
                    "success": false,
                    "message": "Failed to register user!"
                });

                console.error(err);
            }
            else
                res.send({
                    "success": true,
                    "message": "Registration done successfully"
                });
        });
    });

    app.post('/login', (req, res) =>
    {
        users.findOne({ "mid": req.body.mid }, (err, user) =>
        {
            if (err || user == null)
            {
                console.error(err || user);
                res.send({
                    "success": false,
                    "message": "Authentication failed, user doesn't exist"
                });
            }
            else
            {
                if (user.password != req.body.password)
                    res.send({
                        "success": false,
                        "message": "Authentication failed, check username and password"
                    });
                else
                {
                    let tokenData = {
                        "mid": user.mid,
                        "ts": new Date()
                    };

                    let token = jwt.sign(tokenData, secret, {
                        "expiresIn": "1d"
                    });

                    res.json({
                        "success": true,
                        "message": "Authentication successfully",
                        "user": {
                            "token": token,
                            "mid": user.mid,
                            "mail": user.mail,
                            "name": user.name
                        }
                    });
                }
            }
        });
    });

    // Start the HTTP server
    app.listen(httpPort, expressErr =>
    {
        if (expressErr)
            throw expressErr;

        console.log(`Server is running on port ${httpPort}`);
    });
});
