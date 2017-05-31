const express = require('express');
const users = require('../models/user');
const spteam = require('../models/spteam');

let router = module.exports = express.Router();

router.post('/', (req, res) =>
{
    let coll = req.body.type === "Employee" ? users : spteam;

    coll.create(req.body, err =>
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
