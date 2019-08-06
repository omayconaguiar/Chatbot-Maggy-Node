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


bot.once('message', (msg, match) => {
    const chatId = msg.chat.id;
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
    bot.sendMessage(chatId,'Eu sou Maggy, a assistente virtual da mongeral! Em que posso ajudar?', opts);   
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
    bot.sendDocument(544663315, document);
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
          }),
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
                        text: 'beleza',
                        callback_data: 'beleza'
                    }],
                    [{
                        text: 'nao',
                        callback_data: 'nao'
                    }],
                    ],
                }),
            };
            bot.sendMessage(msg.from.id, 'Se você não conseguiu resolver seus problemas, pode marcar uma conversa com a nossa central de atendimento.', opts);    
        });
       
    
    bot.on('callback_query', function onCallbackQuery(example){
        const action = example.data // This is responsible for checking the content of callback_data
        const msg = example.message
        
      
        if (action == 'Telefone'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Quer mudar para qual número?');
                bot.on('message', (msg, match) => {
                    const opts = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            [{
                                text: 'confirmo',
                                callback_data: 'confirmo'
                            }],
                            [{
                                text: 'Nao confirmo',
                                callback_data: 'Nao confirmo'
                            }],
                            ],
                        }),
                    };
                    bot.sendMessage(msg.from.id, "Confirma o número " + msg.text + "?",opts);
                });  
        }

        else if (action == 'Endereço'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Vamos lá! Qual o seu novo cep (formato 12345678)?');
            bot.on('message', (msg) => {
                cepPromise(msg.text)
                .then((cep_data,err)=>{
                    bot.sendMessage(msg.from.id, `Rua ${cep_data.street} e bairro ${cep_data.neighborhood}`);
                    console.log(207, cep_data.street, err);
                });
                // console.log(209);
                // bot.sendMessage(msg.from.id, "210....");
            });
        }
        // else if (action == 'Endereço'){
        //     const chatId = msg.chat.id;
        //     bot.sendMessage(chatId, 'Vamos lá! Qual o seu novo cep (formato 12345678)?');
        //     bot.on('message', (msg) => {
        //         command = msg['text'].split(' ')
        //         if (command[0] == '/cep'){
        //             cep = command[1]
        //             api = "https://viacep.com.br/ws/"+cep+"/json/unicode/" 
        //             r = requests.get(api)
        //             results = json.loads(r.content)
        //             print(results)
        //             txt = 'Consulta de CEP e IBGE no Telegram:\n{Criado por Dkr e Tesla.}\n\nCep: '+results['cep']+'\nLogradouro: '+results['logradouro']+'\nComplemento: '+results['complemento']+'\nBairro: '+results['bairro']+'\nLocalidade: '+results['localidade']+'\nUF: '+results['uf']+'\nIBGE: '+results['ibge']
        //             bot.sendMessage(msg.from.id, txt) 
        //         };
        //     });
        // }
        else if (action == 'Email'){
               const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Digite o email que quer mudar');
                bot.on('message', (msg, match) => {
                    const opts = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            [{
                                text: 'Mudar',
                                callback_data: 'Mudar'
                            }],
                            [{
                                text: 'Nao mudar',
                                callback_data: 'Nao mudar'
                            }],
                            ],
                        }),
                    };
                    bot.sendMessage(msg.from.id, "Confirma o email " + msg.text + "?",opts);
                });  
            
        }
        else if (action == 'Alterar para Boleto'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos sua forma de pagamento para boleto');
        }
        else if (action == 'Alterar para Débito Automático'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos sua forma de pagamento para débito automático');        
        }
        else if(action == 'beleza'||action == 'no'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Pode essa semana?');
            bot.on('message', (msg, match) => {
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
            });
        }
        else if (action == 'confirmo'||action == 'Nao confirmo'){
            const chatId = msg.chat.id;
            bot.once.sendMessage(chatId, 'Mudamos seu telefone.');        
        }
        else if (action == 'Mudar'||action == 'Nao mudar'){
            const chatId = msg.chat.id;
            bot.once.sendMessage(chatId, 'Mudamos seu email.');        
        }
        else if (action == 'Segunda 12h'||action == 'Segunda 18h'){
            const chatId = msg.chat.id;
            bot.once.sendMessage(chatId, 'Agendamos nesse horário.');        
        }
       else{
             const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos'); 
       }
        
    }); 

    bot.on('message', (msg, match) => {

        var sin = "sinistro"
        if (msg.text.includes(sin)) {
            bot.sendMessage(msg.chat.id, "Sinistro é a ocorrência");
        }

        var dados = "prêmio"
        if (msg.text.includes(dados)) {
            bot.sendMessage(msg.chat.id, "Prêmio é a taxa que você paga.");
        }
        
    });
