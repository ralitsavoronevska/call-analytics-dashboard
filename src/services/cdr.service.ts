
import type { CallRecord, CallRecordResponse } from "@/types/cdr"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface BackendCallRecord {
  id: number
  caller_name: string
  caller_number: string
  receiver_number: string
  city: string
  call_direction: boolean
  call_status: boolean
  call_duration: number
  call_cost: string
  call_start_time: string
  call_end_time: string
}

interface PaginatedCallsResponse {
  items: BackendCallRecord[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

function mapCallRecord(record: BackendCallRecord): CallRecord {
  return {
    id: String(record.id),
    callerName: record.caller_name,
    callerNumber: record.caller_number,
    receiverNumber: record.receiver_number,
    city: record.city,
    callDirection: record.call_direction,
    callStatus: record.call_status,
    callDuration: record.call_duration,
    callCost: record.call_cost,
    callStartTime: record.call_start_time,
    callEndTime: record.call_end_time,
  }
}


export async function getCallRecords(
  token: string,
  signal?: AbortSignal,
): Promise<CallRecordResponse> {
  const PAGE_SIZE = 100
  const CONCURRENCY = 10

  async function fetchPage(
    page: number,
  ): Promise<PaginatedCallsResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/calls?page=${page}&page_size=${PAGE_SIZE}`,
      {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch page ${page}: HTTP ${response.status}`,
      )
    }

    return (await response.json()) as PaginatedCallsResponse
  }

  const firstPage = await fetchPage(1)
  const records = firstPage.items.map(mapCallRecord)

  for (
    let startPage = 2;
    startPage <= firstPage.total_pages;
    startPage += CONCURRENCY
  ) {
    const pageNumbers = Array.from(
      {
        length: Math.min(
          CONCURRENCY,
          firstPage.total_pages - startPage + 1,
        ),
      },
      (_, index) => startPage + index,
    )

    const pages = await Promise.all(
      pageNumbers.map(fetchPage),
    )

    for (const page of pages) {
      records.push(...page.items.map(mapCallRecord))
    }
  }

  return records
}
