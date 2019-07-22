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

bot.once('message', (msg, match) => {
    const chatId = msg.chat.id;
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['consultar boleto'],
                ['alterar dados'],
                ['forma de pagamento']
            ]
        })
    };
    console.log(18,msg.text);
    bot.sendMessage(chatId,'Eu sou Maggy, a assistente virtual da mongeral! Em que posso ajudar?', opts);
    
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

app.get('message', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('message', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    })
})