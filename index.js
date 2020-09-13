const Composer = require("micro-bot");
const { Telegraf } = require("micro-bot");

const bot = new Composer();

let nameDB = ["Kai Wu, Toh"];
let foodDB = [];

const findIndexOfName = (name) => {
  return nameDB.indexOf(name);
};

const helpText = (ctx) => {
  ctx.reply(
    "Welcome to Calorie Tracker Bot\n\n/current - to check your current calories for today\n/add - to add in new calories\n/join - to register your name\n"
  );
};

const doesUserExist = (ctx) => {
  const name = ctx.message.from.first_name + ", " + ctx.message.from.last_name;
  if (findIndexOfName(name) >= 0) {
    return true;
  }
  return false;
};

const getAllCaloriesForToday = (ctx) => {
  const user = ctx.message.from.first_name + ", " + ctx.message.from.last_name;
  const today = moment(Date.now()).format("DD/MM/YYYY");
  let calories = 0;
  const userFood = foodDB.map((food) => {
    if (user === food.user && today === food.date) {
      console.log(food);
      calories += food.calories;
      return;
    }
  });

  return calories;
};

const getName = (ctx) =>
  ctx.message.from.first_name + ", " + ctx.message.from.last_name;

bot.command("/current", (ctx) => {
  if (doesUserExist(ctx)) {
    const calories = getAllCaloriesForToday(ctx);
    ctx.reply(`Current Calories for today are: ${calories} calories.`);
  } else {
    ctx.reply("You have not joined our system.\n\n/join to join us.");
  }
});

bot.command("/join", (ctx) => {
  ctx.replyWithMarkdown(
    "Are you ready to join the tracking of your calories?\n\nReply `Yes` to join!"
  );
  bot.hears("Yes", (ctx) => {
    const name = getName(ctx);
    if (!doesUserExist(ctx)) {
      ctx.reply("Added " + name + " to our users.");
      nameDB.push(name);
    } else {
      ctx.reply(
        "Failed to add " + name + " to our users. You are already in the list."
      );
    }
  });
});

bot.help((ctx) => helpText(ctx));
bot.start((ctx) => helpText(ctx));

module.exports = bot;
