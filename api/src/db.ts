import { DataType, FieldType, MilvusClient } from "@zilliz/milvus2-sdk-node"

const address = process.env.MILVUS_ADDRESS || "localhost:19530"

// connect to milvus
const client = new MilvusClient({ address })

// define schema
const collection_name = "store"
const schema = [
  {
    name: "id",
    description: "ID field",
    data_type: DataType.Int64,
    is_primary_key: true,
    autoID: true,
  },
  {
    name: "embedding",
    description: "Vector field",
    data_type: DataType.FloatVector,
    dim: 4096,
  },
  {
    name: "title",
    data_type: DataType.VarChar,
    max_length: 512,
  },
  {
    name: "text",
    data_type: DataType.VarChar,
    max_length: 16384,
  },
  {
    name: "source",
    data_type: DataType.VarChar,
    max_length: 512,
  },
  {
    name: "scraper",
    data_type: DataType.VarChar,
    max_length: 512,
  },
  {
    name: "published",
    data_type: DataType.Int64,
  },
  {
    name: "created",
    data_type: DataType.Int64,
  },
] satisfies FieldType[]

const init = async () => {
  await client.createCollection({
    collection_name,
    fields: schema,
  })

  await client.createIndex({
    collection_name,
    field_name: "embedding",
    index_name: "embedding_index",
    index_type: "HNSW",
    params: { efConstruction: 10, M: 4 },
    metric_type: "L2",
  })
}

init()

interface InsertData {
  embedding: number[]
  title: string
  text: string
  source: string
  scraper: string
  published: Date
}

export const insert = async (data: InsertData) => {
  const fields_data = [
    {
      embedding: data.embedding,
      title: data.title,
      text: data.text,
      source: data.source,
      scraper: data.scraper,
      published: data.published.getTime(),
      created: Date.now(),
    },
  ]

  await client.insert({
    collection_name,
    fields_data,
  })
}
