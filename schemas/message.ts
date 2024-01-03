export interface Message {
  _id?: string;
  messageId: number;
  expense: number;
  tag: string;
  timestamp: number;
  misc?: string;
  chatId: number;
}