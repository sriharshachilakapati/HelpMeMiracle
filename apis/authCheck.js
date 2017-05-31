const jwt = require('jsonwebtoken');
const users = require('../models/user');

let secret = process.env.SECRET;

async function authCheck(req, res, next)
{
    try
    {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token == null)
            throw new Error(`Token is not sent with request - ${req.method} - ${req.originalUrl}`);

        let decoded = jwt.verify(token, secret);

        let mid = decoded.mid;
        let user = await users.findOne({ "mid": mid }).exec();

        if (user == null)
            throw new Error(`User ${mid} is not present, might be removed by admin`);

        req.user = user;
        next();
    }
    catch (err)
    {
        console.error(err);
        res.json({
            "success": false,
            "message": "You need to be authorized to be here!"
        });
    }
}

module.exports = (req, res, next) => authCheck(req, res, next);
