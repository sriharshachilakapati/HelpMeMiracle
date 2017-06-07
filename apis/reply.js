const express = require('express');
const replies = require('../models/reply');
const tickets = require('../models/ticket');
const mailer = require('../mailer');

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

        let [ticket, allReplies] = await Promise.all([
            tickets.findOne({ "tid": req.body.tid }).populate("assigneeRef").exec(),
            replies.find({ "tid": req.body.tid }).populate("authorRef").exec()
        ]);

        let users = [];
        users.push(ticket.assigneeRef);
        allReplies.forEach(r => users.push(r.authorRef));

        users.filter(user => (user.mid != req.user.mid)).forEach(user =>
        {
            try
            {
                mailer.notify(user, mailer.NewReplyEvent, {
                    "user": user._doc,
                    "ticket": ticket._doc,
                    "reply": reply,
                    "reply.authorName": req.user.name,
                    "ticket.url": `http://localhost:8080/#/ticket/${ticket.tid}`
                });
            }
            catch (err) { console.error(err); }
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
