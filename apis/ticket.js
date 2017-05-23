const express = require('express');
const tickets = require('../models/ticket');
const users = require('../models/user');

let authRouter = express.Router();
let openRouter = express.Router();

authRouter.post('/new', (req, res) =>
{
    // TODO: Implement after the NLP module is ready
});

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

openRouter.get('/all',    (req, res) => ticketsFindHandler({}, res));
openRouter.get('/open',   (req, res) => ticketsFindHandler({ "status": "open" }, res));
openRouter.get('/closed', (req, res) => ticketsFindHandler({ "status": "closed" }, res));

module.exports = {
    "authAPI": authRouter,
    "openAPI": openRouter
};
