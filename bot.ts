import { Bot, Context, InlineKeyboard } from "grammy";
import axios from "axios";
import Config from "./config";
import { StatelessQuestion } from "@grammyjs/stateless-question/dist/source";
import { InlineQueryResult } from "@grammyjs/types";

const bot = new Bot(Config.TelegramBotApiKey);

const authenticate = async (user: string, pass: string, telegramId: number) => {
  const res = await axios.put(`${Config.LeetcoinBaseUrl}/api/user/tgId`, {
    username: user,
    password: pass,
    telegramId: telegramId.toString(),
    apiKey: Config.LeetcoinApiKey,
  });

  return res;
};

let user: string, pass: string;
const askUsername = new StatelessQuestion("username", async (ctx) => {
  user = ctx.message.text as string;
  await askPassword.replyWithMarkdown(ctx, "What is your password?");
});

const askPassword = new StatelessQuestion("password", async (ctx) => {
  pass = ctx.message.text as string;

  try {
    await authenticate(user, pass, (await ctx.getAuthor()).user.id);
    ctx.reply(
      "Successfully authenticated. Now you can try to send and receive LC."
    );
  } catch (error) {
    console.error(error);
    ctx.reply("Unable to authenticate.");
  }
});

bot.use(askUsername.middleware());
bot.use(askPassword.middleware());

const askCredentials = async (ctx: Context) => {
  await askUsername.replyWithMarkdown(ctx, "What is your username?");
};

// ---------COMMANDLERS (Command Handlers)-----------
// React to /start command
bot.command("start", async (ctx) => {
  ctx.reply("Welcome!");
  await askCredentials(ctx);
});

bot.command("auth", askCredentials);

bot.on("inline_query", async (ctx) => {
  const amt = ctx.inlineQuery.query;
  const tgId = ctx.inlineQuery.from.id.toString();

  const { data: lcUsers } = await axios.get(
    `${Config.LeetcoinBaseUrl}/api/users`
  );
  const inlineResUsers: InlineQueryResult[] = (
    lcUsers as { _id: string; name: string }[]
  ).map((lcUser) => {
    const opt: InlineQueryResult = {
      type: "article",
      id: lcUser._id,
      title: lcUser.name,
      input_message_content: {
        message_text: `Confirm sending of <b>${amt}</b> LC to <b>${lcUser.name}</b>`,
        parse_mode: "HTML",
      },
      reply_markup: new InlineKeyboard().url(
        "Confirm",
        `${Config.LeetcoinClientBaseUrl}/tg-transfer?tgId=${tgId}&receiver=${lcUser.name}&amt=${amt}`
      ),
      //url: `https://send.lc?to=${lcUser.name}&amt=${amt}`,
    };

    return opt;
  });

  await ctx.answerInlineQuery(inlineResUsers);
});

bot.start();
