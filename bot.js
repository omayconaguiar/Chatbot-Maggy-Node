const TelegramBot = require('node-telegram-bot-api'); 
const token = '#';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg, match) => {
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

bot.on('text', async (ctx) => {
    const remoteFile = await request('http://www.lehtml.com/download/js_doc.pdf')
    return bot.telegram.sendDocument(process.env.CHAT_ID, remoteFile, [{disable_notification: true}]);
  })
