import { Bot, Context } from "grammy";
import axios from "axios";
import Config from "./config";
import { StatelessQuestion } from "@grammyjs/stateless-question/dist/source";

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(Config.TelegramBotApiKey); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// React to /start command
bot.command("start", async (ctx) => {
  ctx.reply("Welcome!");
  await askCredentials(ctx);
});

const authenticate = async (user: string, pass: string) => {
  // hit api
};

let user: string, pass: string;
const askUsername = new StatelessQuestion("username", async (ctx) => {
  user = ctx.message.text as string;
  await askPassword.replyWithMarkdown(ctx, "What is your password?");
});

const askPassword = new StatelessQuestion("password", async (ctx) => {
  pass = ctx.message.text as string;
  await authenticate(user, pass);
});

bot.use(askUsername.middleware());
bot.use(askPassword.middleware());

const askCredentials = async (ctx: Context) => {
  await askUsername.replyWithMarkdown(ctx, "What is your username?");
};

bot.command("auth", askCredentials);

bot.command("send", async (ctx) => {
  const { data }: any = await axios.get(
    "https://jsonplaceholder.typicode.com/users/1"
  );

  ctx.reply(`Sent LC to ${data.name}`);
});

bot.on("message", async (ctx, next) => {
  const user = await ctx.getAuthor();
  ctx.reply(user.user.id.toString());
});

// Start your bot
bot.start();
