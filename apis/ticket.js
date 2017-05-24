const express = require('express');
const tickets = require('../models/ticket');
const users = require('../models/user');
const replies = require('../models/reply');

let authRouter = express.Router();
let openRouter = express.Router();

/**
 * Function to fetch multiple tickets based on a selector. Called with different
 * selectors by different routes.
 *
 * @param selector Object
 * @param res      Object
 */
function ticketsFindHandler(selector, res)
{
    tickets.find(selector).populate("assigneeRef authorRef").exec((err, data) =>
    {
        if (err)
        {
            console.error(err);
            res.json({
                "success": false,
                "message": "Failed to retrieve the tickets."
            });
        }
        else
        {
            // Get the enough ticket fields
            let allTickets = data.map(ticket => ({
                "tid": ticket.tid,
                "title": ticket.title,
                "priority": ticket.priority,
                "category": ticket.category,
                "author": ticket.authorRef.name,
                "assignee": ticket.assigneeRef.name
            }));

            res.json({
                "success": true,
                "tickets": allTickets
            });
        }
    });
}

authRouter.post('/new', (req, res) =>
{
    // TODO: Implement after the NLP module is ready
});

authRouter.post('/my',    (req, res) => ticketsFindHandler({ "author": req.user.mid }, res));
openRouter.get('/all',    (req, res) => ticketsFindHandler({}, res));
openRouter.get('/open',   (req, res) => ticketsFindHandler({ "status": "open" }, res));
openRouter.get('/closed', (req, res) => ticketsFindHandler({ "status": "closed" }, res));

openRouter.get('/:tid', (req, res) =>
{
    let tid = req.params.tid;
    tickets.findOne({ "tid": tid }).populate("assigneeRef authorRef").exec((err, ticket) =>
    {
        if (err || ticket == null)
        {
            console.error(err);
            res.json({
                "success": false,
                "message": `Failed to find the ticket with id ${tid}`
            });
        }
        else
        {
            // Get all replies in this ticket
            replies.find({ "tid": tid }).populate("authorRef").exec((err, data) =>
            {
                if (err || data == null)
                {
                    console.error(err);
                    res.json({
                        "success": false,
                        "message": `Failed to find the replies for ticket ${tid}`
                    });
                }
                else
                {
                    let response = {
                        "tid": ticket.tid,
                        "title": ticket.title,

                        "priority": ticket.priority,
                        "category": ticket.category,
                        "location": ticket.location,
                        "department": ticket.department,

                        "project": ticket.project,
                        "shiftTime": ticket.shiftTime,

                        "extensionOrMobile": ticket.extensionOrMobile,
                        "ipAddress": ticket.ipAddress,

                        "status": ticket.status,
                        "assignee": ticket.assigneeRef.name,
                        "author": ticket.authorRef.name,

                        "replies": data.map(reply => ({
                            "rid": reply.rid,
                            "mid": reply.mid,
                            "message": reply.message,
                            "authorName": reply.authorRef.name
                        }))
                    };

                    res.json({
                        "success": true,
                        "ticket": response
                    });
                }
            });
        }
    });
});

module.exports = {
    "authAPI": authRouter,
    "openAPI": openRouter
};
