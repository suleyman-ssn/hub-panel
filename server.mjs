import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const CHIBBIS1_URL = process.env.CHIBBIS1_URL || 'https://soothing-insight-production-8757.up.railway.app'
const CHIBBIS2_URL = process.env.CHIBBIS2_URL || 'https://chibbis-2-backend-production.up.railway.app'
const FLOWWOW_URL = process.env.FLOWWOW_URL || 'https://zonal-curiosity-production-2157.up.railway.app'

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
  const [c1, c2, fw] = await Promise.all([
    safeFetch(`${CHIBBIS1_URL}/api/stats`),
    CHIBBIS2_URL ? safeFetch(`${CHIBBIS2_URL}/api/stats`) : Promise.resolve(null),
    safeFetch(`${FLOWWOW_URL}/api/stats`),
  ])

  res.json({ chibbis1: c1, chibbis2: c2, flowwow: fw })
})

app.use(express.static(path.join(__dirname, 'dist')))
app.get('/{*path}', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')))

app.listen(PORT, () => console.log(`Hub panel running on port ${PORT}`))
