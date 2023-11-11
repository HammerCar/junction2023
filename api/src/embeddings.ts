import { OllamaEmbeddings } from "langchain/embeddings/ollama"

const embeddings = new OllamaEmbeddings({
  model: "llama2", // default value
  baseUrl: "http://localhost:11434", // default value
})

export default async function embedText(text: string) {
  console.log("embedText")
  return embeddings.embedQuery(text)
}
