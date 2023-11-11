import axios from "axios"
import fs from "fs/promises"

const API_KEY = "56e4317a9bd34318809d455387e9367c"
const BASE_URL = "https://api.worldnewsapi.com/search-news"

const client = new axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
})

const getNews = async (query) => {
  const articles = []

  const number = 100
  let offset = 0

  const { data } = await client.get("", {
    params: { ...query, number, offset },
  })

  articles.push(...data.news)
  offset += number

  while (true) {
    console.log(offset)

    try {
      const { data } = await client.get("", {
        params: { ...query, number, offset },
      })

      if (data.news.length === 0) {
        break
      }

      articles.push(...data.news)
      offset += number
      console.log("Total articles:", data.available)
    } catch (error) {
      console.log(error)
      break
    }
  }

  return articles
}

/*
text	string	tesla	The text to match in the news content.
source-countries	string	us,uk	A comma-separated list of ISO 3166 country codes from which the news should originate.
language	string	en	The ISO 6391 language code of the news.
min-sentiment	number	-0.8	The minimal sentiment of the news in range [-1,1].
max-sentiment	number	0.8	The maximal sentiment of the news in range [-1,1].
earliest-publish-date	string	2022-04-22 16:12:35	The news must have been published after this date.
latest-publish-date	string	2022-04-22 16:12:35	The news must have been published before this date.
news-sources	string	https://www.bbc.co.uk	A comma-separated list of news sources from which the news should originate.
authors	string	John Doe	A comma-separated list of author names. Only news from any of the given authors will be returned.
entities	string	ORG:Tesla	Filter news by entities (see semantic types).
location-filter	string	51.050407, 13.737262, 100	Filter news by radius around a certain location. Format is "latitude,longitude,radius in kilometers"
sort	string	publish-time	The sorting criteria (publish-time or sentiment).
sort-direction	string	ASC	Whether to sort ascending or descending (ASC or DESC).
offset	number	0	The number of news to skip in range [0,10000]
number	number	10	The number of news to return in range [1,100]
api-key	string	abcd1234	Your API key.
*/

const main = async () => {
  const data = await getNews({
    text: "construction",
    language: "en",
    "earliest-publish-date": "2023-01-01 00:00:00",
    sort: "publish-time",
    "sort-direction": "DESC",
    "api-key": API_KEY,
  })

  await fs.writeFile("./worldnewsapi_1.json", JSON.stringify(data, null, 2))
}
main()
