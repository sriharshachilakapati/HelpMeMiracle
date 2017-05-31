const express = require('express');
const tickets = require('../models/ticket');
const users = require('../models/user');
const replies = require('../models/reply');
const toneAnalyzer = require('../toneAnalyzer');

let authRouter = express.Router();
let openRouter = express.Router();

/**
 * Function to fetch multiple tickets based on a selector. Called with different
 * selectors by different routes.
 *
 * @param selector Object
 * @param res      Object
 */
async function ticketsFindHandler(selector, res)
{
    try
    {
        let allTickets = await tickets.find(selector).populate("assigneeRef authorRef").exec();

        // Get the enough ticket fields
        allTickets = allTickets.map(ticket => ({
            "tid": ticket.tid,
            "title": ticket.title,
            "priority": ticket.priority,
            "category": ticket.category,
            "author": ticket.authorRef.name,
            "assignee": (ticket.assigneeRef || { "name": "Unassigned" }).name
        })).
        sort((t1, t2) => (t2.priority - t1.priority));

        res.json({
            "success": true,
            "tickets": allTickets
        });
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": "Failed to retrieve the tickets."
        });
    }
}

authRouter.post('/new', (req, res) =>
{
    let message = req.body.description;

    toneAnalyzer.analyzeTone(message, tone =>
    {
        if (!tone.success)
        {
            console.error(tone.message);
            res.json(tone);
        }
        else
        {
            let sadness = tone.sadness;
            let anger = tone.anger;
            let disgust = tone.disgust;

            let avg = (sadness + anger + disgust) / 3.0;
            let priority = Math.max(avg * 5, 1);

            let ticket = {
                "priority": priority,
                "title": req.body.title,
                "category": req.body.category,
                "location": req.body.location,
                "department": req.body.department,
                "project": req.body.project,
                "shiftTime": req.body.shiftTime,
                "extensionOrMobile": req.body.extensionOrMobile,
                "ipAddress": req.body.ipAddress,
                "status": "open",
                "assignee": null,
                "author": req.user.mid
            };

            tickets.create(ticket, (err, data) =>
            {
                if (err)
                {
                    console.error(err);
                    res.json({
                        "success": false,
                        "message": "Failed to create new ticket"
                    });
                }
                else
                {
                    let reply = {
                        "tid": data.tid,
                        "mid": req.user.mid,
                        "message": message
                    };

                    replies.create(reply, err =>
                    {
                        if (err)
                        {
                            console.error(err);
                            res.json({
                                "success": false,
                                "message": "Failed to create new ticket"
                            });
                        }
                        else
                        {
                            res.json({
                                "success": true,
                                "message": "New ticket created successfully"
                            });
                        }
                    });
                }
            });
        }
    });
});

authRouter.post('/my',    (req, res) => ticketsFindHandler({ "author": req.user.mid }, res));
openRouter.get('/all',    (req, res) => ticketsFindHandler({}, res));
openRouter.get('/open',   (req, res) => ticketsFindHandler({ "status": "open" }, res));
openRouter.get('/closed', (req, res) => ticketsFindHandler({ "status": "closed" }, res));

openRouter.get('/:tid', async (req, res) =>
{
    try
    {
        let tid = req.params.tid;

        let ticket = await tickets.findOne({ "tid": tid }).populate("assigneeRef authorRef").exec();

        if (ticket == null)
            throw new Error(`Ticket with id ${tid} is invalid`);

        // Get all replies in this ticket
        let data = await replies.find({ "tid": tid }).populate("authorRef").exec();

        if (data == null)
            throw new Error(`Cannot find replies for the ticket ${tid}`);

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
            "assignee": (ticket.assigneeRef || { "name": "Unassigned" }).name,
            "author": ticket.authorRef.name,

            "replies": data.map(reply => ({
                "rid": reply.rid,
                "mid": reply.mid,
                "message": reply.message,
                "authorName": reply.authorRef.name
            })).
            sort((r1, r2) => (r1.rid - r2.rid))
        };

        res.json({
            "success": true,
            "ticket": response
        });
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

module.exports = {
    "authAPI": authRouter,
    "openAPI": openRouter
};
