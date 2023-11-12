import cors from "cors"
import "dotenv/config"
import express, { Request, Response } from "express"
import { z } from "zod"
import { insertDb, queryEmbeddingDb, queryIdDb } from "./db.js"
import embedText from "./embeddings.js"
import summarize from "./summary.js"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

const inletSchema = z.object({
  title: z.string(),
  text: z.string(),
  source: z.string(),
  scraper: z.string(),
  published: z.number().int().min(0), // Unix timestamp in seconds
  embedding: z.array(z.number()).optional(),
})

app.post("/inlet", async (req: Request, res: Response) => {
  const inlet = inletSchema.safeParse(req.body)

  if (!inlet.success) {
    return res.status(400).json({
      status: "error",
      message: inlet.error,
    })
  }

  let embedding = inlet.data.embedding
  if (!embedding) {
    try {
      embedding = await embedText(inlet.data.text)
    } catch (e) {
      console.error(e)

      res.json({
        status: "error",
        message: "Error embedding text",
      })

      return
    }
  }

  const data = {
    ...inlet.data,
    embedding,
    published: new Date(inlet.data.published * 1000),
  }

  await insertDb(data)

  res.json({
    status: "success",
  })
})

const querySchema = z.object({
  q: z.string(),
  limit: z.coerce.number().optional(),
  cutoff: z.coerce.number().optional(),
})

app.get("/query", async (req: Request, res: Response) => {
  const query = querySchema.safeParse(req.query)

  if (!query.success) {
    return res.status(400).json({
      status: "error",
      message: query.error,
    })
  }

  let embedding
  try {
    embedding = await embedText(query.data.q)
  } catch (e) {
    console.error(e)

    res.json({
      status: "error",
      message: "Error embedding text",
    })

    return
  }

  const queryResults = await queryEmbeddingDb(embedding, query.data.limit)

  if (queryResults.status.error_code !== "Success") {
    console.error(queryResults)

    res.json({
      status: "error",
      message: "Error querying database",
    })

    return
  }

  res.json({
    status: "success",
    results: queryResults.results
      .filter((r) => r.score < (query.data.cutoff || Infinity))
      .map((result) => ({
        ...result,
        published: new Date(Number(result.published)).getTime() / 1000,
      })),
  })
})

const getSchema = z.object({
  id: z.string(),
})

app.get("/get", async (req: Request, res: Response) => {
  const query = getSchema.safeParse(req.query)

  if (!query.success) {
    return res.status(400).json({
      status: "error",
      message: query.error,
    })
  }

  const queryResults = await queryIdDb(query.data.id)

  if (queryResults.status.error_code !== "Success") {
    console.error(queryResults)

    res.json({
      status: "error",
      message: "Error querying database",
    })

    return
  }

  const result = queryResults.data[0]

  res.json({
    status: "success",
    result: { ...result, published: new Date(Number(result.published)).getTime() / 1000 },
  })
})

const summarySchema = z.object({
  text: z.string(),
})

app.get("/summarize", async (req: Request, res: Response) => {
  const query = summarySchema.safeParse(req.query)

  if (!query.success) {
    return res.status(400).json({
      status: "error",
      message: query.error,
    })
  }

  const summaryResults = await summarize(query.data.text)

  if (!summaryResults) {
    console.error(summaryResults)

    res.json({
      status: "error",
      message: "Error summarizing",
    })

    return
  }

  res.json({
    status: "success",
    result: summaryResults,
  })
})
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
