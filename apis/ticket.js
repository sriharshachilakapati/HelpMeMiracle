const express = require('express');
const tickets = require('../models/ticket');
const users = require('../models/user');

let authRouter = express.Router();
let openRouter = express.Router();

authRouter.post('/new', (req, res) =>
{
    // TODO: Implement after the NLP module is ready
});

openRouter.get('/all', (req, res) =>
{
    tickets.find({}).populate("assigneeRef authorRef").exec((err, data) =>
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
});

module.exports = {
    "authAPI": authRouter,
    "openAPI": openRouter
};
