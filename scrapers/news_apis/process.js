import d from "dayjs"
import fs from "fs/promises"

/* 

  title: z.string(),
  text: z.string(),
  source: z.string(),
  scraper: z.string(),
  published: z.number().int().min(0), // Unix timestamp in seconds

*/

const fields = {
  title: ["title"],
  text: ["body", "text", "content"],
  source: ["url", "link"],
  published: ["publish_date", "pubDate", "dateTimePub"],
}

const articles = []

const main = async () => {
  const jsons = (await fs.readdir("./")).filter((file) => file.endsWith(".json") && !file.startsWith("package"))

  for (const json of jsons) {
    // Find the correct fields for this json
    const data = JSON.parse(await fs.readFile(json))
    const example = data[0]

    const currentFieldNames = Object.entries(fields).reduce((acc, [key, value]) => {
      acc[key] = value.find((field) => field in example)
      return acc
    }, {})

    for (const article of data) {
      const newArticle = {
        scraper: json.replace(".json", "").split("_")[0],
      }

      for (const [key, value] of Object.entries(currentFieldNames)) {
        newArticle[key] = article[value]
      }

      newArticle.published = d(newArticle.published).unix()

      articles.push(newArticle)
    }
  }

  console.log("Total articles:", articles.length)

  await fs.writeFile("./news.json", JSON.stringify(articles, null, 2))
}

main()
