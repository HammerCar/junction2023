import { pipeline } from "@xenova/transformers"
import fs from "fs/promises"

const main = async () => {
  const articles = JSON.parse(await fs.readFile("./news.json", "utf-8"))
  console.log("Loaded articles")

  const extractor = await pipeline("feature-extraction", "Xenova/bge-base-en-v1.5")
  console.log("Loaded model")

  let averageTime = 0

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]

    // Time it
    const start = Date.now()

    const output = await extractor(article.text, { pooling: "mean", normalize: true })
    article.embedding = output

    const end = Date.now()
    averageTime += end - start

    // write to file every 100 articles
    if (i % 100 === 0) {
      console.log(`Processed ${i} articles. ${Math.round(averageTime / i)}ms per article`)
      await fs.writeFile("./news-embeddings.json", JSON.stringify(articles))
    }
  }

  await fs.writeFile("./news-embeddings.json", JSON.stringify(articles))
}
main()
