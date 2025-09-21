import { useEffect, useMemo, useRef, useState } from 'react'

type DeckMeta = { id: string; name: string }
type Pair = { front: string; back: string }

export default function BulkAddModal({
  isOpen,
  onClose,
  decks,
  defaultDeckId,
  onImport
}: {
  isOpen: boolean
  onClose: () => void
  decks: DeckMeta[]
  defaultDeckId?: string
  onImport: (deckId: string, pairs: Pair[]) => void
}) {
  const [deckId, setDeckId] = useState<string>('')
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<Pair[]>([])
  const [errors, setErrors] = useState<{ line: number; reason: string; raw: string }[]>([])
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setDeckId(defaultDeckId || (decks[0]?.id ?? ''))
      setText('')
      setPreview([])
      setErrors([])
      fileRef.current && (fileRef.current.value = '')
    }
  }, [isOpen, defaultDeckId, decks])

  if (!isOpen) return null

  const parseCSVLine = (line: string): string[] => {
    const out: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"'; i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur)
        cur = ''
      } else {
        cur += ch
      }
    }
    out.push(cur)
    return out.map(s => s.trim())
  }

  const detectAndSplit = (raw: string): { ok: Pair[]; errs: { line: number; reason: string; raw: string }[] } => {
    const lines = raw.split(/\r?\n/)
    const ok: Pair[] = []
    const errs: { line: number; reason: string; raw: string }[] = []
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i]
      const s = rawLine.trim()
      if (!s) continue
      let left = ''
      let right = ''
      if (s.includes(',') && (s.includes('"') || s.split(',').length >= 2)) {
        const cols = parseCSVLine(rawLine)
        if (cols.length >= 2) { left = cols[0]; right = cols[1] }
      }
      if (!left && !right) {
        const pipe = s.split('|')
        if (pipe.length >= 2) { left = pipe[0].trim(); right = pipe.slice(1).join('|').trim() }
      }
      if (!left && !right) {
        const tab = s.split('\t')
        if (tab.length >= 2) { left = tab[0].trim(); right = tab.slice(1).join('\t').trim() }
      }
      if (!left || !right) {
        errs.push({ line: i + 1, reason: 'Missing separator or second column', raw: rawLine })
      } else {
        ok.push({ front: left, back: right })
      }
    }
    return { ok, errs }
  }

  const onFile = async (f: File) => {
    const txt = await f.text()
    setText(txt)
    const { ok, errs } = detectAndSplit(txt)
    setPreview(ok)
    setErrors(errs)
  }

  const onParseClick = () => {
    const { ok, errs } = detectAndSplit(text)
    setPreview(ok)
    setErrors(errs)
  }

  const doImport = () => {
    if (!deckId || preview.length === 0) return
    onImport(deckId, preview)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass w-full max-w-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bulk Add Cards</h3>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Target deck</label>
            <select className="w-full" value={deckId} onChange={e => setDeckId(e.target.value)}>
              {decks.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">CSV upload</label>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Or paste lines (front | back, comma or tab)</label>
          <textarea className="w-full min-h-[160px]" value={text} onChange={e => setText(e.target.value)} placeholder={`hello, merhaba\n"good morning", "gunaydin"`} />
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={onParseClick}>Preview</button>
          <button className="btn-primary" onClick={doImport} disabled={!deckId || preview.length === 0}>Import {preview.length > 0 ? `(${preview.length})` : ''}</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="mb-1">Preview ({preview.length})</div>
            <ul className="max-h-40 overflow-auto space-y-1">
              {preview.slice(0, 50).map((p, i) => (
                <li key={i} className="text-gray-300">{p.front} <span className="opacity-60">→</span> {p.back}</li>
              ))}
              {preview.length > 50 && <li className="opacity-60">…</li>}
            </ul>
          </div>
          <div>
            <div className="mb-1">Errors ({errors.length})</div>
            <ul className="max-h-40 overflow-auto space-y-1">
              {errors.map((e, i) => (
                <li key={i} className="text-red-300">Line {e.line}: {e.reason} — <span className="opacity-70">{e.raw}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

