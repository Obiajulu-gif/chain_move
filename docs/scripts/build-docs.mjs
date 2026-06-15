import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

const root = process.cwd()
const publicDir = resolve(root, "public")
const sourceFile = resolve(root, "contributor-safety-and-stellar-roadmap.md")
const outputFile = resolve(publicDir, "index.html")

const markdown = await readFile(sourceFile, "utf8")
const escapedMarkdown = escapeHtml(markdown)

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ChainMove Documentation</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fafc;
        color: #0f172a;
      }

      body {
        margin: 0;
        padding: 48px 20px;
      }

      main {
        max-width: 980px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
        overflow: hidden;
      }

      header {
        padding: 32px;
        border-bottom: 1px solid #e2e8f0;
        background: linear-gradient(135deg, #fff7ed, #eff6ff);
      }

      h1 {
        margin: 0 0 8px;
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1.05;
      }

      p {
        margin: 0;
        color: #475569;
        font-size: 1rem;
      }

      pre {
        margin: 0;
        padding: 32px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
        font: 14px/1.7 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>ChainMove Documentation</h1>
        <p>Contributor safety, CI, mock mode, and integration roadmap.</p>
      </header>
      <pre>${escapedMarkdown}</pre>
    </main>
  </body>
</html>
`

await mkdir(publicDir, { recursive: true })
await writeFile(outputFile, html, "utf8")
console.log("Built ChainMove documentation to public/index.html")
