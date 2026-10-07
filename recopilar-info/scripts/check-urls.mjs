import { readFile } from "node:fs/promises"

const args = process.argv.slice(2)
const fileFlag = args.find((a) => a === "--file" || a === "-f")
const fileIndex = fileFlag ? args.indexOf(fileFlag) : -1
const inline = args.filter((_, i) => !fileFlag || (i !== fileIndex && i !== fileIndex + 1))
const TIMEOUT_MS = 15000
const CONCURRENCY = 6

if (args.includes("--help") || args.includes("-h")) {
  console.log(
    [
      "Uso:",
      "  node check-urls.mjs <url1> <url2> ...",
      "  node check-urls.mjs --file refs.txt",
      "  node check-urls.mjs            (lee URLs de stdin, una por linea)",
      "",
      "Exit code 1 si alguna URL no responde 2xx/3xx.",
    ].join("\n"),
  )
  process.exit(0)
}

async function readStdin() {
  if (process.stdin.isTTY) return ""
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString("utf8")
}

async function loadUrls() {
  if (fileFlag) {
    const path = fileIndex > -1 ? args[fileIndex + 1] : undefined
    if (!path) throw new Error("--file requiere una ruta")
    return (await readFile(path, "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
  }
  const raw = inline.length ? inline.join("\n") : await readStdin()
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

async function probe(url) {
  const attempt = async (method) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) reference-link-checker",
          ...(method === "GET" ? { range: "bytes=0-2047" } : {}),
        },
      })
      if (method === "GET") await response.arrayBuffer().catch(() => {})
      return response.status
    } finally {
      clearTimeout(timer)
    }
  }

  try {
    let status = await attempt("HEAD")
    if (status === 405 || status === 403 || status === 501) status = await attempt("GET")
    return { url, status, ok: status >= 200 && status < 400 }
  } catch (error) {
    const reason = error?.name === "AbortError" ? "timeout" : String(error?.message ?? error)
    return { url, status: reason, ok: false }
  }
}

const urls = [...new Set(await loadUrls())]
if (urls.length === 0) {
  console.error("No hay URLs para verificar.")
  process.exit(2)
}

const results = []
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY)
  results.push(...(await Promise.all(batch.map(probe))))
}

for (const result of results.sort((a, b) => Number(b.ok) - Number(a.ok) || a.url.localeCompare(b.url))) {
  console.log(`${result.ok ? "ok " : "BAD"} ${String(result.status).padEnd(7)} ${result.url}`)
}

const bad = results.filter((result) => !result.ok)
console.log(`\n${results.length - bad.length}/${results.length} ok`)
if (bad.length) {
  console.log(`${bad.length} con problemas: ${bad.map((result) => result.url).join(", ")}`)
  process.exit(1)
}