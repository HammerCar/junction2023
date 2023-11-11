// A custom hook that builds on useLocation to parse

import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useQuery() {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}
