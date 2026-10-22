# 📊 Call Analytics Dashboard
🔗 [Vercel Live link](https://call-analytics-dashboard-xi.vercel.app/)

A responsive call detail records (CDR) analytics dashboard built with React, TypeScript, and Vite. It fetches call records from an external API and provides interactive summaries, charts, and a searchable call log.

<details>
<summary>📸 Screenshots</summary>

<br>

## 🖥️ Desktop preview:

<img src="docs/desktop.png" loading="lazy">

<table width="100%">
  <thead>
    <tr>
      <th style="text-align: center;">📱 Tablet</th>
      <th style="text-align: center;">📱 Mobile</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="50%" style="vertical-align: top;"><img src="docs/tablet.png" loading="lazy"></td>
      <td width="50%"><img src="docs/mobile.png" loading="lazy"></td>
    </tr>
  </tbody>
</table>
</details>

## Features

- ✅ **Five KPI cards:** total calls, successful calls, failed calls, average call duration, and total call cost (USD).
- ✅ **Call Activity Timeline:** number of calls grouped by start date.
- ✅ **Call Duration Analytics:** shortest, average, and longest call durations.
- ✅ **Call Cost Analytics:** total call cost by city (top 10) and average cost per call.
- ✅ **Calls by City:** call counts by city (top 10).
- ✅ **Call Records:** searchable, filterable, paginated table with call details and USD-formatted costs.
- ✅ **Data states:** loading, error handling, and retry functionality.
- ✅ **Responsive design:** desktop, tablet, and mobile layouts, including horizontal scrolling for the call records table on smaller screens.

The dashboard metrics and charts update based on the active search and filters.

## Tech stack

- ✨ React 19 and TypeScript
- ✨ Vite
- ✨ Tailwind CSS 4
- ✨ shadcn/ui components
- ✨ Recharts
- ✨ External CDR API (MockAPI)

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

The external API must be reachable from the browser and allow cross-origin requests (CORS). If the API is unavailable, the dashboard displays an error state with a retry action.

## Deployment

The application is deployed on Vercel.

**Live Demo:** [Call Analytics Dashboard](https://call-analytics-dashboard-xi.vercel.app/)

## Notes

Call costs are displayed in USD as specified in the assignment. The dashboard visualizes the records returned by the configured API; the accuracy of its metrics depends on the underlying dataset.

# 🌟 Inspiration & Credits:

- 🪄 [ChatGPT](https://chatgpt.com/)
- 🎨 [Shadcn Admin Free React Theme](https://www.shadcn.io/template/satnaing-shadcn-admin)

---

🙌 Thank you for checking out my project! More is coming 🔜.

Stay tuned 🚀 and please don't forget to give the project a star! ⭐

Made with lots of 💗, ☕, and a sprinkle of ✨ by Ralitsa Voronevska!
