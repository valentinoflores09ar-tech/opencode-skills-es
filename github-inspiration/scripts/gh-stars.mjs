#!/usr/bin/env node
// Buscador de repositorios de GitHub por estrellas, para la skill `github-inspiration`.
// Sin dependencias: solo `fetch` global de Node 18+.
//
//   node gh-stars.mjs "react admin dashboard" [flags]      -> busca repos
//   node gh-stars.mjs --readme owner/repo [--lines 120]    -> trae el README
//   node gh-stars.mjs --tree owner/repo [--recursive]       -> lista la raíz del repo
//
// Flags de búsqueda:
//   --min-stars N        (def. 1000)
//   --max-age-years N    (def. 3; 0 = sin filtro de fecha)
//   --language LANG      (ej. TypeScript, Python, Go)
//   --limit N            (def. 10, max 50)
//   --json               salida JSON cruda
//
// Flags comunes: --help
//
// Auth opcional: define GITHUB_TOKEN o GH_TOKEN para levantar el rate limit
// (sin token: 10 busquedas/min y 60 requests/h en la API publica).

const args = process.argv.slice(2)

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(
    [
      "Uso:",
      '  node gh-stars.mjs "tema" [--min-stars 1000] [--max-age-years 3] [--language TS] [--limit 10] [--json]',
      "  node gh-stars.mjs --readme owner/repo [--lines 120]",
      "  node gh-stars.mjs --tree owner/repo [--recursive]",
      "",
      "Filtros automaticos: stars:>N, archived:false, pushed:>fecha.",
    ].join("\n"),
  )
  process.exit(args.length === 0 ? 2 : 0)
}

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ""
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "opencode-github-inspiration",
  ...(token ? { authorization: `Bearer ${token}` } : {}),
}

function value(flag, fallback) {
  const i = args.indexOf(flag)
  if (i === -1) return fallback
  const v = args[i + 1]
  return v === undefined || v.startsWith("--") ? true : v
}

async function getJSON(url) {
  const res = await fetch(url, { headers })
  const remaining = res.headers.get("x-ratelimit-remaining")
  const reset = res.headers.get("x-ratelimit-reset")
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.message) detail += ` — ${body.message}`
    } catch {}
    if (res.status === 403 || res.status === 429) {
      const mins = reset ? Math.max(1, Math.ceil((Number(reset) * 1000 - Date.now()) / 60000)) : "?"
      detail += ` | rate limit,quedan ${remaining ?? "?"},reintenta en ~${mins} min`
      if (!token) detail += " (define GITHUB_TOKEN para 30 req/min en busquedas)"
    }
    throw new Error(detail)
  }
  return { body: await res.json(), remaining }
}

async function search() {
  const query = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--min-stars" && args[args.indexOf(a) - 1] !== "--max-age-years" && args[args.indexOf(a) - 1] !== "--language" && args[args.indexOf(a) - 1] !== "--limit")
  if (!query) {
    console.error("Falta la query. Ej: node gh-stars.mjs \"react admin dashboard\"")
    process.exit(2)
  }

  const minStars = Number(value("--min-stars", 1000))
  const maxAgeYears = Number(value("--max-age-years", 3))
  const language = value("--language", null)
  const limit = Math.min(Number(value("--limit", 10)), 50)

  const terms = [query, `stars:>${minStars}`, "archived:false"]
  if (maxAgeYears > 0) {
    const d = new Date()
    d.setFullYear(d.getFullYear() - maxAgeYears)
    terms.push(`pushed:>${d.toISOString().slice(0, 10)}`)
  }
  if (language && typeof language === "string") terms.push(`language:${language}`)

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(terms.join(" "))}&sort=stars&order=desc&per_page=${limit}`
  const { body, remaining } = await getJSON(url)

  if (args.includes("--json")) {
    console.log(JSON.stringify(body, null, 2))
    return
  }

  const repos = (body.items || []).map((r) => ({
    stars: r.stargazers_count,
    repo: r.full_name,
    lang: r.language || "-",
    pushed: (r.pushed_at || "").slice(0, 10),
    license: (r.license?.spdx_id || "NOASSERTION").replace("NOASSERTION", "?"),
    url: r.html_url,
    desc: (r.description || "").replace(/\s+/g, " ").trim(),
  }))

  console.log(`query: ${terms.join(" ")}`)
  console.log(`total_count: ${body.total_count} | devueltos: ${repos.length} | rate limit restante: ${remaining}\n`)

  if (repos.length === 0) {
    console.log("Sin resultados con estos filtros. Probá: menos palabras, sin --language, o --max-age-years 0.")
    return
  }

  const w = (rows, key) => Math.max(key.length, ...rows.map((r) => String(r[key]).length))
  const cols = [
    ["STARS", (r) => String(r.stars)],
    ["REPO", (r) => r.repo],
    ["LANG", (r) => r.lang],
    ["PULSADO", (r) => r.pushed],
    ["LIC", (r) => r.license],
  ]
  const widths = cols.map(([label, get]) => w(repos, get) || label.length)

  for (const r of repos) {
    console.log(cols.map(([, get], i) => get(r).padEnd(widths[i])).join("  "))
    console.log("    " + r.url)
    if (r.desc) console.log("    " + r.desc.slice(0, 160))
  }
}

async function readme() {
  const i = args.indexOf("--readme")
  const target = args[i + 1]
  if (!target) throw new Error("--readme requiere owner/repo o owner/repo/ruta/al/README.md")
  const lines = Number(value("--lines", 120))
  const [owner, repo, ...rest] = target.split("/")
  const path = rest.length ? rest.join("/") : "README.md"

  const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`, {
    headers: { "user-agent": "opencode-github-inspiration" },
  })
  if (!res.ok) throw new Error(`README no disponible: ${res.status} ${res.statusText} (${target})`)

  const text = await res.text()
  const all = text.split(/\r?\n/)
  console.log(`${target} (primeras ${lines} lineas, de ${all.length}):\n`)
  console.log(all.slice(0, lines).join("\n"))
}

async function tree() {
  const i = args.indexOf("--tree")
  const repo = args[i + 1]
  if (!repo) throw new Error("--tree requiere owner/repo")
  const recursive = args.includes("--recursive")

  const { body } = await getJSON(
    `https://api.github.com/repos/${repo}/git/trees/HEAD${recursive ? "?recursive=1" : ""}`,
  )
  const entries = body.tree || []
  const prefix = "    "
  console.log(`${repo}: ${entries.length} entradas${body.truncated ? " (truncado por GitHub)" : ""}\n`)
  for (const e of entries) {
    const depth = (e.path.match(/\//g) || []).length
    if (!recursive && depth > 0) continue
    const label = e.type === "tree" ? `${e.path}/` : e.path
    console.log(prefix + (recursive ? "  ".repeat(Math.min(depth, 3)) : "") + label)
  }
}

const mode = args.includes("--readme") ? readme : args.includes("--tree") ? tree : search

mode().catch((error) => {
  console.error(`ERROR: ${error?.message ?? error}`)
  process.exitCode = 1
})