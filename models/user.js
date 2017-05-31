const mongoose = require('mongoose');

let schema = mongoose.Schema({
    "mid": {
        "type": String,
        "required": true,
        "unique": true
    },

    "name": {
        "type": String,
        "required": true
    },

    "mail": {
        "type": String,
        "required": true,
        "unique": true
    },

    "password": {
        "type": String,
        "required": true
    }
});

module.exports = mongoose.model("user", schema);
