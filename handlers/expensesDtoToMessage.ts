import dayjs from "dayjs";
import { AggregationSumByTagItem } from "../repositories/MessagesRepository";

export default function (expenses: AggregationSumByTagItem[]): string {
  const replyObj = expenses.reduce((accum: Record<string, Record<string, number>>, curr) => {
    const monthName = dayjs(String(curr.month), 'M').format('MMMM')
    const monthKey = `${monthName} - ${curr.year}`
    return {
      ...accum,
      [monthKey]: {
        ...accum[monthKey],
        [curr._id]: Math.round(curr.sum),
        sum: Math.round((accum[monthKey]?.sum || 0) + curr.sum)
      }
    }
  }, {})
  const replyMsg = Object.entries(replyObj).map(([key, { sum, ...value}]) => {
    return `${key}: ${sum}\n\n${Object.entries(value).map(([tag, expense]) => `${tag}: ${expense}`).join("\n")}`
  }).join("\n\n")
  return replyMsg;
}