
import { useEffect, useState } from "react"
import { getCallRecords } from "@/services/cdr.service"
import type { CallRecord } from "@/types/cdr"

interface UseCallRecordsResult {
  data: CallRecord[]
  loading: boolean
  error: string | null
  retry: () => void
}

export function useCallRecords(
  accessToken: string | null,
): UseCallRecordsResult {
  const [data, setData] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [requestId, setRequestId] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      return
    }

    
    const controller = new AbortController()

    async function loadRecords() {
      setLoading(true)
      setError(null)

      try {
        const records = await getCallRecords(
          accessToken!,
          controller.signal,
        )

        if (!controller.signal.aborted) {
          setData(records)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred",
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadRecords()

     return () => controller.abort()
  }, [accessToken, requestId])

  const retry = () => {
    setRequestId((previous) => previous + 1)
  }

  return { data, loading, error, retry }
}
