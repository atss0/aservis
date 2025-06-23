"use client"

import React from "react"

import { useState, useCallback } from "react"
import type { ApiError } from "../services/apiClient"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useApi<T = any>(apiFunction: (...args: any[]) => Promise<T>): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const result = await apiFunction(...args)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (error) {
        const apiError = error as ApiError
        setState({ data: null, loading: false, error: apiError })
        return null
      }
    },
    [apiFunction],
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Specialized hook for API calls that should execute immediately
export function useApiEffect<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  dependencies: any[] = [],
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await apiFunction()
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      const apiError = error as ApiError
      setState({ data: null, loading: false, error: apiError })
    }
  }, dependencies)

  React.useEffect(() => {
    execute()
  }, [execute])

  return state
}
