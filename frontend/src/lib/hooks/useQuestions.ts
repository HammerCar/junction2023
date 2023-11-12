import { useEffect, useState } from 'react'

export const baseQuestions = [
  'bridge construction projects',
  'company starts building',
  'Awarded infrastructure projects',
  'Automotive manufacturers growing',
  'large construction projects',
  'public construction project competition',
]
export const useQuestions = () => {
  const [questions, setQuestions] = useState<string[]>([])

  const handleSetQuestions = (newQuestions: string[]) => {
    localStorage.setItem('questions', JSON.stringify(newQuestions))
    setQuestions(newQuestions)
  }

  useEffect(() => {
    const questions = localStorage.getItem('questions')
    if (questions) {
      setQuestions(JSON.parse(questions))
    } else {
      handleSetQuestions(baseQuestions)
    }
  }, [])

  return {
    questions,
    setQuestions: handleSetQuestions,
  }
}
