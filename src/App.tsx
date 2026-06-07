import { useState, useRef } from 'react'
import { parseChatToJson, filterParticipants, type ChatMessage } from './lib/parser'
import StatsDashboard from './components/StatsDashboard'
import './App.css'

type UploadState = 'idle' | 'parsed' | 'error'

function App() {
  const [state, setState] = useState<UploadState>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.name.endsWith('.txt')) {
      setErrorMsg('Il file deve essere un .txt esportato da WhatsApp.')
      setState('error')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const raw = parseChatToJson(text)
        const parsed = filterParticipants(raw)
        setMessages(parsed)
        setState('parsed')
        console.log(`[parser] ${raw.length} messaggi totali, ${parsed.length} dopo il filtro 1%`)
        const excluded = [...new Set(raw.map(m => m.user))].filter(u => ![...new Set(parsed.map(m => m.user))].includes(u))
        console.log('[parser] partecipanti esclusi (<1%):', excluded)
        console.log('[parser] partecipanti inclusi:', [...new Set(parsed.map(m => m.user))])
        console.log('[parser] primi 5 messaggi:', parsed.slice(0, 5))
        const typeCounts: Record<string, number> = {}
        for (const m of parsed) {
          typeCounts[m.type] = (typeCounts[m.type] ?? 0) + 1
        }
        console.log('[parser] distribuzione tipi:', typeCounts)
      } catch (err) {
        console.error('[parser] errore durante il parsing:', err)
        setErrorMsg('Errore durante il parsing del file.')
        setState('error')
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function reset() {
    setState('idle')
    setMessages([])
    setFileName('')
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  if (state === 'parsed') {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <h1>Analisi Chat WhatsApp</h1>
            <p>{fileName} · {messages.length} messaggi analizzati</p>
          </div>
          <button onClick={reset}>Carica un altro file</button>
        </header>
        <StatsDashboard messages={messages} />
      </div>
    )
  }

  return (
    <main>
      <header>
        <h1>Analisi Chat WhatsApp</h1>
        <p>Carica l'esportazione .txt di un gruppo per analizzarne i messaggi.</p>
      </header>

      {state === 'idle' && (
        <div
          className={`drop-zone${dragging ? ' dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <span className="drop-icon">↑</span>
          <p>Trascina qui il file .txt oppure <span className="link">sfoglia</span></p>
          <input
            ref={inputRef}
            type="file"
            accept=".txt"
            onChange={onInputChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {state === 'error' && (
        <div className="result-box error">
          <p>{errorMsg}</p>
          <button onClick={reset}>Riprova</button>
        </div>
      )}
    </main>
  )
}

export default App
