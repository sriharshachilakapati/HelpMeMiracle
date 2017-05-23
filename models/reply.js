const mongoose = require('mongoose');

let schema = mongoose.Schema({
    "rid": {
        "type": String,
        "required": true,
        "unique": true
    },

    "tid": {
        "type": String,
        "required": true
    },

    "mid": {
        "type": String,
        "required": true
    },

    "message": {
        "type": String,
        "required": true
    }
});

schema.virtual('ticketRef', {
    "ref": "ticket",
    "localField": "tid",
    "foreignField": "tid",
    "justOne": true
});

schema.virtual('authorRef', {
    "ref": "user",
    "localField": "mid",
    "foreignField": "mid",
    "justOne": true
});
