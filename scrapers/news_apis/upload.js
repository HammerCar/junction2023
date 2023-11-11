import axios from "axios"
import fs from "fs/promises"

const main = async () => {
  const data = await fs.readFile("./news.json")
  const articles = JSON.parse(data)

  const client = new axios.create({
    baseURL: "http://localhost:3000",
  })

  let i = 0
  const max = articles.length

  for (const article of articles) {
    try {
      await client.post("/inlet", article)

      i += 1
      console.log(i)
      if (i % 100 === 0) {
        console.log(`${Math.round((i / max) * 100)}% (${i}/${max})}`)
      }
    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }
}

main()
