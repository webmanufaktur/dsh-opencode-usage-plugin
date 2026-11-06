/**
 * Host half of the opencode-usage bundle.
 *
 * Serves one authenticated JSON endpoint, GET /api/opencode.usage, that runs
 * `opencode stats --json` and projects the result into small display values.
 * The Client half renders a Settings page from it; nothing here reaches a
 * model request or a session log.
 */
import { execFile } from 'node:child_process'
import { accessSync, constants } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/** Loader row id; also the name shown in bundle diagnostics. */
export const name = 'opencode-usage'

/** The endpoint is registered inside the connection authentication fence. */
export const inject = ['connection']

const ROUTE = '/api/opencode.usage'
const CACHE_MS = 30_000
const TIMEOUT_MS = 30_000
const MAX_BUFFER = 16 * 1024 * 1024
const TOOL_ROWS = 8
const MODEL_ROWS = 10

/** Accepted `range` query values: a day count, or `all` for lifetime. */
const RANGES = { 7: 7, 30: 30, 90: 90, all: 0 }

const cache = new Map()
const inflight = new Map()

let resolvedBinary

/** Find the opencode executable without relying on the GUI process PATH. */
function opencodeBinary() {
  if (resolvedBinary !== undefined) return resolvedBinary
  const candidates = [
    process.env.OPENCODE_BIN,
    '/opt/homebrew/bin/opencode',
    '/usr/local/bin/opencode',
    join(homedir(), '.local/bin/opencode'),
    '/usr/bin/opencode',
  ]
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || candidate.length === 0) continue
    try {
      accessSync(candidate, constants.X_OK)
      resolvedBinary = candidate
      return candidate
    } catch {
      // try the next candidate
    }
  }
  resolvedBinary = 'opencode'
  return resolvedBinary
}

/** Run `opencode stats` once and parse its JSON output. */
function runStats(args) {
  return new Promise((resolve, reject) => {
    execFile(
      opencodeBinary(),
      args,
      { timeout: TIMEOUT_MS, maxBuffer: MAX_BUFFER, env: process.env },
      (error, stdout, stderr) => {
        if (error !== null) {
          const detail = String(stderr ?? '').trim() || error.message
          const wrapped = new Error(detail)
          wrapped.code = error.code
          reject(wrapped)
          return
        }
        try {
          resolve(JSON.parse(String(stdout)))
        } catch {
          reject(new Error('opencode stats did not return JSON'))
        }
      },
    )
  })
}

function count(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/** Project the CLI payload into the values the Settings page renders. */
function project(rangeKey, raw) {
  const tokens = raw.tokens ?? {}
  const cacheTokens = tokens.cache ?? {}
  const input = count(tokens.input)
  const output = count(tokens.output)
  const reasoning = count(tokens.reasoning)
  const cacheRead = count(cacheTokens.read)
  const cacheWrite = count(cacheTokens.write)
  const tools = raw.tools ?? {}
  const usage = Array.isArray(tools.usage) ? tools.usage : []
  const rows = usage
    .filter((row) => row !== null && typeof row === 'object')
    .map((row) => ({
      name: String(row.name ?? '?'),
      calls: count(row.calls),
      failed: count(row.failed),
      durationP50: count(row.durationP50),
    }))
    .sort((left, right) => right.calls - left.calls)
    .slice(0, TOOL_ROWS)
  const rawModels = Array.isArray(raw.models) ? raw.models : []
  const models = rawModels
    .filter((row) => row !== null && typeof row === 'object')
    .map((row) => {
      const model = row.model ?? {}
      const modelTokens = row.tokens ?? {}
      const modelCache = modelTokens.cache ?? {}
      const modelIn = count(modelTokens.input)
      const modelOut = count(modelTokens.output)
      const modelReasoning = count(modelTokens.reasoning)
      const modelCacheRead = count(modelCache.read)
      return {
        provider: String(model.providerID ?? ''),
        id: String(model.id ?? '?'),
        variant: typeof model.variant === 'string' ? model.variant : '',
        steps: count(row.steps),
        tokens: {
          input: modelIn,
          output: modelOut,
          reasoning: modelReasoning,
          cacheRead: modelCacheRead,
          total: modelIn + modelOut + modelReasoning + modelCacheRead,
        },
        cost: count(row.cost),
      }
    })
    .sort((left, right) => right.steps - left.steps)
    .slice(0, MODEL_ROWS)
  return {
    ok: true,
    range: rangeKey,
    days: RANGES[rangeKey],
    from: count(raw.range?.from),
    to: count(raw.range?.to),
    sessions: count(raw.sessions),
    subagents: count(raw.subagents),
    prompts: count(raw.prompts),
    steps: count(raw.steps),
    tokens: {
      input,
      output,
      reasoning,
      cacheRead,
      cacheWrite,
      total: input + output + reasoning + cacheRead + cacheWrite,
    },
    cost: count(raw.cost),
    tools: {
      calls: count(tools.totals?.calls),
      succeeded: count(tools.totals?.succeeded),
      failed: count(tools.totals?.failed),
      rows,
    },
    models,
    modelCount: rawModels.length,
    fetchedAt: Date.now(),
  }
}

/** Return a cached snapshot, one shared in-flight read, or a fresh one. */
async function load(rangeKey, fresh) {
  const cached = cache.get(rangeKey)
  if (fresh !== true && cached !== undefined && Date.now() - cached.at < CACHE_MS) return cached.value
  const pending = inflight.get(rangeKey)
  if (pending !== undefined) return pending
  const days = RANGES[rangeKey]
  const args = days === 0
    ? ['stats', '--json', '--models', '--all']
    : ['stats', '--json', '--models', '--days', String(days)]
  const task = (async () => {
    const raw = await runStats(args)
    const value = project(rangeKey, raw)
    cache.set(rangeKey, { at: Date.now(), value })
    return value
  })()
  inflight.set(rangeKey, task)
  try {
    return await task
  } finally {
    if (inflight.get(rangeKey) === task) inflight.delete(rangeKey)
  }
}

/** Answer one authenticated GET with JSON; failures keep their reason. */
async function handle(request) {
  const url = new URL(request.url)
  const rangeKey = url.searchParams.get('range') ?? '30'
  const headers = { 'cache-control': 'no-store' }
  if (!Object.hasOwn(RANGES, rangeKey)) {
    return Response.json({ ok: false, error: `unknown range ${JSON.stringify(rangeKey)}` }, { status: 400, headers })
  }
  try {
    const value = await load(rangeKey, url.searchParams.get('fresh') === '1')
    return Response.json(value, { headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Response.json({ ok: false, error: message, code: error?.code }, { status: 502, headers })
  }
}

/**
 * Register the usage route inside the Connection authentication fence.
 * @param ctx - Host context that owns the route lifetime.
 */
export function apply(ctx) {
  ctx.effect(() =>
    ctx.connection.fetch.register({
      path: ROUTE,
      methods: ['GET'],
      requestBody: 'buffered',
      fetch: (request) => handle(request),
    }),
  )
}
