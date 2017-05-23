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

    "priority": {
        "type": Number,
        "required": true
    },

    "category": {
        "type": String,
        "required": true
    },

    "location": {
        "type": String,
        "required": true
    },

    "department": {
        "type": String,
        "required": true
    },

    "project": {
        "type": String,
        "required": true
    },

    "shiftTime": {
        "type": String,
        "required": true
    },

    "extensionOrMobile": {
        "type": String,
        "required": true
    },

    "ipAddress": {
        "type": String
    },

    "status": {
        "type": String,
        "required": true
    },

    "assignee": {
        "type": String,
        "required": false
    },

    "author": {
        "type": String,
        "required": false
    }
});

schema.virtual('assigneeRef', {
    'ref': 'user',
    'localField': 'assignee',
    'foreignField': 'mid',
    'justOne': true
});

schema.virtual('authorRef', {
    'ref': 'user',
    'localField': 'author',
    'foreignField': 'mid',
    'justOne': true
});

module.exports = mongoose.model('ticket', schema);
