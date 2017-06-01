const express = require('express');
const users = require('../models/user');

let router = module.exports = express.Router();

router.get('/support', async (req, res) =>
{
    try
    {
        let supportTeam = await users.find({ "type": "support" }).exec();

        res.json({
            "success": "true",
            "users": supportTeam.map(user => ({
                "mid": user.mid,
                "name": user.name,
                "mail": user.mail
            }))
        });
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": "false",
            "message": "Failed to retrieve support team users"
        });
    }
});
