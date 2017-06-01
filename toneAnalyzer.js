const nlulib = require('watson-developer-cloud/natural-language-understanding/v1.js');

const watsonConfig = {
    "username": process.env.WATSON_USER,
    "password": process.env.WATSON_PASS,
    "version_date": "2017-02-27"
};
const nlu = new nlulib(watsonConfig);

module.exports.analyzeTone = function(text)
{
    let parameters = {
        "text": text,
        "features": {
            "emotion": {}
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
                let doc = res.emotion.document;
                resolve({
                    "sadness": doc.emotion.sadness,
                    "anger": doc.emotion.anger,
                    "disgust": doc.emotion.disgust
                });
            }
        });
    });
}
