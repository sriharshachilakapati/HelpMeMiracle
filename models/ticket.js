const mongoose = require('mongoose');

let schema = mongoose.Schema({
    "tid": {
        "type": String,
        "required": true,
        "unique": true
    },

    "title": {
        "type": String,
        "required": true
    },

    "description": {
        "type": String,
        "required": true
    },

    "replies": [{
        "mid": {
            "type": String,
            "required": true,
            "unique": true
        },

        "description": {
            "type": String,
            "required": true
        }
    }]
});

let tickets = module.exports = mongoose.model('ticket', schema);

module.exports.addReply = function(tid, reply, callback)
{
    tickets.findOne({ "tid": tid }, (err, ticket) =>
    {
        if (err || ticket == null)
        {
            console.log(err);
            callback({
                "success": false,
                "message": "Ticket doesn't exist!"
            });
        }
        else
        {
            ticket.replies.push(reply);
            ticket.save(err =>
            {
                if (err)
                {
                    console.log(err);
                    callback({
                        "success": false,
                        "message": "Failure to add reply to ticket"
                    });
                }
                else
                    callback({
                        "success": true,
                        "message": "Reply submitted successfully"
                    });
            });
        }
    });
};
