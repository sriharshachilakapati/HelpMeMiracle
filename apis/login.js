const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../models/user');

let secret = process.env.SECRET;
let router = module.exports = express.Router();

router.post('/', async (req, res) =>
{
    try
    {
        let user = await users.findOne({ "mid": req.body.mid }).exec();

        if (user == null)
            throw new Error(`User ${req.body.mid} does not exist`)

        if (user.password != req.body.password)
            throw new Error("Incorrect MID or password");

        let tokenData = {
            "mid": user.mid,
            "ts": new Date()
        };

        let token = jwt.sign(tokenData, secret, {
            "expiresIn": "1d"
        });

        res.json({
            "success": true,
            "message": "Authentication successful",
            "user": {
                "token": token,
                "mid": user.mid,
                "mail": user.mail,
                "name": user.name,
                "type": user.type
            }
        });
    }
    catch (err)
    {
        console.error(err);
        res.send({
            "success": false,
            "message": err.message
        });
    }
});
