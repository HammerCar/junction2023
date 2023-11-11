import axios from "axios"
import fs from "fs/promises"

const API_KEY = "ed7e3217-5455-40e4-a9b6-e48e575d5ec8"
const BASE_URL = "http://eventregistry.org/api/v1/article/getArticles"

const client = new axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
})

const getNews = async (query) => {
  const articles = []

  let i = 1
  const { data } = await client.get("", {
    params: { ...query, articlesPage: i },
  })

  const news = data.articles
  console.log("Total articles:", news.totalResults)
  articles.push(...news.results)
  i += 1

  while (true) {
    console.log(i)

    try {
      const { data } = await client.get("", {
        params: { ...query, articlesPage: i },
      })
      const news = data.articles

      if (news.results.length === 0) {
        break
      }

      articles.push(...news.results)

      // Save every now and then
      await writeArticles(articles)

      i += 1
    } catch (error) {
      console.log(error)
      break
    }
  }
}

const writeArticles = async (articles) => {
  // Overwrite the file if it exists, otherwise create a new one
  await fs.writeFile("./newsapiai_1.json", JSON.stringify(articles, null, 2))
}

const main = async () => {
  const data = await getNews({
    action: "getArticles",
    keyword: "construction",
    articlesCount: 100,
    articlesSortBy: "date",
    articlesSortByAsc: false,
    articlesArticleBodyLen: -1,
    resultType: "articles",
    dataType: ["news", "pr"],
    forceMaxDataTimeWindow: 31,
  })
  writeArticles(data)
}
main()
