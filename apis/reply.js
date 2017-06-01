const express = require('express');
const replies = require('../models/reply');

let authRouter = express.Router();

authRouter.post('/new', async (req, res) =>
{
    let reply = {
        "tid": req.body.tid,
        "mid": req.user.mid,
        "message": req.body.message
    };

    try
    {
        await replies.createNew(reply);
        res.json({
            "success": true,
            "message": "Reply submitted successfully"
        });
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": "Reply submission failed"
        });
    }
});

module.exports = {
    "authAPI": authRouter
};
