const TelegramBot = require('node-telegram-bot-api'); 
const token = '888694914:AAGDAmfqBYVdf4oZxjurh3SDpixWUz_oOBk';
const bot = new TelegramBot(token, {polling: true});


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
                bot.sendMessage(chatId, 'Mudamos seu número senhor Maycon');
              });
        }
        else if (action == 'Endereço'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Vamos lá! Qual o seu novo endereço? No formato: (Rua, número, bairro, cidade)');
            bot.once('message', (msg) => {
                bot.sendMessage(chatId, 'Mudamos seu endereço senhor Maycon');
            });
        }
        else if (action == 'Email'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Digite o email que você quer mudar');
            bot.on('message', (msg) => {
                const chatId = msg.chat.id;
                bot.sendMessage(chatId, 'Mudamos seu email senhor Maycon');
            });
        }
        else if (action == 'Alterar para Boleto'){
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos');
        }
        else{
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'Mudamos');        
        }

    }); 