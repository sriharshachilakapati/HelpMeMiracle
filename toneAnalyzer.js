const nlulib = require('watson-developer-cloud/natural-language-understanding/v1.js');

const watsonConfig = {
    "username": process.env.WATSON_USER,
    "password": process.env.WATSON_PASS,
    "version_date": "2017-02-27"
};
const nlu = new nlulib(watsonConfig);

module.exports.analyzeTone = function(text)
{
    var parameters = {
        'text': text,
        'features': {
            'keywords': {
                'sentiment': true,
                'emotion': true,
                'limit': 2
            }
        }
    };

    return new Promise((resolve, reject) =>
    {
        nlu.analyze(parameters, (err, res) =>
        {
            if (err)
                reject(err);
            else
            {
                resolve([
                    res.keywords[0].sentiment.score,
                    res.keywords[1].sentiment.score
                ]);
            }
        });
    });
}
