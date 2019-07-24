const TelegramBot = require('node-telegram-bot-api'); 
const token = '888694914:AAGDAmfqBYVdf4oZxjurh3SDpixWUz_oOBk';
const bot = new TelegramBot(token, {polling: true});
const cepPromise = require("cep-promise")

const mongoose = require("mongoose");

const uristring = 'mongodb://localhost:27017';


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
                ['forma de pagamento']
            ]
        })
    };
    bot.sendMessage(chatId,'Eu sou Maggy, a assistente virtual da mongeral! Em que posso ajudar?', opts);
    
});
bot.on('message',(msg,match)=>{
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
    const url = 'http://www.pdf995.com/samples/pdf.pdf';
    bot.sendDocument(544663315, url);
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
    
    bot.on('callback_query', function onCallbackQuery(example){
        const action = example.data // This is responsible for checking the content of callback_data
        const msg = example.message
        
       

        if (action == 'Telefone'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Quer mudar para qual número?');
            bot.once('message', (msg) => {
                bot.sendMessage(msg.from.id, "Confirma o número " + msg.text + "?");
                    const opts = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            [{
                                text: '👍',
                                callback_data: 'sim'
                            }],
                            [{
                                text: '👎',
                                callback_data: 'nao'
                            }],
                            ],
                        }),
                    };
                    bot.sendMessage(msg.from.id, 'Escolha sim ou não.', opts);
                    if((action=='sim')||(action=='nao')){
                        bot.sendMessage(msg.from.id, 'Mudamos maycon');        
                    };
              });
            
        }
        else if (action == 'Endereço'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Vamos lá! Qual o seu novo cep (formato 66666666)?');
            bot.on('message', (msg) => {
                cepPromise(msg.text)
                .then(bot.sendMessage(msg.from.id, + msg.text));
            });
        }
        else if (action == 'Email'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Digite o email que você quer mudar');
            bot.on('message', (msg) => {
                const chatId = msg.chat.id;
                bot.sendMessage(msg.from.id, "Confirma o email " + msg.text + "?");
             const opts = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                            [{
                                text: '👍',
                                callback_data: 'sim'
                            }],
                            [{
                                text: '👎',
                                callback_data: 'nao'
                            }],
                            ],
                        }),
                    };
                    bot.sendMessage(msg.from.id, 'Escolha sim ou não.', opts);
                    if((action=='sim')||(action=='nao')){
                        bot.sendMessage(msg.from.id, 'Mudamos maycon');        
                    };
              });
            
        }
        else if (action == 'Alterar para Boleto'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos');
        }
        else if (action == 'Alterar para Débito Automático'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos');        
        }
        else{
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos');        
        }
    }); 