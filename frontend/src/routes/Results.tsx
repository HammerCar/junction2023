import { Spinner, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QueryResultComponent } from '../lib/components/QueryResult'
import { QueryResult } from '../lib/types'

function Results() {
  const { q } = useParams()
  const [results, setResults] = useState<QueryResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`https://whisper.tear.fi/api/query?q=${q}`)
      .then((res) => res.json())
      .then((data) => setResults(data.results))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [q])

  return (
    <VStack minH="100vh" p="4" boxSizing="content-box" bg="gray.900" justifyContent="flex-start" pt="16">
      {loading ? (
        <Spinner color="white" />
      ) : (
        <VStack w="full" maxW="3xl" alignItems="stretch" gap="4">
          {results.map((result) => (
            <QueryResultComponent key={result.id} result={result} />
          ))}
        </VStack>
      )}
    </VStack>
  )
}

export default Results
