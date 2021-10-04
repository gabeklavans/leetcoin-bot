import { Bot, Context } from "grammy";
import Config from "./config";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(Config.TelegramBotApiKey); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// React to /start command
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages
// bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.on("message", async (ctx, next) => {
  const user = await ctx.getAuthor();
  ctx.reply(user.user.id.toString());
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start your bot
bot.start().then();
