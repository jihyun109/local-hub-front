import http from 'http'

const port = 8080

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      let payload = {}
      try {
        payload = JSON.parse(body)
      } catch {
        payload = {}
      }

      const query = payload.data?.userPrompt || payload.message || payload.data || ''
      const systemPrompt = payload.data?.systemPrompt || ''

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          reply: `테스트 응답입니다. 받은 메시지: ${query || '없음'}${systemPrompt ? `\n\n[systemPrompt]\n${systemPrompt}` : ''}`,
          recommendedPlaces: [
            { id: 1, name: '광안리 어방축제', district: '수영구' },
          ],
        }),
      )
    })

    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(port, () => {
  console.log(`Mock chat API server listening on http://localhost:${port}`)
})
