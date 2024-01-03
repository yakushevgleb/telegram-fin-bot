import { Message } from "../schemas/message";

export type AggregationSumByTagItem = {
  _id: string;
  month: number;
  year: number;
  sum: number;
};

export interface MessagesRepository {
  insertMessage(message: Message): Promise<string>
  deleteMessage(messageId: string): Promise<number>
  agregateBetweenDatesByTag(chatId: number, timestampFrom: number, timestampTo: number): Promise<AggregationSumByTagItem[]>
}