import { HStack, IconButton, Input, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { QueryResultComponent } from '../lib/components/QueryResult'
import { useQuestions } from '../lib/hooks/useQuestions'
import { ApiResponse, QueryResult } from '../lib/types'

const client = axios.create({
  baseURL: 'https://whisper.tear.fi/api',
})

function Settings() {
  const { questions, setQuestions } = useQuestions()
  const [resultMatrixes, setResultMatrixes] = useState<QueryResult[][]>([])
  const [questionsFetchedOnce, setQuestionsFetchedOnce] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (questionsFetchedOnce || !questions.length) return

      const promises = questions.map((question) =>
        client
          .get<ApiResponse<QueryResult>>('/query', {
            params: {
              q: question,
              limit: 5,
            },
          })
          .then((res) => res.data.results)
      )

      const successes = (await Promise.allSettled(promises)).filter(
        (result) => result.status === 'fulfilled'
      ) as PromiseFulfilledResult<QueryResult[]>[]
      const results = successes.map((result) => result.value)
      setResultMatrixes(results)
      setQuestionsFetchedOnce(true)
    }
    run()
  }, [questions, questionsFetchedOnce])

  const handleEdit =
    (index: number): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const newQuestions = [...questions]
      newQuestions[index] = e.target.value
      setQuestions(newQuestions)
      refetchIndex(index)
    }

  const refetchIndex = async (index: number) => {
    const result = await client.get<ApiResponse<QueryResult>>('/query', {
      params: {
        q: questions[index],
        limit: 5,
      },
    })
    const newResultMatrixes = [...resultMatrixes]
    newResultMatrixes[index] = result.data.results
    setResultMatrixes(newResultMatrixes)
  }

  return (
    <HStack minH="100vh" p="4" bg="gray.900" alignItems="flex-start" pt="16" overflowX="auto">
      {questions.map((question, index) => (
        <VStack h="full" minW="lg">
          <Input value={question} onChange={handleEdit(index)} />
          {resultMatrixes[index] && (
            <VStack>
              {resultMatrixes[index].map((result) => (
                <QueryResultComponent key={result.id} result={result} />
              ))}
            </VStack>
          )}
        </VStack>
      ))}
      <IconButton aria-label="Go back" icon={<IoArrowBack />} as="a" href="/" position="absolute" top="4" left="4" />
    </HStack>
  )
}

export default Settings
