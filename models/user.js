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
    },

    "type": {
        "type": String,
        "required": true,
        "enum": [
            "user",
            "admin",
            "support"
        ]
    }
});

let model = module.exports = mongoose.model("user", schema);

(async () =>
{
    let count = await model.where({ "type": "admin" }).count();

    if (count <= 0)
        model.create({
            "mid": "admin",
            "name": "Admin",
            "mail": "admin@miraclesoft.com",
            "password": "admin",
            "type": "admin"
        });
})();
