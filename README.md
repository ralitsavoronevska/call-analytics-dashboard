# Call Analytics Dashboard

A responsive call detail records (CDR) analytics dashboard built with React, TypeScript, and Vite. It fetches call records from an external API and provides interactive summaries, charts, and a searchable call log.

## Features

- **Five KPI cards:** total calls, successful calls, failed calls, average call duration, and total call cost (USD).
- **Call Activity Timeline:** number of calls grouped by start date.
- **Call Duration Analytics:** shortest, average, and longest call durations.
- **Call Cost Analytics:** total call cost by city (top 10) and average cost per call.
- **Calls by City:** call counts by city (top 10).
- **Call Records:** searchable, filterable, paginated table with call details and USD-formatted costs.
- **Data states:** loading, error handling, and retry functionality.
- **Responsive design:** desktop, tablet, and mobile layouts, including horizontal scrolling for the call records table on smaller screens.

The dashboard metrics and charts update based on the active search and filters.

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui components
- Recharts
- External CDR API (MockAPI)

## Getting started

### Prerequisites

- Node.js and npm compatible with the Vite version specified in `package.json`

### Install and run

```bash
npm ci
npm run dev
```

Open the local URL displayed by Vite (usually `http://localhost:5173/`).

### Quality checks and production build

```bash
npm run lint
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Data source

Call records are retrieved by `src/services/cdr.service.ts`, with request state and retry logic managed by `src/hooks/useCallRecords.ts`.

The external API must be reachable from the browser and allow cross-origin requests (CORS). If the API is unavailable, the dashboard displays an error state with a retry action. Do not put private API credentials in client-side source code or Vite environment variables exposed to the browser.

## Screenshots

Responsive screenshots have been captured for desktop, tablet, and mobile. Add the selected image files to `docs/screenshots/` and insert their relative Markdown links here before submission.

<!-- Example after adding a screenshot:
![Call Analytics Dashboard — desktop](docs/screenshots/desktop.png)
-->

## Deployment

**Target platform:** Vercel (deployment pending).

For a Vercel deployment, import the GitHub repository, use the Vite framework preset, and deploy the production build. Verify that the deployed application loads call records successfully.

**Live URL:** To be added after deployment.

## Repository

[GitHub — call-analytics-dashboard](https://github.com/ralitsavoronevska/call-analytics-dashboard)

## Notes

Call costs are displayed in USD as specified in the assignment. The dashboard visualizes the records returned by the configured API; the accuracy of its metrics depends on the underlying dataset.
