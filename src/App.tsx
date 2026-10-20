import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useCallRecords } from "@/hooks/useCallRecords"
import type { CallRecord } from "@/types/cdr"

import { ChevronDown } from "lucide-react"

const PAGE_SIZE = 10

const numberFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 2,
})

function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

function formatDate(value: string): string {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      })
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}m ${remainingSeconds}s`
}

function calculateMetrics(records: CallRecord[]) {
  const totalCalls = records.length

  const successfulCalls = records.filter(
    (record) => record.callStatus,
  ).length

  const totalDuration = records.reduce(
    (sum, record) => sum + record.callDuration,
    0,
  )

  const totalCost = records.reduce(
    (sum, record) => sum + (Number(record.callCost) || 0),
    0,
  )

  return {
    totalCalls,
    successfulCalls,
    successRate:
      totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0,
    averageDuration:
      totalCalls > 0 ? totalDuration / totalCalls : 0,
    totalCost,
  }
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </article>
  )
}

function App() {
  const { data, loading, error, retry } = useCallRecords()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [directionFilter, setDirectionFilter] = useState("all")
  const [page, setPage] = useState(1)

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase()

    return data.filter((record) => {
      const matchesSearch =
        !query ||
        [
          record.callerName,
          record.callerNumber,
          record.receiverNumber,
          record.city,
        ].some((value) => value.toLowerCase().includes(query))

      const matchesStatus =
        statusFilter === "all" ||
        String(record.callStatus) === statusFilter

      const matchesDirection =
        directionFilter === "all" ||
        String(record.callDirection) === directionFilter

      return matchesSearch && matchesStatus && matchesDirection
    })
  }, [data, search, statusFilter, directionFilter])

  const metrics = useMemo(
    () => calculateMetrics(filteredRecords),
    [filteredRecords],
  )

  const chartData = useMemo(() => {
    const grouped = new Map<string, number>()

    for (const record of filteredRecords) {
      const date = new Date(record.callStartTime)

      if (Number.isNaN(date.getTime())) continue

      const day = date.toISOString().slice(0, 10)

      grouped.set(day, (grouped.get(day) ?? 0) + 1)
    }

    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, calls]) => ({ date, calls }))
  }, [filteredRecords])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / PAGE_SIZE),
  )

  const currentPage = Math.min(page, totalPages)

  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const resetPage = () => setPage(1)

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Analytics Overview
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Call Analytics Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Explore call records, performance metrics and trends.
            </p>
          </div>

          <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
            CDR Analytics
          </span>
        </header>

        {loading ? (
          <div
            role="status"
            className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-300"
          >
            Loading call records...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
          >
            <h2 className="font-semibold">Unable to load call records</h2>
            <p className="mt-2 text-sm">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <section
              aria-label="Call filters"
              className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-3"
            >
              <div>
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Search records
                </label>

                <input
                  id="search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    resetPage()
                  }}
                  placeholder="Name, number or city..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Call status
                </label>

                <div className="relative">
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value)
                      resetPage()
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 pr-10 text-white"
                  >
                    <option value="all">All statuses</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="direction"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Call direction
                </label>

                <div className="relative">
                  <select
                    id="direction"
                    value={directionFilter}
                    onChange={(event) => {
                      setDirectionFilter(event.target.value)
                      resetPage()
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 pr-10 text-white"
                  >
                    <option value="all">All directions</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </section>

            <section
              aria-label="Key performance indicators"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <StatCard
                title="Total Calls"
                value={formatNumber(metrics.totalCalls)}
                description="Records matching filters"
              />

              <StatCard
                title="Successful Calls"
                value={formatNumber(metrics.successfulCalls)}
                description={`${metrics.successRate.toFixed(1)}% success rate`}
              />

              <StatCard
                title="Average Duration"
                value={formatDuration(metrics.averageDuration)}
                description="Average duration per call"
              />

              <StatCard
                title="Total Cost"
                value={formatNumber(metrics.totalCost)}
                description="Sum of reported call costs"
              />
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Call Volume</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Number of calls grouped by start date
                </p>
              </div>

              {chartData.length === 0 ? (
                <p className="py-12 text-center text-slate-400">
                  No chart data available.
                </p>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                      <CartesianGrid
                        stroke="#334155"
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        stroke="#94a3b8"
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          color: "#f8fafc",
                        }}
                      />

                      <Bar
                        dataKey="calls"
                        fill="#10b981"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
                <div>
                  <h2 className="text-lg font-semibold">Call Records</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {filteredRecords.length} matching records
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-237.5 text-left text-sm">
                  <thead className="bg-slate-800/70 text-xs uppercase text-slate-400">
                    <tr>
                      <th scope="col" className="px-5 py-4">Caller</th>
                      <th scope="col" className="px-5 py-4">Receiver</th>
                      <th scope="col" className="px-5 py-4">City</th>
                      <th scope="col" className="px-5 py-4">Start Time</th>
                      <th scope="col" className="px-5 py-4">Duration</th>
                      <th scope="col" className="px-5 py-4">Status</th>
                      <th scope="col" className="px-5 py-4">Cost</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {visibleRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="transition-colors hover:bg-slate-800/50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {record.callerName}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {record.callerNumber}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {record.receiverNumber}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {record.city}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {formatDate(record.callStartTime)}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {formatDuration(record.callDuration)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={
                              record.callStatus
                                ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                                : "rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400"
                            }
                          >
                            {String(record.callStatus)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {record.callCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {visibleRecords.length === 0 && (
                  <p className="p-10 text-center text-slate-400">
                    No records match your filters.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default App
