const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

let smtp = nodemailer.createTransport({
    "host": process.env.SMTP_HOST,
    "port": process.env.SMTP_PORT,
    "secure": process.env.SMTP_SECURE,
    "auth": {
        "user": process.env.SMTP_USER,
        "pass": process.env.SMTP_PASS
    },
    "tls": {
        "rejectUnauthorized": false
    }
});

/**
 * Helper function for reading a file as text. This function promisifies the fs.readFile
 * function.
 * @private
 * @param fname {String} - The filename of the email template file
 * @return {Promise} A promise which returns contents of the file as a string.
 */
function readFile(fname)
{
    return new Promise((resolve, reject) =>
    {
        fs.readFile(path.resolve(fname), 'UTF-8', (err, data) =>
        {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

/**
 * A helper function that renders a template string based on a given context, where
 * the context is a JSON object describing what to replace.
 * @private
 * @param str {String} - The initial template string
 * @param context {Object} - JSON object with properties available in the template
 * @param base {String} - Base name to append to all the properties
 * @return {String} The transformed template string
 */
function render(str, context, base)
{
    if (typeof (context) !== "object")
    {
        let regex = base.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        regex = `\{\{\\s*${ regex }\\s*\}\}`;
        return str.replace(new RegExp(regex, 'g'), context);
    }

    for (let prop in context)
    {
        if (context.hasOwnProperty(prop))
            str = render(str, context[prop], base != null ? `${base}.${prop}` : prop);
    }

    return str;
}

async function getTemplate(name, context)
{
    let template = await readFile(name);
    return render(template, context);
}

module.exports.NewTicketEvent = {
    "template": "mailtemplates/newTicket.html",
    "subject": "New ticket is raised on Miracle Help Desk"
};

module.exports.TicketAssignedEvent = {
    "template": "mailtemplates/ticketAssigned.html",
    "subject": "You have been assigned to a ticket"
};

module.exports.NewReplyEvent = {
    "template": "mailtemplates/newReply.html",
    "subject": "A new reply has been posted"
};

module.exports.StatusChangedEvent = {
    "template": "mailtemplates/statusChanged.html",
    "subject": "Your ticket has got a status change"
};

module.exports.notify = async function(user, event, context)
{
    let template = await getTemplate(event.template, context);

    let email = {
        "from": `"Notifications" <${ process.env.SMTP_USER }>`,
        "to": user.mail,
        "subject": event.subject,
        "html": template
    };

    return await smtp.sendMail(email);
};
