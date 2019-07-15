const TelegramBot = require('node-telegram-bot-api'); 
const token = '888694914:AAGDAmfqBYVdf4oZxjurh3SDpixWUz_oOBk';
const bot = new TelegramBot(token, {polling: true});


bot.onText(/start/, (msg, match) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['boleto'],
                ['dados']
            ]
        })
    };
    bot.sendMessage(msg.chat.id, 'Hi. I am a simple bot. You can get the current price and blockchain height. Have fun!', opts);
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
    
    bot.on('callback_query', function onCallbackQuery(example){
        const action = example.data // This is responsible for checking the content of callback_data
        const msg = example.message
        
        if (action == 'Telefone'){
            const chatId = msg.chat.id;
            // send a message to the chat acknowledging receipt of their message
            bot.sendMessage(chatId, 'Quer mudar para qual número?');
              
        }
        });
