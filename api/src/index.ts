import "dotenv/config"
import express, { Request, Response } from "express"
import { z } from "zod"
import { insert } from "./db"
import embedText from "./embeddings"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

const inletSchema = z.object({
  title: z.string(),
  text: z.string(),
  source: z.string(),
  scraper: z.string(),
  published: z.number().int().min(0), // Unix timestamp in seconds
})

app.post("/inlet", async (req: Request, res: Response) => {
  const inlet = inletSchema.safeParse(req.body)

  if (!inlet.success) {
    return res.status(400).json({
      status: "error",
      message: inlet.error,
    })
  }

  console.log("inlet received")

  let embedding
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

  const data = {
    ...inlet.data,
    embedding,
    published: new Date(inlet.data.published * 1000),
  }

  console.log("Insert")

  await insert(data)

  console.log("Success")

  res.json({
    status: "success",
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
