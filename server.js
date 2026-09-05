import 'dotenv/config'
import express from 'express'

const app = express()
const port = process.env.API_PORT || 3001
const groqUrl = 'https://api.groq.com/openai/v1/chat/completions'

app.use(express.json({ limit: '1mb' }))

app.post('/api/chat', async (request, response) => {
  const { messages } = request.body
  if (!process.env.GROQ_API_KEY) {
    return response.status(500).json({ error: 'GROQ_API_KEY не настроен. Добавьте ключ в файл .env.' })
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: 'Сообщение не должно быть пустым.' })
  }

  try {
    const groqResponse = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Ты Nova, дружелюбный и практичный AI-помощник. Отвечай на языке пользователя, кратко и по делу.' },
          ...messages.slice(-20),
        ],
        temperature: 0.7,
        max_tokens: 700,
      }),
    })
    const data = await groqResponse.json()
    if (!groqResponse.ok) return response.status(groqResponse.status).json({ error: data.error?.message || 'Groq API вернул ошибку.' })
    return response.json({ message: data.choices?.[0]?.message?.content || 'Не удалось получить ответ от AI.' })
  } catch (error) {
    return response.status(502).json({ error: `Не удалось подключиться к Groq: ${error.message}` })
  }
})

app.listen(port, () => console.log(`API server listening on http://localhost:${port}`))
