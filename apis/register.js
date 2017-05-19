const express = require('express');
const users = require('../models/user');

let router = module.exports = express.Router();

router.post('/', (req, res) =>
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
