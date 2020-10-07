const TelegramBot = require('node-telegram-bot-api'); 
const token = '888694914:AAGDAmfqBYVdf4oZxjurh3SDpixWUz_oOBk';
const bot = new TelegramBot(token, {polling: true});
const cepPromise = require("cep-promise")

var express = require('express');
var packageInfo = require('./package.json');

var app = express();


async function cep_async(text) {
    res = await cepPromise(text);
    console.log(13, res);
    return res;               
}

app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT  || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Web server started at http://%s:%s', host, port);
});

const mongoose = require("mongoose");

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOLAB_COPPER_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost:27017';

    var theport = process.env.PORT || 5000;

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

bot.onText(/^[-a-z-A-Z]+$/, (msg, match) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['consultar boleto'],
                ['alterar dados'],
                ['forma de pagamento'],
                ['outros']
            ]
        })
    };
    bot.sendMessage(msg.chat.id,'Verifique o menu para facilitar o contato.', opts);   
});

bot.on('message', (msg, match) => {
    dbmsg = new Message({
        user: {
            name: msg.from.first_name,
            id: msg.from.id
        },
        message: {
            chat_id: msg.chat.id, 
            id: msg.message_id,
            text: msg.text
        },
        timestamp: new Date().toISOString()         
    }).save(console.log);
});

bot.onText(/list/,(msg,match) => {

    Message.find(function (err, messages) {
        if (err) return console.error(err);
        console.log(messages);
      })
      

    Message.find({}, (a,b) => {
        console.log(59,a);
        console.log(60,b);
        // bot.forwardMessage(msg.chat.id, result); // .message.chat_id, result.message.id);
    });
});

bot.onText(/boleto/, (msg, match) => {
    var document = __dirname+'/./boletomongeral.pdf';
    bot.sendDocument(msg.chat.id, document);
});

bot.onText(/dados/, (msg, match) => {
    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
              [{
                text: 'Telefone',
                callback_data: 'Telefone'
              }],
              [{
                text: 'Endereço',
                callback_data: 'Endereço'
              }],
              [{
                text: 'Email',
                callback_data: 'Email'
              }],
            ],
        })
    };
    bot.sendMessage(msg.from.id, 'Escolha uma das opções abaixo', opts);

});

bot.onText(/pagamento/, (msg, match) => {
    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
            [{
                text: 'Alterar para Boleto',
                callback_data: 'Alterar para Boleto'
            }],
            [{
                text: 'Alterar para Débito Automático',
                callback_data: 'Alterar para Débito Automático'
            }],
            ],
        }),
    };
    bot.sendMessage(msg.from.id, 'Escolha uma das opções abaixo', opts);

});

bot.onText(/outros/, (msg, match) => {
    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
            [{
                text: '👍',
                callback_data: 'beleza'
            }],
            [{
                text: '👎',
                callback_data: 'nao'
            }],
            ],
        }),
    };
    bot.sendMessage(msg.from.id, 'Se você não conseguiu resolver seus problemas, pode marcar uma conversa com a nossa central de atendimento.', opts);    
});


