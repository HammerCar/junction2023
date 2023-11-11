import { Button, Spinner, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Results() {
  const { q } = useParams()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://api.github.com/search/repositories?q=${q}`)
      .then((res) => res.json())
      .then((data) => setResults(data.items))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <VStack minH="100vh" p="4" boxSizing="content-box" bg="gray.900" justifyContent="center">
      {loading ? (
        <Spinner color="white" />
      ) : (
        <VStack w="full" maxW="3xl" justifyContent="center" gap="4">
          {results.map((result) => (
            <Button
              as="a"
              href={result.html_url}
              target="_blank"
              rel="noopener noreferrer"
              key={result.id}
              colorScheme="blue"
              variant="outline"
              w="full"
            >
              {result.full_name}
            </Button>
          ))}
        </VStack>
      )}
    </VStack>
  )
}

export default Results
