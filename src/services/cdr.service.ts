import type { CallRecordResponse } from "@/types/cdr";

const CDR_API_URL = 'https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr'

export async function getCallRecords(signal?: AbortSignal): Promise<CallRecordResponse> {
  const response = await fetch(CDR_API_URL, { signal })

  if (!response.ok) {
      throw new Error(`Failed to fetch call records ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as CallRecordResponse
}