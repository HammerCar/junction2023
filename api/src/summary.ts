import { ChatOpenAI } from "langchain/chat_models/openai"
import { HumanMessage, SystemMessage } from "langchain/schema"

const model = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

export default async function summarize(text: string) {
  const res = await model.predictMessages([
    new SystemMessage(
      "Your job is to summarize articles to 2 sentences and find business leads in them using the following format:\n\nCOMPANY NAME / MONEY (if possible)\nArticle summary"
    ),
    new HumanMessage(text),
  ])

  return typeof res.content === "string" ? res.content : res.content.map((c) => c.text).join("\n")
}
