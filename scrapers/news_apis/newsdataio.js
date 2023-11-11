import axios from "axios"
import fs from "fs/promises"

const API_KEY = "pub_32727b66da8ece52a725899e2e813d5f04e08"
const BASE_URL = "https://newsdata.io/api/1/news"

const getNews = async (query) => {
  const q = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&")

  const articles = []

  const { data, request } = await axios.get(`${BASE_URL}?${q}`)
  console.log(data)

  if (data.status === "success" && data.results) {
    articles.push(...data.results)
  }

  let nextPage = data.nextPage

  while (true) {
    console.log(nextPage)
    try {
      const { data } = await axios.get(`${BASE_URL}?${q}&page=${nextPage}`)
      if (data.status === "success" && data.results) {
        articles.push(...data.results)
        nextPage = data.nextPage
      } else {
        break
      }
    } catch (error) {
      console.log(error)
      break
    }
  }

  return articles
}

const main = async () => {
  const data = await getNews({
    q: "bridge",
    timeframe: 24,
    apikey: API_KEY,
  })

  await fs.writeFile("./newsdataio_5.json", JSON.stringify(data, null, 2))
}
main()
