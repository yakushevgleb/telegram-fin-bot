import { Collection, Db } from "mongodb";
import { Message } from "../schemas/message";
import { AggregationSumByTagItem, MessagesRepository } from "./MessagesRepository";

export class MessageRepositoryImpl implements MessagesRepository {
  private readonly db: Db
  private readonly messagesCollection: Collection<Message>
  constructor(db: Db) {
    this.db = db;
    this.messagesCollection = db.collection('messages')
  }
  public async insertMessage(message: Message): Promise<string> {
    const result = await this.messagesCollection.insertOne(message);
    return result.insertedId;
  }

  public async deleteMessage(messageId: string): Promise<number> {
    const result = await this.messagesCollection.deleteOne({ _id: messageId })
    return result.deletedCount;
  }

  public async agregateBetweenDatesByTag(chatId: number, timestampFrom: number, timestampTo: number): Promise<AggregationSumByTagItem[]> {
    const result = await this.messagesCollection.aggregate<AggregationSumByTagItem>([
      {
        $match: {
          chatId,
          timestamp: {
            $gte: timestampFrom,
            $lte: timestampTo
          }
        }
      },
      {
        $addFields: {
          date: {
            $toDate: {
              $multiply: [
                {
                  $toDecimal: "$timestamp"
                },
                1000
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: {
            "tag": "$tag",
            "month": {
              $month: "$date"
            },
            "year": {
              $year: "$date"
            }
          },
          sum: {
            $sum: "$expense"
          }
        }
      },
      {
        $project: {
          _id: "$_id.tag",
          month: "$_id.month",
          year: "$_id.year",
          sum: "$sum"
        }
      },
      {
        $sort: {
          "year": 1,
          "month": 1,
          "sum": -1
        }
      }
    ])
    const aggregationArray = await result.toArray()
    return aggregationArray;
  }
}