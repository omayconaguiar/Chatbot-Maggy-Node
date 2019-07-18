const TelegramBot = require('node-telegram-bot-api'); 
const token = '888694914:AAGDAmfqBYVdf4oZxjurh3SDpixWUz_oOBk';
const bot = new TelegramBot(token, {polling: true});

var express = require('express');
var packageInfo = require('./package.json');

var app = express();

app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT  || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Web server started at http://%s:%s', host, port);
});

var mongoose = require("mongoose");

var uristring = 'mongodb://localhost:27017';
// var uristring =  process.env.MONGODB_URI;
// mongoose.connect('mongodb://username:password@host:port/database?options...', {useNewUrlParser: true});


mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

var messageSchema = new mongoose.Schema({
    user: {
        name: String,
        id: Number
    },
    message: {
        chat_id: String,
        id: String,
        text: String
    },
    timestamp: String
});

var Message = mongoose.model('Messages', messageSchema);

module.exports = {
    getLogs(cb) {
    Message.find({}).exec(function (err, result) {
        cb(result);
    })
    },

    clearLogs(cb) {
        Message.remove({}, cb);
    },

    addLog(user, message, cb) {
        dbmsg = new Message({
            user: user,
            message: message,
            timestamp: new Date().toISOString()
        }).save(cb);
    }
}


bot.onText('message', function (msg, match) {
    db.addLog({
        name: msg.from.first_name,
        id: msg.from.id
    }, {
        chat_id: msg.chat.id, 
        id: msg.message_id,
        text: match[1]
    })
});

bot.onText(/^\/get_logs$/, (msg, match) => {
    db.getLogs((res) => bot.forwardMessage(msg.chat.id, el.message.chat_id, el.message.id))
    });

