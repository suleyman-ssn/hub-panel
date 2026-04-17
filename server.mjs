import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const CHIBBIS1_URL = process.env.CHIBBIS1_URL || 'https://chibbis-production.up.railway.app'
const CHIBBIS2_URL = process.env.CHIBBIS2_URL || 'https://chibbis-2-backend-production.up.railway.app'
const FLOWWOW_URL  = process.env.FLOWWOW_URL  || 'https://flowwow-production.up.railway.app'
const PHP_BASE     = process.env.PHP_BASE     || 'http://89.104.71.21'

async function safeFetch(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

app.get('/api/aggregate', async (_req, res) => {
  const [c1, c2, fw, yandex, flawery, letu, cake] = await Promise.all([
    safeFetch(`${CHIBBIS1_URL}/api/stats`),
    safeFetch(`${CHIBBIS2_URL}/api/stats`),
    safeFetch(`${FLOWWOW_URL}/api/stats`),
    safeFetch(`${PHP_BASE}/warehouse/stats.php`),
    safeFetch(`${PHP_BASE}/warehouse_flawery/stats.php`),
    safeFetch(`${PHP_BASE}/warehouse_letu/stats.php`),
    safeFetch(`${PHP_BASE}/warehouse_cake/stats.php`),
  ])

  res.json({ chibbis1: c1, chibbis2: c2, flowwow: fw, yandex, flawery, letu, cake })
})

app.use(express.static(path.join(__dirname, 'dist')))
app.get('/{*path}', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))

app.listen(PORT, () => console.log(`Hub panel running on port ${PORT}`))
