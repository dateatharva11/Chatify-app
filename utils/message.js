const moment = require('moment'); //to get the timestamp of the message

function formatMessage(username, text){
    return {
        username,
        text,
        time : moment().format('h:mm a') //hours:minutes am or pm
    }
}

module.exports = formatMessage; //export to server.js