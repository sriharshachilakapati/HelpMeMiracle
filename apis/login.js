const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../models/user');

let secret = process.env.SECRET;
let router = module.exports = express.Router();

router.post('/', (req, res) =>
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
                    "message": "Authentication successful",
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
