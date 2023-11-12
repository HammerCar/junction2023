import axios from "axios"
import fs from "fs/promises"

const main = async () => {
  const data = await fs.readFile("./news-embeddings.json")
  const articles = JSON.parse(data)

  const client = new axios.create({
    baseURL: "http://junction2023.tear.fi",
  })

  let i = 0
  const articlesWithoutEmbedding = articles.filter((article) => !article.embedding)
  const max = articlesWithoutEmbedding.length

  for (const article of articlesWithoutEmbedding) {
    try {
      await client.post("/api/inlet", {
        ...article,
      })

      i += 1
      if (i % 100 === 0) {
        console.log(`${Math.round((i / max) * 100)}% (${i}/${max})}`)
      }
    } catch (error) {
      console.log(error?.response?.data || error)
      console.log(error)
    }
  }
}

main()
