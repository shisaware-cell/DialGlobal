# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Artifacts

### DialGlobal Web App (`artifacts/dialglobal`, port auto-assigned, path `/`)
Full React + Vite product web app. Light theme — cream bg `#FAFAF9`, white surfaces, dark `#1A1A18` text, amber `#E8A020` accent. Screens: Onboarding (3-slide globe), Auth, Dashboard (numbers + FAB), Paywall, Country Picker, Inbox/Messaging (Messages + Call Log subtabs), Settings, Profile, NumberDetail.

### DialGlobal Mobile App (`artifacts/dialglobal-app`, port 21355, path `/dialglobal-app/`)
Expo React Native app for iOS App Store and Google Play. Testable via Expo Go QR code.
- **Theme**: Light cream/amber — exactly matches reference design: bg `#F5F3EF`, surface `#FFFFFF`, raised `#EEECE8`, text `#1A1714`, textSec `#6B6560`, accent `#E8A020`
- **Navigation**: Expo Router file-based + NativeTabs (liquid glass on iOS 26+) / BlurView (light tint) fallback
- **4 Tabs**: Numbers (Dashboard with stats strip + plan banner + flat expandable rows), Inbox (Messages + Call Log tabs), Calls (log with All/Missed/Incoming/Outgoing/Voicemail filter chips), Settings
- **New screens (from Settings navigation)**: AutoReply (per-number away messages with templates), SpamBlocker (Ghost Mode + per-number DND & spam toggles + Robocall/Unknown/Intl blocking), Contacts (import from phone or CSV, selectable list), Credits (pay-as-you-go packs + rates table), ESim (regional plans + QR/manual activation flow)
- **AppContext features**: `ghostMode`, `dndNumbers`, `spamEnabled`, `autoReplies`, `contacts`, `credits` — all with handlers (setGhostMode, toggleDnd, toggleSpam, setAutoReply, importContacts, addCredits)
- **Stack screens**: Onboarding (3-slide: globe+flags, dashboard mockup, lock+privacy badges), Auth, Paywall (plan cards + HOW WE COMPARE competitor comparison table), Country Picker, Profile (real data from AppContext, Save → Supabase update, Sign Out), NumberDetail (horizontal hero header with flag+number, stats grid, quick actions Call/Message/Copy, settings toggles Voicemail/Recording/Forwarding, recent calls list, Release)
- **State**: React Context + AsyncStorage (`context/AppContext.tsx`) — fully wired to Supabase (real auth, numbers, messages, calls)
- **Data**: Real Supabase data. Mock plan data still in `data/mockData.ts`
- **Colors**: All tokens in `constants/colors.ts` — use `C.onAccent` for text/icons on amber backgrounds
- **Bundle IDs**: iOS `com.dialglobal.app`, Android `com.dialglobal.app`
- **Schema fields**: VirtualNumber uses `phone_number`, `call_count`, `sms_count`, `missed_count` (not `number`/`calls`/`sms`/`missedCalls`)
- **T003 COMPLETE**: All real auth/data wired, 5 new screens built, all schema bugs fixed
- **Dialer COMPLETE**: `app/dialer.tsx` — full phone keypad, virtual number selector, outbound call via Telnyx, in-call timer + mute/speaker, hang-up flow
- **Upgrade screen COMPLETE**: `app/upgrade.tsx` — in-app plan upgrade with billing toggle, plan cards, saves to Supabase
- **Number deletion COMPLETE**: `DELETE /numbers/:id` now releases number from Telnyx via `telnyx.phoneNumbers.delete()` before removing from DB
- **Trial expiry COMPLETE**: `GET /numbers` runs `cleanupExpiredNumbers()` which marks expired trial numbers as "expired" and releases from Telnyx; `POST /numbers/provision` accepts `trial_days` param to set `expires_at`
- **Calls route fix**: `telnyx.calls.dial()` (not `.create()`) — SDK v6.22.0 pattern
- **Picker key fix**: picker.tsx uses `${num}-${idx}` key to prevent duplicate key warning

## Backend Integration (COMPLETE)

### Supabase
- **URL**: `https://kcsldwhpwakeszbxjoaq.supabase.co`
- **Tables**: `profiles`, `virtual_numbers`, `messages`, `calls` — all exist with RLS policies
- **RPCs**: `increment_sms`, `increment_calls`, `increment_missed` — all deployed
- **Auth**: Real Supabase Auth (email/password). New users get `plan: "traveller"` profile on signup
- **Realtime**: AppContext subscribes to all 3 tables on login, unsubscribes on logout
- **Test user**: `test@dialglobal.io` / `TestPass123!`

### Telnyx
- **Connection ID**: `2919998242340996968`
- **Messaging Profile ID**: `40019d0c-8e22-4320-800d-81c7936a477e`
- Number search: `GET /api/numbers/search?country_code=XX&limit=N` — live Telnyx results
- Number provision: `POST /api/numbers/provision` — buys the number via Telnyx and writes to Supabase
- SMS send: `POST /api/messages/send` — fires Telnyx message, increments counter via RPC
- Inbound webhook: `POST /api/webhooks/telnyx` — handles `message.received`, `call.initiated`, `call.hangup`

### API Server Routes (all at `/api/*`)
- `POST /auth/signup` — creates Supabase user + profile, returns session
- `POST /auth/login` — signs in via Supabase, returns session
- `GET /auth/me` — validates token, returns user + profile
- `GET /numbers/search?country_code=XX` — searches Telnyx available numbers
- `POST /numbers/provision` — provisions number via Telnyx order, saves to DB
- `GET /numbers` — returns user's numbers from Supabase
- `DELETE /numbers/:id` — removes number from DB
- `POST /messages/send` — sends SMS via Telnyx, saves to DB
- `GET /messages` — returns user's messages
- `GET /messages/threads` — thread view via RPC fallback
- `POST /calls/initiate` — initiates call via Telnyx
- `GET /calls` — returns user's call log
- `POST /webhooks/telnyx` — inbound event handler

### DialGlobal Admin Dashboard (`artifacts/dialglobal-admin`, port 25321, path `/admin/`)
React + Vite + Tailwind + shadcn admin panel. Always dark. Sidebar navigation.
- **Pages**: Dashboard (charts, KPIs, recent signups), Users (table + search/filter), Numbers (virtual number registry), Call Logs (bar chart + log), Revenue (MRR charts, plan pie, transactions), Settings (General, Security, Notifications, Billing, Database, API)
- **Charts**: recharts (AreaChart, LineChart, BarChart, PieChart)
- **Supabase**: credentials needed — add `SUPABASE_URL` + `SUPABASE_ANON_KEY` to environment secrets

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
