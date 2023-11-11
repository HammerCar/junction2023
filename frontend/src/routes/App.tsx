import { Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true)
      fetch(`https://whisper.tear.fi/api/query?q=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results))
        .catch((err) => {
          console.error(err)
          setResults([])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [query])

  const handleUpdate: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((loadingText) => {
        if (loadingText.split('.').length > 3) {
          return 'Visiting the void'
        }
        return `${loadingText}.`
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <VStack
      sx={{
        width: '100vw',
        height: '100vh',
      }}
      bg="gray.900"
      justifyContent="center"
    >
      <HStack
        w="full"
        maxW="3xl"
        as="form"
        wrap="wrap"
        p="4"
        justifyContent="center"
        gap="4"
        onSubmit={() => {
          navigate(`/results?q=${query}`)
        }}
      >
        <Input
          placeholder="mirror mirror on the wall..."
          size="lg"
          minW="xs"
          flex={1}
          value={query}
          onChange={handleUpdate}
        />
        <Button colorScheme="yellow" size="lg" type="submit">
          Search
        </Button>
      </HStack>
      {loading ? (
        <Text color="gray.200">{loadingText}</Text>
      ) : (
        <Text color="gray.200">{results.length} results found</Text>
      )}
    </VStack>
  )
}

export default App
