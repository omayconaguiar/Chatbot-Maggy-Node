import telebot
bot = telebot.TeleBot("888694914:AAGDAmfqBYVdf4oZxjurh3SDpixWUz_oOBk")

bot.on('message', (msg) => {

var hi = "hi";
if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
bot.sendMessage(msg.chat.id,"Hello dear user");
} 
    
var bye = "bye";
if (msg.text.toString().toLowerCase().includes(bye)) {
bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
} 

});