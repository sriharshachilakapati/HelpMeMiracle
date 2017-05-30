const express = require('express');
const replies = require('../models/reply');

let authRouter = express.Router();

authRouter.post('/new', (req, res) =>
{
    let reply = {
        "tid": req.body.tid,
        "mid": req.user.mid,
        "message": req.body.message
    };

    replies.create(reply, err =>
    {
        if (err)
        {
            console.error(err);
            res.json({
                "success": false,
                "message": "Unable to create a reply"
            });
        }
        else
            res.json({
                "success": true,
                "message": "Reply submitted successfully"
            });
    });
});

module.exports = {
    "authAPI": authRouter
};
