import { Pipeline, env, pipeline } from "@xenova/transformers"

if (process.env.NODE_ENV === "production") {
  // Specify a custom location for models (defaults to '/models/').
  env.localModelPath = "/models/"

  // Disable the loading of remote models from the Hugging Face Hub:
  env.allowRemoteModels = false

  // Set location of .wasm files. Defaults to use a CDN.
  //env.backends.onnx.wasm.wasmPaths = "/path/to/files/"
}

let extractor: Pipeline | null = null

const init = async () => {
  extractor = await pipeline("feature-extraction", "Xenova/bge-base-en-v1.5")
}
init()

export default async function embedText(text: string) {
  if (!extractor) {
    throw new Error("extractor not initialized")
  }

  return Object.values<number>((await extractor(text, { pooling: "mean", normalize: true })).data)
}
