import { env, pipeline } from "@xenova/transformers"

if (process.env.NODE_ENV === "production") {
  env.localModelPath = "/models/"
  env.allowRemoteModels = false
}

process.on("message", async (msg) => {
  const summarization = await pipeline("summarization", "Xenova/distilbart-cnn-6-6")

  const summary = (await summarization(msg))[0].summary_text as string
  process.send?.(summary)

  process.exit()
})
