export default interface MessageDto {
  messageId: number;
  expense: number;
  tag: string;
  chatId: number;
  timestamp: number;
  misc?: string;
}