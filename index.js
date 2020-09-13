const Composer = require("micro-bot");
const { Telegraf } = require("micro-bot");

const bot = new Composer();

bot.start((ctx) => {
  ctx.reply("Welcome " + ctx.message.first_name);
});

module.exports = bot;
