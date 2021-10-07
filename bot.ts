import { Bot } from "grammy";
import axios from "axios";
import Config from "./config";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(Config.TelegramBotApiKey); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// React to /start command
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.command("send", async (ctx) => {
  const { data }: any = await axios.get("https://jsonplaceholder.typicode.com/users/1");

  ctx.reply(`Sent LC to ${data.name}`);
})

bot.on("message", async (ctx, next) => {
  const user = await ctx.getAuthor();
  ctx.reply(user.user.id.toString());
});

// Start your bot
bot.start();
