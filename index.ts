import { Bot } from "grammy";
import  { MongoClient } from 'mongodb';
import { MessageRepositoryImpl } from "./repositories/MessageRepositoryImpl";
import { MessageService } from "./services/MessageService";
import { finBotHandlers } from "./handlers/finBotHandlers";

if (!process.env.BOT_TOKEN) {
  console.error('BOT_TOKEN env was not defined')
  process.exit();
}

if (!process.env.MONGO_CONNECTION) {
  console.error('MONGO_CONNECTION env was not defined')
  process.exit();
}

const bot = new Bot(process.env.BOT_TOKEN);
const client = new MongoClient(process.env.MONGO_CONNECTION);
const messageRepository = new MessageRepositoryImpl(client.db(process.env.MONGO_DB_NAME))
const messageService = new MessageService(messageRepository);
const handlers = finBotHandlers(messageService);
bot.use(handlers);


async function run() {
  try {
    await bot.start();
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


