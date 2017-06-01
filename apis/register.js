const express = require('express');
const users = require('../models/user');

let router = module.exports = express.Router();

router.post('/', async (req, res) =>
{
    try
    {
        if (req.user.type !== "admin")
            throw new Error('You need to be authorized as an admin!');

        try
        {
            await users.createNew(req.body);
            res.json({
                "success": true,
                "message": "Registration successful"
            });
        }
        catch (err)
        {
            console.error(err);
            throw new Error('Failed to register user');
        }
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": err.message
        });
    }
});