// Trata os botões
bot.on('callback_query', (callback_query) =>{
    const action = callback_query.data;
    const msg = callback_query.message;
    switch (action){
        case 'Telefone' :
            bot.sendMessage(msg.chat.id, 'Quer mudar para qual número? Formato: (21)2767-3969');
            bot.onText(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/, (msg, match) => {
                                const opts = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                        [{
                            text: '👍',
                            callback_data: 'confirmo'
                        }],
                        [{
                            text: '👎',
                            callback_data: 'Nao confirmo'
                        }],
                        ],
                    }),
                };
                bot.sendMessage(msg.from.id, "Confirma o número " + msg.text + "?",opts);
                bot.on('callback_query', (confirma) =>{
                    const action = confirma.data
                    const msg2 = confirma.message

                    if (action == "confirmo"){
                        bot.sendMessage(msg2.chat.id, "Confirmado, mudamos seu número.");
                    }
                    else if(action == 'Nao confirmo'){
                        bot.sendMessage(msg2.chat.id, "Tente novamente mais tarde.");
                    }
                })
            });
            break;
            case 'Email' :
                bot.sendMessage(msg.chat.id, 'Digite o email que quer mudar');
                bot.onText(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, (msg, match) => {
                    const opts = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            [{
                                text: '👍',
                                callback_data: 'Mudar'
                            }],
                            [{
                                text: '👎',
                                callback_data: 'Nao mudar'
                            }],
                            ],
                        }),
                    };
                    bot.sendMessage(msg.from.id, "Confirma o email " + msg.text + "?",opts);
                        
                    bot.on('callback_query', (confirma2) =>{
                        const action = confirma2.data
                        const msg3 = confirma2.message
    
                        if (action == "Mudar"){
                            bot.sendMessage(msg3.chat.id, "Confirmamos o email.");
                        }
                        else if (action == "Não Mudar"){
                        bot.sendMessage(msg3.chat.id, "Tente novamente mais tarde.");
                        }
                    })
                });   
            break;
            case 'Endereço':
                bot.sendMessage(msg.chat.id, 'Vamos lá! Qual o seu novo cep (formato 12345-678)?');
                bot.onText(/[0-9]{5}-[\d]{3}/, (msg, match) => {
                    cepPromise(msg.text)
                    .then((cep_data,err)=>{
                        bot.sendMessage(msg.from.id, `Rua: ${cep_data.street}\nBairro: ${cep_data.neighborhood}\nEstado: ${cep_data.state}\nCidade: ${cep_data.city}`);
                    });
                });
                bot.onText(/[0-9]{5}-[\d]{3}/, (msg, match) => {
                    const opts = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            [{
                                text: '👍',
                                callback_data: 'uhum'
                            }],
                            [{
                                text: '👎',
                                callback_data: 'Não'
                            }],
                            ],
                        }),
                    };
                    bot.sendMessage(msg.from.id, "Confirma o endereço?",opts);
                    });
                    bot.on('callback_query', (confirma3)=>{
                        const action = confirma3.data
                        const msg4 = confirma3.message
    
                        if (action == "uhum"){
                            bot.sendMessage(msg4.chat.id, "Digite o número do complemento");
                            bot.onText(/^[0-9]{1,4}$/, (msg, match) => {
                               bot.sendMessage(msg4.chat.id,'Mudamos seu endereço'); 
                        });
                        }
                        else if(action == 'Não'){
                            bot.sendMessage(msg4.chat.id, "Tente novamente mais tarde.");
                         };                 
                    })
            break;
        case 'Alterar para Boleto':
            bot.sendMessage(msg.chat.id, 'Mudamos sua forma de pagamento para boleto');
            break;
        case 'Alterar para Débito Automático':
            bot.sendMessage(msg.chat.id, 'Mudamos sua forma de pagamento para débito automático'); 
            break;
        case 'beleza':
            bot.sendMessage(msg.chat.id, 'Pode essa semana?');
            bot.onText(/^[-a-s-A-S]+$/, (msg, match) => {
                const opts = {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                        [{
                            text: 'Segunda 12h',
                            callback_data: 'Segunda 12h'
                        }],
                        [{
                            text: 'Segunda 18h',
                            callback_data: 'Segunda 18h'
                        }],
                        ],
                    }),
                };
            bot.sendMessage(msg.from.id, 'Escolha uma das opções abaixo:', opts);    

            bot.on('callback_query', (confirma4)=>{
                const action = confirma4.data
                const msg5 = confirma4.message

                if (action == "Segunda 12h"){
                    bot.sendMessage(msg5.chat.id, 'Agendamos nesse horário.');        
                    }
                else if(action == "Segunda 18h"){
                    bot.sendMessage(msg5.chat.id, 'Agendamos nesse horário.');        
                }
                });
            });
            break;
        }
    });
    
bot.on('message', (msg) => {
    //bem vindo
    var oi = "oi";  
    if (msg.text.toString().toLowerCase().includes(oi)) {
        bot.sendMessage(msg.chat.id, "Eu sou Maggy, a assistente virtual da mongeral! Em que posso ajudar?");
    }           
    else{
        bot.sendMessage(msg.chat.id, "Erro! Não consegui entender sua mensagem, na dúvida siga as opções de teclado.");
    }         
});
