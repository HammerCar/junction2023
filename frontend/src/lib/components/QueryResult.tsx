import { Flex, Heading, Text, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { FC } from 'react'
import { QueryResult } from '../types'

export const QueryResultComponent: FC<{ result: QueryResult }> = ({ result }) => {
  return (
    <VStack flex="1" gap="4" p="4" bg="gray.800" borderRadius="md" alignItems="flex-start">
      <Flex w="full" justifyContent="space-between">
        <Heading as="h2" size="md">
          {result.title}
        </Heading>
        <Text color="gray.500">{dayjs(result.published).format('DD.MM.YYYY HH:mm')}</Text>
      </Flex>
      <Text color="gray.500">
        score:{' '}
        <Text as="span" color="yellow.100">
          {Math.round(result.score)}
        </Text>
        <Text>{result.textPreview}</Text>
      </Text>
    </VStack>
  )
}
