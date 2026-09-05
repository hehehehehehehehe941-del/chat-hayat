import React, { useEffect, useRef, useState } from 'react'

const starterMessages = [
  { id: 1, role: 'assistant', text: 'Привет! Я Nova, твой AI-помощник. Чем могу помочь сегодня?', time: '10:42' },
]

const answers = {
  hello: ['Привет! Рад тебя видеть. Что сегодня будем разбирать?', 'Привет! Я на связи. Можем обсудить идею, код или составить план.', 'Здравствуйте! Чем займёмся: решим задачу или придумаем что-то новое?'],
  code: ['Конечно. Пришли код и опиши ожидаемый результат, а я найду проблему по шагам.', 'Давай разберёмся с кодом. Особенно полезны текст ошибки и небольшой фрагмент вокруг неё.', 'Помогу. Сначала уточним цель, затем найдём причину и соберём аккуратное исправление.'],
  sudoku: ['Для Sudoku могу подсказать следующий ход или объяснить стратегию. Какой уровень сложности тебе интересен?', 'Могу помочь решить Sudoku без угадывания: посмотрим кандидатов, строки, столбцы и блоки.', 'Давай разберём головоломку. Пришли поле или скажи, нужна подсказка, решение или новый уровень.'],
  plan: ['Соберём понятный план: цель, приоритеты и одно ближайшее действие. Что нужно успеть?', 'Давай превратим задачу в несколько коротких шагов. Расскажи, с чего начинаем.', 'Предлагаю начать с результата, которого ты хочешь достичь, и ограничений по времени.'],
  default: ['Интересная мысль. Могу разложить её на части и предложить несколько практичных вариантов.', 'Понял. Давай уточним контекст, чтобы ответ получился действительно полезным.', 'Здесь есть несколько подходов. Расскажи немного больше, и я помогу выбрать лучший.', 'Хороший вопрос. Начнём с главного: какой результат ты хочешь получить?'],
}

function getAnswer(text, messageCount) {
  const value = text.toLowerCase()
  const topic = /привет|здравств|hello|hi/.test(value) ? 'hello' : /код|react|javascript|ошиб|code/.test(value) ? 'code' : /sudoku|судоку|головолом/.test(value) ? 'sudoku' : /план|сплан|задач|организ/.test(value) ? 'plan' : 'default'
  const options = answers[topic]
  return options[messageCount % options.length]
}

function App() {
  const [messages, setMessages] = useState(starterMessages)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [activeChat, setActiveChat] = useState('Новый разговор')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isThinking])

  const sendMessage = (preset) => {
    const text = (preset || input).trim()
    if (!text || isThinking) return
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text, time: 'сейчас' }])
    setInput('')
    setIsThinking(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: getAnswer(text, current.length), time: 'сейчас' }])
      setIsThinking(false)
    }, 650)
  }

  const newChat = () => {
    setMessages(starterMessages)
    setInput('')
    setActiveChat('Новый разговор')
  }

  return (
    <div className="chat-app">
      <aside className="chat-sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>nova<span>.</span>ai</span></div>
        <button className="new-chat" onClick={newChat}><span>＋</span> Новый разговор</button>
        <div className="side-label">РАЗГОВОРЫ</div>
        <button className="history-item active" onClick={() => setActiveChat('Новый разговор')}><span>◌</span>{activeChat}</button>
        <button className="history-item"><span>◷</span>Идеи для проекта</button>
        <button className="history-item"><span>◷</span>Помощь с React</button>
        <div className="sidebar-foot"><div className="usage"><div><span>ИСПОЛЬЗОВАНО СЕГОДНЯ</span><b>12 / 50 сообщений</b></div><div className="usage-bar"><i></i></div></div><div className="user-row"><div className="avatar">А</div><div><strong>Алексей</strong><small>Личный аккаунт</small></div><button>···</button></div></div>
      </aside>

      <main className="chat-main">
        <header className="chat-header"><div><span className="online-dot"></span><strong>Nova AI</strong><small>Онлайн и готов помочь</small></div><div className="header-actions"><button title="Поиск">⌕</button><button title="Настройки">⚙</button></div></header>
        <section className="conversation">
          <div className="conversation-head"><span className="date-line">СЕГОДНЯ, 10:42</span><h1>Чем займёмся?</h1><p>Спроси что угодно. Я помогу превратить мысли в ясные действия.</p></div>
          <div className="messages">
            {messages.map((message) => <div className={`message-row ${message.role}`} key={message.id}><div className="message-avatar">{message.role === 'assistant' ? '✦' : 'А'}</div><div className="message-content"><div className="message-name">{message.role === 'assistant' ? 'Nova' : 'Вы'} <span>{message.time}</span></div><div className="bubble">{message.text}</div></div></div>)}
            {isThinking && <div className="message-row assistant"><div className="message-avatar">✦</div><div className="message-content"><div className="message-name">Nova <span>печатает...</span></div><div className="bubble typing"><i></i><i></i><i></i></div></div></div>}
            <div ref={endRef}></div>
          </div>
        </section>
        <div className="composer-area"><div className="suggestions"><button onClick={() => sendMessage('Помоги мне составить план на сегодня')}>Составить план <span>↗</span></button><button onClick={() => sendMessage('Объясни сложную тему простыми словами')}>Объяснить тему <span>↗</span></button><button onClick={() => sendMessage('Помоги с кодом React')}>Помочь с кодом <span>↗</span></button></div><div className="composer"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage() } }} placeholder="Напишите сообщение..." rows="1" /><div className="composer-tools"><button title="Прикрепить файл">＋</button><span>Enter для отправки</span><button className="send-button" onClick={() => sendMessage()} disabled={!input.trim() || isThinking} title="Отправить">↑</button></div></div><p className="disclaimer">Nova может допускать ошибки. Проверяйте важную информацию.</p></div>
      </main>
    </div>
  )
}

export default App
