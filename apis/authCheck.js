const jwt = require('jsonwebtoken');
const users = require('../models/user');

let secret = process.env.SECRET;

function authCheck(req, res, next)
{
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token)
    {
        jwt.verify(token, secret, (err, decoded) =>
        {
            if (!err)
            {
                let mid = decoded.mid;
                users.findOne({ "mid": mid }, (err, user) =>
                {
                    if (err || user == null)
                    {
                        console.error(err);
                        res.json({
                            "success": false,
                            "message": "You need to be authorized to be here!"
                        });
                    }
                    else
                    {
                        req.user = user;
                        next();
                    }
                });
            }
            else
            {
                console.error(err);
                res.json({
                    "success": false,
                    "message": "You need to be authorized to be here!"
                });
            }
        });
    }
    else
        res.json({
            "success": false,
            "message": "You need to be authorized to be here!"
        });
}

module.exports = authCheck;
