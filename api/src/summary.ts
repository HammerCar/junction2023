import { ChatOpenAI } from "langchain/chat_models/openai"
import { HumanMessage, SystemMessage } from "langchain/schema"

const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

const cache = new Map<string, string>()

export default async function summarize(text: string) {
  if (cache.has(text)) {
    return cache.get(text)!
  }

  const res = await model.predictMessages([
    new SystemMessage(
      "Your job is to summarize articles to 2 sentences and find business leads in them using the following format:\n\nCOMPANY NAME / MONEY (if possible)\nArticle summary"
    ),
    new HumanMessage(text),
  ])

  const summary = typeof res.content === "string" ? res.content : res.content.map((c) => c.text).join("\n")
  cache.set(text, summary)

  return summary
}
