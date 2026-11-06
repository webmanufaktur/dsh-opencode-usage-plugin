window.__ModuleLoader__.load({
  id: '@local/opencode-usage',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'opencode-usage'
    const ROUTE = 'api/opencode.usage'
    const RANGES = ['7', '30', '90', 'all']

    const EN = {
      nav: 'OpenCode usage',
      title: 'OpenCode Usage',
      intro: 'Sessions, tokens, and cost from the opencode CLI running on this machine.',
      range7: '7 days',
      range30: '30 days',
      range90: '90 days',
      rangeAll: 'All time',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      loading: 'Reading usage from opencode…',
      loadFailed: 'Could not read opencode usage',
      retry: 'Try again',
      sessions: 'Sessions',
      prompts: 'Prompts',
      steps: 'Steps',
      stepsLower: 'steps',
      subagents: 'Subagents',
      tokens: 'Tokens',
      cost: 'Est. cost',
      tokenBreakdown: 'Token breakdown',
      total: 'total',
      cacheRead: 'Cache read',
      cacheShort: 'Cache',
      cacheWrite: 'Cache write',
      input: 'Input',
      output: 'Output',
      reasoning: 'Reasoning',
      tools: 'Tool reliability',
      calls: 'Calls',
      failed: 'Failed',
      callsLower: 'calls',
      failedLower: 'failed',
      p50: 'p50',
      noTools: 'No tool calls recorded for this range.',
      models: 'Models',
      modelsLower: 'models',
      oneModel: 'model',
      model: 'Model',
      modelCost: 'Cost',
      moreModels: '+{count} more',
      noModels: 'No model activity recorded for this range.',
      empty: 'No opencode usage recorded for this range.',
      updated: 'Updated {time} · {source}',
      rangeDays: 'Last {days} days',
      lifetime: 'Lifetime',
      costEstimate: 'Published rates',
    }

    const DE = {
      nav: 'OpenCode usage',
      title: 'OpenCode Usage',
      intro: 'Sitzungen, Tokens und Kosten aus der opencode-CLI auf diesem Rechner.',
      range7: '7 Tage',
      range30: '30 Tage',
      range90: '90 Tage',
      rangeAll: 'Gesamt',
      refresh: 'Aktualisieren',
      refreshing: 'Wird aktualisiert…',
      loading: 'opencode-Nutzung wird gelesen…',
      loadFailed: 'opencode-Nutzung konnte nicht gelesen werden',
      retry: 'Erneut versuchen',
      sessions: 'Sitzungen',
      prompts: 'Prompts',
      steps: 'Schritte',
      stepsLower: 'Schritte',
      subagents: 'Subagenten',
      tokens: 'Tokens',
      cost: 'Gesch. Kosten',
      tokenBreakdown: 'Token-Aufteilung',
      total: 'gesamt',
      cacheRead: 'Cache-Lesen',
      cacheShort: 'Cache',
      cacheWrite: 'Cache-Schreiben',
      input: 'Eingabe',
      output: 'Ausgabe',
      reasoning: 'Reasoning',
      tools: 'Tool-Zuverlässigkeit',
      calls: 'Aufrufe',
      failed: 'Fehlgeschlagen',
      callsLower: 'Aufrufe',
      failedLower: 'fehlgeschlagen',
      p50: 'p50',
      noTools: 'Keine Tool-Aufrufe in diesem Zeitraum.',
      models: 'Modelle',
      modelsLower: 'Modelle',
      oneModel: 'Modell',
      model: 'Modell',
      modelCost: 'Kosten',
      moreModels: '+{count} weitere',
      noModels: 'Keine Modell-Aktivität in diesem Zeitraum.',
      empty: 'Keine opencode-Nutzung in diesem Zeitraum.',
      updated: 'Aktualisiert {time} · {source}',
      rangeDays: 'Letzte {days} Tage',
      lifetime: 'Gesamt',
      costEstimate: 'Laut Preisliste',
    }

    const CSS = `
.ocu-section{max-width:720px;display:flex;flex-direction:column;gap:12px;color:var(--dsw-alias-label-primary)}
.ocu-title{margin:0;font-size:16px;font-weight:500;line-height:24px}
.ocu-intro{margin:0;font-size:14px;line-height:22px;color:var(--dsw-alias-label-tertiary)}
.ocu-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px}
.ocu-ranges{display:inline-flex;gap:2px;padding:2px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md)}
.ocu-range{height:28px;padding:0 10px;border:none;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.ocu-range:hover{background:var(--dsw-alias-interactive-bg-hover)}
.ocu-range[aria-pressed="true"]{background:var(--dsw-alias-interactive-bg-hover-solid,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-label-primary);font-weight:500}
.ocu-spacer{flex:1}
.ocu-secondary{box-sizing:border-box;height:28px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.ocu-secondary:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.ocu-secondary:disabled{opacity:.5;cursor:default}
.ocu-secondary:focus-visible,.ocu-range:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-brand-primary))}
.ocu-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.ocu-tile{display:flex;flex-direction:column;gap:2px;padding:12px 14px;border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill)}
.ocu-tileLabel{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.ocu-tileValue{font-size:22px;line-height:30px;font-weight:600;font-variant-numeric:tabular-nums}
.ocu-tileMeta{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}
.ocu-card{display:flex;flex-direction:column;gap:10px;padding:12px 14px;border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill)}
.ocu-cardHead{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.ocu-cardTitle{font-size:14px;font-weight:500;line-height:22px}
.ocu-muted{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.ocu-bar{display:flex;height:8px;border-radius:999px;overflow:hidden;background:var(--dsw-alias-bg-layer-2)}
.ocu-bar span{display:block;height:100%}
.ocu-legend{display:flex;flex-wrap:wrap;gap:6px 14px}
.ocu-legendItem{display:inline-flex;align-items:center;gap:6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.ocu-dot{width:8px;height:8px;border-radius:50%;flex:none}
.ocu-table{width:100%;border-collapse:collapse;font-size:13px;line-height:20px}
.ocu-table th{padding:0 0 6px;text-align:left;font-size:12px;font-weight:500;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.ocu-table td{padding:6px 0;border-top:.5px solid var(--dsw-alias-border-l2);font-variant-numeric:tabular-nums}
.ocu-table th:not(:first-child),.ocu-table td:not(:first-child){text-align:right}
.ocu-tool{font-family:var(--ds-font-family-code,ui-monospace,monospace);font-size:12px}
.ocu-modelCell{display:flex;flex-direction:column;gap:1px}
.ocu-modelName{font-family:var(--ds-font-family-code,ui-monospace,monospace);font-size:12px}
.ocu-modelMeta{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}
.ocu-ok{color:var(--dsw-alias-state-success-primary)}
.ocu-bad{color:var(--dsw-alias-state-error-primary)}
.ocu-foot{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.ocu-error{margin:0;font-size:13px;line-height:20px;color:var(--dsw-alias-state-error-primary)}
@media (max-width:640px){.ocu-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`

    const integer = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

    function compact(value) {
      const n = Number(value) || 0
      if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
      if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
      if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
      return String(Math.round(n))
    }

    function money(value) {
      const n = Number(value) || 0
      return `$${n.toFixed(2)}`
    }

    function timeOf(timestamp) {
      if (!timestamp) return '—'
      return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }

    function dateOf(timestamp) {
      if (!timestamp) return '—'
      return new Date(timestamp).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    }

    async function readUsage(range, fresh, signal) {
      const query = `range=${encodeURIComponent(range)}${fresh ? '&fresh=1' : ''}`
      const response = await fetch(`${ROUTE}?${query}`, {
        signal,
        headers: { accept: 'application/json' },
        cache: 'no-store',
      })
      const text = await response.text()
      let body
      try {
        body = JSON.parse(text)
      } catch {
        throw new Error(response.ok ? 'Unexpected response' : `HTTP ${response.status}`)
      }
      if (!response.ok || body === null || body.ok === false) {
        throw new Error(body !== null && typeof body.error === 'string' ? body.error : `HTTP ${response.status}`)
      }
      return body
    }

    function Tile(props) {
      return h('div', { className: 'ocu-tile' },
        h('span', { className: 'ocu-tileLabel' }, props.label),
        h('span', { className: 'ocu-tileValue' }, props.value),
        props.meta ? h('span', { className: 'ocu-tileMeta' }, props.meta) : null,
      )
    }

    function TokenCard(props) {
      const { t, data } = props
      const { tokens } = data
      if (!tokens.total) return null
      const parts = [
        { key: 'cacheRead', value: tokens.cacheRead, color: 'var(--dsw-alias-state-idle-primary)' },
        { key: 'input', value: tokens.input, color: 'var(--dsw-alias-brand-primary)' },
        { key: 'output', value: tokens.output, color: 'var(--dsw-alias-state-success-primary)' },
        { key: 'reasoning', value: tokens.reasoning, color: 'var(--dsw-alias-state-warn-primary)' },
      ].filter((part) => part.value > 0)
      return h('div', { className: 'ocu-card' },
        h('div', { className: 'ocu-cardHead' },
          h('span', { className: 'ocu-cardTitle' }, t('tokenBreakdown')),
          h('span', { className: 'ocu-muted' }, `${compact(tokens.total)} ${t('total')}`),
        ),
        h('div', {
          className: 'ocu-bar',
          role: 'img',
          'aria-label': parts.map((part) => `${t(part.key)}: ${integer.format(part.value)}`).join(', '),
        }, parts.map((part) => h('span', {
          key: part.key,
          style: { width: `${(part.value / tokens.total) * 100}%`, background: part.color },
        }))),
        h('div', { className: 'ocu-legend' }, parts.map((part) => h('span', { key: part.key, className: 'ocu-legendItem' },
          h('span', { className: 'ocu-dot', style: { background: part.color } }),
          `${t(part.key)} ${compact(part.value)}`,
        ))),
      )
    }

    function ModelsCard(props) {
      const { t, data } = props
      const models = Array.isArray(data.models) ? data.models : []
      if (models.length === 0) return null
      const steps = models.reduce((sum, row) => sum + row.steps, 0)
      const countLabel = data.modelCount === 1 ? t('oneModel') : t('modelsLower')
      return h('div', { className: 'ocu-card' },
        h('div', { className: 'ocu-cardHead' },
          h('span', { className: 'ocu-cardTitle' }, t('models')),
          h('span', { className: 'ocu-muted' }, `${integer.format(steps)} ${t('stepsLower')} · ${integer.format(data.modelCount)} ${countLabel}`),
        ),
        h('table', { className: 'ocu-table' },
          h('thead', null, h('tr', null,
            h('th', null, t('model')),
            h('th', null, t('steps')),
            h('th', null, t('tokens')),
            h('th', null, t('modelCost')),
          )),
          h('tbody', null, models.map((row) => h('tr', { key: `${row.provider}/${row.id}/${row.variant}` },
            h('td', null, h('div', { className: 'ocu-modelCell' },
              h('span', { className: 'ocu-modelName' }, row.id),
              h('span', { className: 'ocu-modelMeta' }, [row.provider, row.variant].filter(Boolean).join(' · ')),
            )),
            h('td', null, integer.format(row.steps)),
            h('td', null, compact(row.tokens.total)),
            h('td', { className: 'ocu-muted' }, money(row.cost)),
          ))),
        ),
        data.modelCount > models.length
          ? h('p', { className: 'ocu-muted' }, t('moreModels', { count: data.modelCount - models.length }))
          : null,
      )
    }

    function ToolsCard(props) {
      const { t, data } = props
      const { tools } = data
      if (!tools.calls) return null
      return h('div', { className: 'ocu-card' },
        h('div', { className: 'ocu-cardHead' },
          h('span', { className: 'ocu-cardTitle' }, t('tools')),
          h('span', { className: 'ocu-muted' }, `${integer.format(tools.calls)} ${t('callsLower')} · ${integer.format(tools.failed)} ${t('failedLower')}`),
        ),
        tools.rows.length === 0
          ? h('p', { className: 'ocu-muted' }, t('noTools'))
          : h('table', { className: 'ocu-table' },
              h('thead', null, h('tr', null,
                h('th', null, 'Tool'),
                h('th', null, t('calls')),
                h('th', null, t('failed')),
                h('th', null, t('p50')),
              )),
              h('tbody', null, tools.rows.map((row) => h('tr', { key: row.name },
                h('td', { className: 'ocu-tool' }, row.name),
                h('td', null, integer.format(row.calls)),
                h('td', { className: row.failed > 0 ? 'ocu-bad' : 'ocu-ok' }, integer.format(row.failed)),
                h('td', { className: 'ocu-muted' }, `${integer.format(row.durationP50)} ms`),
              ))),
            ),
      )
    }

    function UsageSection(props) {
      const t = props.t
      const [range, setRange] = React.useState('30')
      const [state, setState] = React.useState({ status: 'loading', data: null, error: null, busy: false })

      const load = React.useCallback((nextRange, fresh, signal) => {
        setState((current) => ({ ...current, status: current.data === null ? 'loading' : current.status, busy: true, error: null }))
        return readUsage(nextRange, fresh, signal).then((data) => {
          setState({ status: 'ready', data, error: null, busy: false })
        }).catch((error) => {
          if (error !== null && error.name === 'AbortError') return
          setState((current) => ({ status: current.data === null ? 'error' : 'ready', data: current.data, error: String(error.message ?? error), busy: false }))
        })
      }, [])

      React.useEffect(() => {
        const controller = new AbortController()
        load(range, false, controller.signal)
        return () => controller.abort()
      }, [range, load])

      const refresh = () => {
        const controller = new AbortController()
        load(range, true, controller.signal)
      }

      const data = state.data
      const rangeLabel = range === 'all' ? t('lifetime') : t('rangeDays', { days: range })

      return h('div', { className: 'ocu-section' },
        h('style', null, CSS),
        h('h2', { className: 'ocu-title' }, t('title')),
        h('p', { className: 'ocu-intro' }, t('intro')),
        h('div', { className: 'ocu-toolbar' },
          h('div', { className: 'ocu-ranges', role: 'group', 'aria-label': t('title') }, RANGES.map((value) => h('button', {
            key: value,
            type: 'button',
            className: 'ocu-range',
            'aria-pressed': range === value ? 'true' : 'false',
            onClick: () => setRange(value),
          }, value === 'all' ? t('rangeAll') : t(`range${value}`)))),
          h('span', { className: 'ocu-spacer' }),
          h('button', {
            type: 'button',
            className: 'ocu-secondary',
            disabled: state.busy,
            onClick: refresh,
          }, state.busy ? t('refreshing') : t('refresh')),
        ),
        state.status === 'error' && data === null
          ? h(React.Fragment, null,
              h('p', { className: 'ocu-error' }, `${t('loadFailed')}: ${state.error}`),
              h('div', null, h('button', { type: 'button', className: 'ocu-secondary', onClick: refresh }, t('retry'))),
            )
          : data === null
            ? h('p', { className: 'ocu-muted' }, t('loading'))
            : h(React.Fragment, null,
                state.error !== null
                  ? h('p', { className: 'ocu-error' }, `${t('loadFailed')}: ${state.error}`)
                  : null,
                data.sessions === 0 && data.tokens.total === 0 && data.tools.calls === 0
                  ? h('p', { className: 'ocu-muted' }, t('empty'))
                  : h(React.Fragment, null,
                      h('div', { className: 'ocu-grid' },
                        h(Tile, { label: t('sessions'), value: integer.format(data.sessions), meta: `${t('subagents')} ${integer.format(data.subagents)}` }),
                        h(Tile, { label: t('prompts'), value: integer.format(data.prompts), meta: `${t('steps')} ${integer.format(data.steps)}` }),
                        h(Tile, { label: t('tokens'), value: compact(data.tokens.total), meta: `${t('cacheShort')} ${compact(data.tokens.cacheRead)}` }),
                        h(Tile, { label: t('cost'), value: money(data.cost), meta: t('costEstimate') }),
                      ),
                      h(TokenCard, { t, data }),
                      h(ModelsCard, { t, data }),
                      h(ToolsCard, { t, data }),
                    ),
                h('p', { className: 'ocu-foot' },
                  t('updated', {
                    time: timeOf(data.fetchedAt),
                    source: `${rangeLabel} · ${dateOf(data.from)} – ${dateOf(data.to)}`,
                  })),
              ),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en: EN, de: DE }), 'opencode-usage: dictionaries')
        const t = ctx.locale.bind(NS)
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'opencode-usage',
          order: 55,
          locale: NS,
          label: () => t('nav'),
        }, () => h(UsageSection, { t })))
      },
    }
  },
})
