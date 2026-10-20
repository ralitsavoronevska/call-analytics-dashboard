# Call Analytics Dashboard — Project Setup Guide

**London Success Academy | Software Development Internship | Week 2 — Assignment 2**

A React-based Call Data Records (CDR) analytics dashboard built from scratch. [Shadcn Admin](https://github.com/satnaing/shadcn-admin) is used as a visual and component reference, **not** as a starter codebase.

## 1. Technology stack

- React 19 + React DOM
- Vite 8 (React + TypeScript template; Vite 8.3.4 observed in the latest build)
- TypeScript 5.9.3
- Tailwind CSS 4 with `@tailwindcss/vite`
- shadcn/ui components (Radix UI, Nova preset, Lucide / Geist)
- Class Variance Authority (`class-variance-authority`)
- Recharts
- ESLint, CSpell
- npm and Git

Versions reflect those observed during setup. `package.json` and `package-lock.json` are the authoritative records of installed dependencies.

## 2. Check prerequisites

```bash
node -v
git --version
npm -v
```

Versions observed on the development machine during setup:

```text
Node.js v26.19.5
npm 11.7.0
Git 2.46.2 (Windows: 2.46.2.windows.1)
```

## 3. Scaffold the project

The `call-analytics-dashboard` directory was created and opened in VS Code before scaffolding. Run inside that **empty** directory:

```bash
npm create vite@latest . -- --template react-ts
```

Generator selections: React + TypeScript; ESLint rather than Oxlint; install dependencies and start immediately.

> Do not run `npm create vite@latest call-analytics-dashboard ...` from inside a directory with the same name: that creates an unwanted nested project.

## 4. Resolve the initial TypeScript dependency conflict

The scaffold initially generated this dependency-resolution error:

```text
npm ERR! ERESOLVE unable to resolve dependency tree
Found: typescript@7.0.2
typescript-eslint@8.71.2 requires typescript >=4.8.4 <6.1.0
```

In `package.json`, replace:

```json
"typescript": "~7.0.2"
```

with:

```json
"typescript": "~5.9.3"
```

Save the file, then run:

```bash
npm install
npx --no-install tsc --version
npm run build
npm run dev
```

The TypeScript check returned `Version 5.9.3`; the build succeeded and the app opened at `http://localhost:5173/`.

Avoid `--force` and `--legacy-peer-deps` when a compatible version resolves the conflict. If dependencies are missing, `npx tsc --version` can prompt to install an unrelated `tsc` package; install the project dependencies first.

## 5. Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

Add the Tailwind Vite plugin to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

For the initial Tailwind smoke test, replace the Vite starter CSS in `src/index.css` with `@import "tailwindcss";`, ensure `src/main.tsx` imports `./index.css`, and test utility classes such as `min-h-screen`, `bg-slate-950`, `text-white`, and `rounded-xl` in `src/App.tsx`. Remove the old `./App.css` import if present. The styled page and production build were verified.

**Important:** After shadcn/ui initialization, retain its generated `src/index.css` theme tokens and font configuration; do not restore the one-line smoke-test stylesheet.

## 6. Configure the `@/` import alias

```bash
npm install -D @types/node
```

Add the following within `compilerOptions` in both the root `tsconfig.json` (preserving its `files` and `references`) and `tsconfig.app.json`:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

No `baseUrl` is needed; it was removed after a TypeScript deprecation warning.

Final `vite.config.ts` configuration documented during setup:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 7. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Selections: Radix UI component library and Nova preset (Lucide / Geist).

The CLI validated Vite, Tailwind CSS v4, and the import alias; installed dependencies; generated `components.json`, `src/components/ui/button.tsx`, and `src/lib/utils.ts`; and updated `src/index.css`.

## 8. React Fast Refresh and ESLint: Button and Badge

### Original issue

The generated Button and Badge modules originally combined React component exports with Class Variance Authority configuration exports. ESLint reported:

```text
react-refresh/only-export-components
Fast refresh only works when a file only exports components.
```

For Button, the original error appeared at `src/components/ui/button.tsx` line 66. A **temporary, file-local** workaround was initially documented:

```tsx
/* eslint-disable react-refresh/only-export-components */
```

This workaround is **superseded by the final refactor** and is not the recommended final solution.

### Final Button refactor

The final project structure separates the Button component from its variants:

```text
src/components/ui/
├── button.tsx
└── button-variants.ts
```

`button-variants.ts` imports `cva` from `class-variance-authority`, defines the existing `buttonVariants = cva(...)` configuration, and exports `buttonVariants`.

`button.tsx` imports the configuration and uses it in the component:

```tsx
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button-variants"

// The existing Button implementation uses buttonVariants({ variant, size, className }).
export { Button }
```

The October 20 screenshots confirm that `button.tsx` exports `Button` only and that `button-variants.ts` contains the CVA configuration. The earlier file-local rule suppression is no longer needed; verify that the suppression comment is absent before committing.

### Final Badge refactor

The same separation was applied to Badge:

```text
src/components/ui/
├── badge.tsx
└── badge-variants.ts
```

`badge-variants.ts` defines and exports `badgeVariants` using `cva`.

`badge.tsx` imports the configuration:

```tsx
import { badgeVariants } from "./badge-variants"

// The existing Badge component retains VariantProps<typeof badgeVariants>.
export { Badge }
```

Consumers needing these utilities directly should import from `@/components/ui/button-variants` or `@/components/ui/badge-variants` as appropriate.

**Outcome:** Both components use separate variant modules rather than suppressing `react-refresh/only-export-components`. The latest `npm run lint` completed successfully.

## 9. Configure CSpell without disabling spell checking

Create `cspell.json` at the project root. Use an allowlist of genuine technical terms and ignore generated artifacts, not source code. The project configuration documented during setup is:

```json
{
  "version": "0.2",
  "language": "en",
  "words": [
    "shadcn",
    "oklch",
    "rgba",
    "fontsource",
    "Geist",
    "Lucide",
    "Radix",
    "Roboto",
    "Segoe",
    "Consolas",
    "monospace",
    "grayscale",
    "tailwindcss",
    "recharts",
    "clsx",
    "cn",
    "tsx",
    "tsconfig",
    "vite",
    "eslint",
    "cspell",
    "CDR",
    "mockapi",
    "ERESOLVE"
  ],
  "ignorePaths": [
    "node_modules/**",
    "dist/**"
  ]
}
```

Keep the actual `cspell.json` as the source of truth if the local word list has since expanded.

### JSON Schema troubleshooting

An external `$schema` reference hosted on GitHub produced a VS Code `Location is untrusted` warning. The attempted SchemaStore URL returned `Not Found`. Removing the external `$schema` declaration resolved this editor configuration issue without disabling CSpell. JSON Schema validation and spelling validation are separate mechanisms.

### Verification

A deliberately misspelled word was temporarily entered into a Markdown file. CSpell flagged it as a spelling error in the VS Code Problems panel. The temporary test text should not be retained in the committed documentation.

## 10. Install dashboard UI components

```bash
npx shadcn@latest add card badge table separator skeleton
```

The components were generated in `src/components/ui/`. A subsequent invocation skipped the five components because they already existed.

## 11. Install Recharts

```bash
npm install recharts
```

Recharts will provide dashboard visualizations.

## 12. Security audit and removal of the unnecessary shadcn CLI dependency

After installing the UI components and Recharts, `npm audit` reported **seven high-severity vulnerabilities** in transitive dependencies associated with the installed `shadcn` CLI package. The suggested `npm audit fix --force` would have introduced a breaking dependency change.

Rather than forcing the change, the dependency tree was inspected:

```bash
npm audit
npm ls shadcn
```

The CLI had already generated the needed component source files. Retaining it as a permanent project dependency was unnecessary:

```bash
npm uninstall shadcn
npm audit
npm ls shadcn
```

**Verified results:** `npm audit` reported `found 0 vulnerabilities`, and `npm ls shadcn` returned `(empty)`. Generated components remained intact, as did required runtime packages such as Radix UI and `class-variance-authority`.

Future one-off `npx shadcn@latest ...` executions can introduce new dependency changes; audit after adding components or upgrading packages.

## 13. Fix the Tailwind build after removing shadcn

The development server previously failed with:

```text
Can't resolve 'shadcn/tailwind.css' in 'src'
```

Remove this obsolete import from `src/index.css`:

```css
@import "shadcn/tailwind.css";
```

Keep the valid imports and the generated theme tokens, including:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";
```

Re-run `npm run build`. The production build subsequently succeeded. The earlier Vite error shown in a historical terminal session does not represent the latest verified build state.

## 14. Final quality assurance — October 20, 2026

Commands executed in the project root:

```bash
npm run lint
npm run build
npm audit
```

| Check | Latest observed result |
| --- | --- |
| ESLint (`npm run lint`) | Passed; no lint errors reported |
| TypeScript (`tsc -b`) | Passed as part of the build |
| Vite production build | Passed with Vite 8.3.4 |
| Modules transformed | 16 |
| Build duration | 559 ms (observed run) |
| Build output | `dist/` |
| npm security audit | `found 0 vulnerabilities` |
| CSpell | Working; detected intentional spelling errors |
| `shadcn` CLI package | Previously verified removed with `npm ls shadcn` |

The screenshot of the latest build shows the successful `tsc -b && vite build` execution and the generated production assets. The CSpell Problems count in VS Code is independent of ESLint and build status.

## 15. Git repository initialization and first commit

The October 19 check confirmed Git `2.46.2.windows.1` was installed and that the working directory was **not yet** a Git repository.

From the `call-analytics-dashboard` project root:

```bash
git init
git branch -M main
git status
```

Before staging, inspect `.gitignore` and verify that `node_modules/`, `dist/`, local secrets (`.env`, `.env.local`, and appropriate `.env.*.local` files), and other machine-specific artifacts are excluded. Inspect `git status` and staged changes before committing.

```bash
git add .
git diff --cached --stat
git diff --cached --check
git commit -m "chore: initialize call analytics dashboard"
```

Create the `call-analytics-dashboard` repository on GitHub, then use the repository URL GitHub provides:

```bash
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

**Status:** Git initialization, first commit, and remote push are planned steps, not claimed as completed.

## 16. Next development tasks

The base toolchain and UI component dependencies are installed. The next phase is the actual CDR dashboard:

1. Fetch Call Data Records from the API.
2. Define TypeScript interfaces and typed data handling.
3. Calculate KPI metrics and render summary cards.
4. Build Recharts visualizations.
5. Implement the call-log table.
6. Add loading skeletons and error/empty states.
7. Implement a responsive dashboard layout.
8. Verify functionality, linting, security, and production build.
9. Deploy to Vercel.
10. Finalize the README with project description, stack, screenshots, and live link.

CDR API specified in the project guide:

```text
https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr
```

**Deliverables:** GitHub repository, Vercel deployment, and README with project description, technology stack, screenshots, and live demo link.

**Setup status:** Configuration and latest recorded quality checks passed. Git initialization and feature implementation are the next milestones.
