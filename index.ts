require("dotenv").config();

const moment = require("moment");
const { Telegraf } = require("Telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
console.log("Bot Starting...");

let nameDB = ["Kai Wu, Toh"];
let foodDB = [];

// interface IFoodCalories {
//   user: string;
//   foodName: string;
//   calories: number;
//   date: string;
// }

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

bot.help((ctx) => helpText(ctx));
bot.start((ctx) => helpText(ctx));

bot.command("/current", (ctx) => {
  //const name = ctx.message.from.first_name + ", " + ctx.message.from.last_name;
  if (doesUserExist(ctx)) {
    const calories = getAllCaloriesForToday(ctx);
    ctx.reply(`Current Calories for today are: ${calories} calories.`);
  } else {
    ctx.reply("You have not joined our system.\n\n/join to join us.");
  }
});

bot.command("/join", (ctx) => {
  console.log(ctx.message);
  ctx.replyWithMarkdown(
    "Are you ready to join the tracking of your calories?\n\nReply `Yes` to join!"
  );
  bot.hears("Yes", (ctx) => {
    const name =
      ctx.message.from.first_name + ", " + ctx.message.from.last_name;
    if (!doesUserExist(ctx)) {
      ctx.reply("Added " + name + " to our users.");
      nameDB.push(name);
      console.log(nameDB);
    } else {
      ctx.reply(
        "Failed to add " + name + " to our users. You are already in the list."
      );
    }
  });
});

bot.command("/add", (ctx) => {
  if (!doesUserExist(ctx)) {
    ctx.reply("You have not joined our system.\n\n/join to join us.");
    return;
  }
  let food = {
    user: ctx.message.from.first_name + ", " + ctx.message.from.last_name,
    date: moment(Date.now()).format("DD/MM/YYYY"),
    foodName: "",
    calories: 0,
  };

  bot.hears("Yes", (ctx) => {
    if (food.calories === 0 || food.foodName === "") {
      return;
    } else {
      console.log(food);
      console.log(foodDB);
      foodDB.push({ ...food });
      console.log(foodDB);
      ctx.reply("Added food to list!");
      return;
    }
  });

  ctx.reply("What is the name of the food you eaten?");

  bot.on("text", (ctx) => {
    const calories = parseInt(ctx.message.text);

    if (calories >= 0) {
      food.calories = parseInt(ctx.message.text);
      ctx.replyWithMarkdown(
        `Is this the food you have eaten?\n\nFood: ${food.foodName}\nCalories: ${food.calories}\n\nReply \`Yes\` to confirm!`
      );
    } else {
      console.log("Asking calories");
      food.foodName = ctx.message.text;
      ctx.reply("What is the calories of the food you eaten in kcal?");
    }
  });
});

bot.launch();
