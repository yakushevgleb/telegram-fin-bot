import { MessagesRepository } from "../repositories/MessagesRepository";
import MessageDto from "../dto/MessageDto";
import dayjs from "dayjs";

export class MessageService {
  private readonly messageRepository: MessagesRepository
  constructor(messageRepository: MessagesRepository) {
    this.messageRepository = messageRepository;
  }

  public async saveMessage(message: MessageDto) {
    return this.messageRepository.insertMessage(message);
  }
  public async deleteMessage(messageId: string) {
    return this.messageRepository.deleteMessage(messageId);
  }
  public async calcCurrentMonthByTags(chatId: number) {
    const currDate = dayjs();
    const monthStart = currDate.startOf('month');
    return this.messageRepository.agregateBetweenDatesByTag(chatId, monthStart.unix(), currDate.unix())
  }

  public async calcLast3MonthsByTags(chatId: number) {
    const currDate = dayjs();
    const monthStart = currDate.subtract(2, 'months').startOf('month');
    return this.messageRepository.agregateBetweenDatesByTag(chatId, monthStart.unix(), currDate.unix())
  }

  public async calcLast6MonthsByTags(chatId: number) {
    const currDate = dayjs();
    const monthStart = currDate.subtract(5, 'months').startOf('month');
    return this.messageRepository.agregateBetweenDatesByTag(chatId, monthStart.unix(), currDate.unix())
  }

  public async calcLast12MonthsByTags(chatId: number) {
    const currDate = dayjs();
    const monthStart = currDate.subtract(12, 'months').startOf('month');
    return this.messageRepository.agregateBetweenDatesByTag(chatId, monthStart.unix(), currDate.unix())
  }
}