import { HStack, IconButton, Input, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { FormEventHandler, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { QueryResultComponent } from '../lib/components/QueryResult'
import { ApiResponse, QueryResult } from '../lib/types'

const client = axios.create({
  baseURL: 'https://whisper.tear.fi/api',
})

function Search() {
  const [results, setResults] = useState<QueryResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const search = formData.get('search')
    if (!search) return

    setLoading(true)
    const result = await client.get<ApiResponse<QueryResult>>('/query', {
      params: {
        q: search,
        limit: 50,
      },
    })
    setResults(result.data.results)
    setLoading(false)
  }

  return (
    <VStack maxW="100vw" minH="100vh" bg="gray.900" justifyContent="flex-start" overflowX="hidden" px="4" pt="16">
      <HStack maxW="3xl" as="form" onSubmit={handleSubmit}>
        <Input name="search" id="search" placeholder="Search from 18k articles" />
        <IconButton
          type="submit"
          aria-label="Search"
          icon={<IoSearch />}
          colorScheme="yellow"
          disabled={loading}
          isLoading={loading}
        />
      </HStack>
      {results.map((result) => (
        <QueryResultComponent key={result.id} result={result} />
      ))}
    </VStack>
  )
}

export default Search
