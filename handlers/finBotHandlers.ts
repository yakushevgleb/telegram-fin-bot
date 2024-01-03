import { Composer } from "grammy";
import { MessageService } from "../services/MessageService";
import expensesDtoToMessage from "./expensesDtoToMessage";

export const finBotHandlers = (service: MessageService) => {
  const handlers = new Composer();
  handlers.command('currentMonth', async (ctx) => {
    const result = await service.calcCurrentMonthByTags(ctx.chat.id);
    ctx.reply(expensesDtoToMessage(result))
  })

  handlers.command('last3Months', async (ctx) => {
    const result = await service.calcLast3MonthsByTags(ctx.chat.id);
    ctx.reply(expensesDtoToMessage(result))
  })

  handlers.command('last6Months', async (ctx) => {
    const result = await service.calcLast6MonthsByTags(ctx.chat.id);
    ctx.reply(expensesDtoToMessage(result))
  })

  handlers.command('last12Months', async (ctx) => {
    const result = await service.calcLast12MonthsByTags(ctx.chat.id);
    ctx.reply(expensesDtoToMessage(result))
  })

  handlers.on('message', (ctx) => {
    if (!ctx.message?.text) {
      ctx.reply('Message is empty. It should include space separated text');
      return
    }
    const textBlocks = ctx.message.text.split(' ');
    const expense = textBlocks.find((block) => block.match(/^\+?\d*[,.]?\d*$/))
    if (!expense) {
      ctx.reply("Couldn't find any number in the provided message. Note that the first number in your message will be considered as an expense")
      ctx.deleteMessage()
      return
    }
    const tag = textBlocks.find((block) => block.match(/^\#\S*/)) || textBlocks.find((block) => block !== expense)
    if (!tag) {
      ctx.reply("Couldn't find any tag to mark an expense. Please provide some name for this expense")
      ctx.deleteMessage()
      return
    }
    const misc = textBlocks.filter((block) => block !== expense && block !== tag).join(' ')
    service.saveMessage({
      messageId: ctx.message.message_id,
      expense: Number(expense.replace(',', '.').replace('+', '-')),
      tag,
      chatId: ctx.chat.id,
      timestamp: ctx.message.forward_date || ctx.message.date,
      misc
    })
  })

  return handlers;
}

