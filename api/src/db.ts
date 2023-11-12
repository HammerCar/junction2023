import { DataType, FieldType, MilvusClient } from "@zilliz/milvus2-sdk-node"

const address = process.env.MILVUS_ADDRESS || "localhost:19530"

// connect to milvus
const client = new MilvusClient({ address })

// define schema
const collection_name = "store_news"
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
    dim: 768,
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

  await client.loadCollectionSync({
    collection_name,
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

export const insertDb = async (data: InsertData) => {
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

export const queryEmbeddingDb = async (embedding: number[], limit: number = 100) => {
  const res = await client.search({
    collection_name,
    vector: embedding,
    //filter: "height > 0",
    params: { nprobe: 64 },
    limit,
    metric_type: "L2",
    output_fields: ["title", "text", "source", "scraper", "published"],
  })

  return res
}

export const queryIdDb = async (id: string) => {
  const res = await client.get({
    collection_name,
    ids: [id],
    output_fields: ["title", "text", "source", "scraper", "published"],
  })

  /*const res = await client.search({
    collection_name,
    filter: "id = " + id,
    params: { nprobe: 64 },
    limit: 1,
    metric_type: "L2",
    //output_fields: ["height", "name"],
  })*/

  return res
}
