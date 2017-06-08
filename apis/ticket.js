const express = require('express');
const tickets = require('../models/ticket');
const users = require('../models/user');
const replies = require('../models/reply');
const toneAnalyzer = require('../toneAnalyzer');
const mailer = require('../mailer');

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
            "status": ticket.status === "open" ? "Open" : "Closed",
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

authRouter.post('/new', async (req, res) =>
{
    let message = req.body.description;

    try
    {
        let [sentiment1, sentiment2] = await toneAnalyzer.analyzeTone(message);

        let average = (sentiment1 + sentiment2) / 2.0;
        let priority = Math.round(Math.max(Math.abs(average) * 5, 1), 1);

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

        let data = await tickets.createNew(ticket);

        let reply = {
            "tid": data.tid,
            "mid": req.user.mid,
            "message": message
        };

        await replies.createNew(reply);

        try
        {
            await mailer.notify(await users.findOne({ "mid": "admin" }).exec(), mailer.NewTicketEvent, {
                "user": req.user._doc,
                "ticket": ticket,
                "ticket.url": `http://localhost:8080/#/ticket/${data.tid}`
            });
        }
        catch (err) { console.error(err); }

        res.json({
            "success": true,
            "message": "Ticket created successfully"
        });
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": "Failed to create ticket"
        });
    }
});

authRouter.post('/status', async (req, res) =>
{
    let tid = req.body.tid;

    try
    {
        let ticket = await tickets.findOne({ "tid": tid }).populate("authorRef assigneeRef").exec();

        if (req.user.type === "user" && ticket.author !== req.user.mid)
            throw new Error(`User ${req.user.mid} trying to change status of ticket he didn't own`);

        if (req.user.type === "support" && ticket.assignee !== req.user.mid)
            throw new Error(`Support user ${req.user.mid} trying to change status of ticket not assigned to self`);

        ticket.status = req.body.status;
        await ticket.save();

        res.json({
            "success": true,
            "message": `Status of ticket ${tid} changed to ${req.body.status}`
        });

        try
        {
            let user = req.user.mid == ticket.authorRef.mid ? ticket.assigneeRef : ticket.authorRef;
            await mailer.notify(user, mailer.StatusChangedEvent, {
                "user": user._doc,
                "status": req.body.status,
                "status.changer": req.user.name,
                "ticket": ticket._doc,
                "ticket.url": `http://localhost:8080/#/ticket/${ticket.tid}`
            });
        }
        catch (err) { console.error(err); }
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": "Failed to change the status"
        });
    }
});

authRouter.post('/assign', async (req, res) =>
{
    let tid = req.body.tid;
    let mid = req.body.mid;

    try
    {
        let assignee = await users.findOne({ "mid": mid }).exec();

        if (req.user.type !== "admin" && req.user.mid !== mid)
            throw new Error("User not authorized enough to assign others");

        if (assignee.type === "user")
            throw new Error("Normal users cannot be assigned to tickets");

        let ticket = await tickets.findOne({ "tid": tid }).populate("authorRef").exec();

        ticket.assignee = mid;
        await ticket.save();

        try
        {
            await mailer.notify(assignee, mailer.TicketAssignedEvent, {
                "user": assignee._doc,
                "ticket": ticket._doc,
                "ticket.authorName": ticket.authorRef.name
            });
        }
        catch (err) { console.error(err); }

        res.json({
            "success": true,
            "message": "Assignee changed successfully"
        });
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": `Failed to assign ticket ${tid} to user ${mid}`
        });
    }
});

authRouter.post('/my', (req, res) =>
{
    if (req.user.type === "user")
        ticketsFindHandler({ "author": req.user.mid }, res);
    else if (req.user.type == "support")
        ticketsFindHandler({ "assignee": req.user.mid }, res);
    else
        res.json({
            "success": false,
            "message": "Admin will never have his tickets"
        });
});

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
            "assignee": (ticket.assigneeRef || { "mid": "-1" }).mid,
            "assigneeName": (ticket.assigneeRef || { "name": "Unassigned" }).name,
            "author": ticket.authorRef.mid,
            "authorName": ticket.authorRef.name,

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
