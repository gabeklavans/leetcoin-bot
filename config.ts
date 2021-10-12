import * as dotenv from "dotenv";
dotenv.config();

export default {
  TelegramBotApiKey: process.env.TELEGRAM_BOT_API as string,
  LeetcoinApiKey: process.env.LEETCOIN_API as string,
};
