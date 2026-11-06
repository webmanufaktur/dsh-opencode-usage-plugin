# AGENTS.md — dsh-opencode-usage-plugin

Repository guidelines for agentic work. Workspace-wide rules live in `~/Code/AGENTS.md`;
this file only adds project-specific constraints.

## What this repository is

A DeepSeek Harness plugin bundle (`@local/opencode-usage`, row id `opencode-usage`) that
renders live `opencode stats` data as a Settings page in the Harness Web UI. Two halves:

- `index.js` — Host: authenticated route `GET /api/opencode.usage`, CLI invocation, cache.
- `client.js` — Browser: `settings.section` page, locale dictionaries, styles.

## Invariants

- **Keep the route inside the authentication fence.** Register it with
  `ctx.connection.fetch.register(...)`, never with a bare `webServer` route. The page relies on
  the browser cookie; the route must stay owner-only.
- **Keep the URL and row ids stable.** `/api/opencode.usage`, bundle id `opencode-usage`, and
  slot id `settings.section` are contracts; changing one breaks the installed profile.
- **The client fetches document-relative** (`api/opencode.usage`), matching the Harness's
  document-relative app routes. Do not switch to absolute origins.
- **No iframes, no `document.body` writes.** Render React inside the slot and scope all styles
  under the `.ocu-` prefix using `--dsw-alias-*` tokens.
- **Data comes from the CLI only.** Run `opencode stats --json`; never read opencode's SQLite
  state or scrape its UI.
- **Return curated values, not raw CLI output.** Keep the response shape small and stable;
  failures carry an explicit `{ ok: false, error }`.

## Development

- No build step and no dependencies. Both halves are plain ESM/JavaScript.
- Syntax check: `node --check index.js client.js`.
- The package is link-installed in the `desktop` profile. Edits to `client.js` reach a running
  Harness through HMR; changes to `index.js` need a Harness restart.
- Do not reinstall to "apply" edits — `install_bundle` answers `already-installed`; the link
  already points at this checkout.
- Verify the route: an unauthenticated request answers 401; an authenticated browser page
  answers 200 with real statistics. Check the browser console for slot crashes.

## Commits

- Branch `master` only.
- Imperative subject, one concern per commit; prefixes such as `feat:`, `fix:`, `docs:`.
- Never commit `node_modules/`, `.DS_Store`, or local screenshots that were not curated into
  `docs/`.

## Related

- Workspace meta layer: `~/Code/.management/` (ledger, memory, projects).
- Harness plugin authoring lives in the `cordis-plugin-development` skill.
