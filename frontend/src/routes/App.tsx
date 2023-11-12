import { Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import '../index.css'
import { useQuestions } from '../lib/hooks/useQuestions'
import { ApiResponse, QueryResult, SingleApiResponse } from '../lib/types'

const client = axios.create({
  baseURL: 'https://whisper.tear.fi/api',
})

type SummaryLink = {
  id: string
  summary: string
  date: number
}

function App() {
  const { questions } = useQuestions()
  const [results, setResults] = useState<SummaryLink[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)

      const promises = questions.map((question) =>
        client
          .get<ApiResponse<QueryResult>>('/query', {
            params: {
              q: question,
              limit: 2,
            },
          })
          .then((res) => res.data.results)
      )

      const successes = (await Promise.allSettled(promises)).filter(
        (result) => result.status === 'fulfilled'
      ) as PromiseFulfilledResult<QueryResult[]>[]
      const results = successes.map((result) => result.value).flat()

      const uniqueResults = results.reduce((acc, result) => {
        if (!acc.some((accResult) => accResult.id === result.id)) {
          acc.push(result)
        }
        return acc
      }, [] as QueryResult[])

      const summaryPromises = uniqueResults.map((result) =>
        client
          .get<SingleApiResponse<string>>('/summarize', {
            params: {
              text: result.text,
            },
          })
          .then((res) => res.data.result)
      )

      const summarySuccesses = await Promise.allSettled(summaryPromises)
      const summaries: SummaryLink[] = []

      for (let i = 0; i < summarySuccesses.length; i++) {
        const summarySuccess = summarySuccesses[i]
        if (summarySuccess.status === 'fulfilled' && summarySuccess.value.split('\n')[0]?.split('/')?.length === 2) {
          summaries.push({
            id: uniqueResults[i].id,
            date: uniqueResults[i].published,
            summary: summarySuccess.value,
          })
        }
      }

      setResults(summaries)
      setLoading(false)
    }
    run()
  }, [questions])

  useEffect(() => {
    const loadingStrings = [
      'Visiting the void',
      'Tickling the interwebs',
      'Making the hamsters run',
      'Dustin off the cobwebs',
      'Sharpening the scrapers',
    ]

    let loadingString = loadingStrings[Math.floor(Math.random() * loadingStrings.length)]

    const interval = setInterval(() => {
      setLoadingText((loadingText) => {
        if (loadingText.split('.').length > 3) {
          return loadingString
        }
        return `${loadingText}.`
      })
    }, 500)

    const stringInterval = setInterval(() => {
      loadingString = loadingStrings[Math.floor(Math.random() * loadingStrings.length)]
    }, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(stringInterval)
    }
  }, [])

  return (
    <VStack w="100vw" minH="100vh" bg="gray.900" justifyContent="center" overflowX="hidden">
      {loading ? (
        <Text color="gray.200">{loadingText}</Text>
      ) : (
        <>
          <Heading color="gray.200" size="lg" my="8" textAlign="center">
            <Text color="yellow.100" as="span">
              Welcome!
            </Text>
            <br />
            Here is a quick summary of {results.length} potential leads
          </Heading>
          {results.map((result) => (
            <VStack
              key={result.id}
              color="gray.200"
              p="4"
              whiteSpace="pre-wrap"
              as="a"
              href={`/${result.id}`}
              maxW="xl"
            >
              {result.summary.split('\n').map((line) =>
                line.split('/').length === 2 ? (
                  <Flex key={line} w="full" justifyContent="space-between" wrap="wrap-reverse">
                    <Text color="yellow.100" as="span" fontSize="large">
                      {line.split('/')[0]}{' '}
                      <Text as="span" color="gray.200" fontSize="medium" fontFamily="monospace" fontWeight="bold">
                        {line.split('/')[1]}
                      </Text>
                    </Text>
                    <Text color="gray.500" minW="16ch">
                      {dayjs(result.date * 1000).format('DD.MM.YYYY HH:mm')}
                    </Text>
                  </Flex>
                ) : (
                  <Text key={line} as="span">
                    {line}
                  </Text>
                )
              )}
            </VStack>
          ))}
        </>
      )}

      <IconButton
        aria-label="Settings"
        icon={<IoSettingsOutline />}
        colorScheme="gray"
        variant="ghost"
        size="lg"
        position="absolute"
        top="4"
        right="4"
        as="a"
        href="/settings"
      />
    </VStack>
  )
}

export default App
