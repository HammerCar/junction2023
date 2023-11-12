import { Flex, Heading, IconButton, Link, Skeleton, Spinner, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { QueryResult, SingleApiResponse } from '../lib/types'

const client = axios.create({
  baseURL: 'https://whisper.tear.fi/api',
})

function Article() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<QueryResult | undefined>()
  const [summary, setSummary] = useState<string | undefined>()

  useEffect(() => {
    const run = async () => {
      const result = await client.get<SingleApiResponse<QueryResult>>(`/get/?id=${id}`)
      setArticle(result.data.result)

      const summary = await client.get<SingleApiResponse<string>>('/summarize', {
        params: {
          text: result.data.result.text,
        },
      })
      setSummary(summary.data.result)
    }
    run()
  }, [id])

  return (
    <VStack maxW="100vw" minH="100vh" bg="gray.900" justifyContent="flex-start" overflowX="hidden" px="4" pt="16">
      <IconButton aria-label="Go back" icon={<IoArrowBack />} as="a" href="/" position="absolute" top="4" left="4" />
      {article ? (
        <>
          <Heading as="h1" size="2xl" color="white" textAlign="center" w="full" px="4" maxW="6xl">
            {article?.title}
          </Heading>

          <Flex w="full" maxW="3xl" px="4" wrap="wrap" justifyContent="space-between" alignItems="center">
            <Link href={article.source} color="gray.500" p="2" textDecor="underline">
              source
            </Link>
            <Text color="gray.500" minW="16ch">
              {dayjs((article?.published || 0) * 1000).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Flex>

          {summary ? (
            <Text
              whiteSpace="pre-wrap"
              fontFamily="monospace"
              color="yellow.200"
              fontWeight="bold"
              fontSize="large"
              textAlign="center"
              w="full"
              maxW="3xl"
              px="4"
              title="Summary"
            >
              {summary}
            </Text>
          ) : (
            <Skeleton w="full" maxW="3xl" px="4" h="4ch" />
          )}
          <Text whiteSpace="pre-wrap" maxW="3xl">
            {article?.text}
          </Text>
        </>
      ) : (
        <Spinner color="white" />
      )}
    </VStack>
  )
}

export default Article
