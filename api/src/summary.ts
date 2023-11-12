import { Pipeline, env, pipeline } from "@xenova/transformers"

if (process.env.NODE_ENV === "production") {
  env.localModelPath = "/models/"
  env.allowRemoteModels = false
}

let summarization: Pipeline | null = null

const init = async () => {
  summarization = await pipeline("summarization", "Xenova/distilbart-cnn-6-6")
}
init()

export default async function summarize(text: string) {
  if (!summarization) {
    throw new Error("summarization not initialized")
  }

  return await summarization(text)
}
