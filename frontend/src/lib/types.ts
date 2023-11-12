export type ApiResponse<T> = {
  status: 'success' | 'error'
  results: Array<T>
}

export type QueryResult = {
  score: number
  id: string
  source: string
  scraper: string
  published: number
  title: string
  textPreview: string
}
