export type ApiResponse<T> = {
  status: 'success' | 'error'
  results: Array<T>
}

export type SingleApiResponse<T> = {
  status: 'success' | 'error'
  result: T
}

export type QueryResult = {
  score: number
  id: string
  source: string
  scraper: string
  published: number
  title: string
  text: string
}
