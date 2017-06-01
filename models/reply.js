const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let schema = mongoose.Schema({
    "tid": {
        "type": Number,
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

schema.plugin(autoIncrement.plugin, {
    "model": "reply",
    "field": "rid"
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

let model = module.exports = mongoose.model('reply', schema);

model.createNew = async function(reply)
{
    return await new model(reply).save();
}
