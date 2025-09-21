import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

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
  const { exportData, importData } = useAppStore()
  const [deckId, setDeckId] = useState<string>('')
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<Pair[]>([])
  const [errors, setErrors] = useState<{ line: number; reason: string; raw: string }[]>([])
  // removed file upload for JSON; only paste flow kept
  const [activeTab, setActiveTab] = useState<'cards' | 'data'>('cards')
  const [status, setStatus] = useState<string>('')
  const [jsonText, setJsonText] = useState('')
  const [showErrors, setShowErrors] = useState<boolean>(true)
  const [jsonPreview, setJsonPreview] = useState<{ decks: number; vocabs: number; pairs: Pair[] }>({ decks: 0, vocabs: 0, pairs: [] })
  const [jsonErrors, setJsonErrors] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) return
    setDeckId(defaultDeckId || (decks[0]?.id ?? ''))
    setText('')
    setPreview([])
    setErrors([])
    setJsonText('')
    setStatus('')
    setActiveTab('cards')
  }, [isOpen, defaultDeckId, decks])

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

  // Auto-parse on text changes for streamlined UX
  useEffect(() => {
    if (!isOpen || activeTab !== 'cards') return
    const { ok, errs } = detectAndSplit(text)
    setPreview(ok)
    setErrors(errs)
  }, [text, activeTab])

  // Auto-parse JSON for Data tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'data') return
    const errs: string[] = []
    let decksCount = 0
    let vocabsCount = 0
    let pairs: Pair[] = []
    if (!jsonText.trim()) {
      setJsonErrors([])
      setJsonPreview({ decks: 0, vocabs: 0, pairs: [] })
      return
    }
    try {
      const obj = JSON.parse(jsonText)
      const decks = obj?.decks && typeof obj.decks === 'object' ? obj.decks : {}
      const vocabs = obj?.vocabs && typeof obj.vocabs === 'object' ? obj.vocabs : {}
      decksCount = Object.keys(decks).length
      const vocabValues = Object.values(vocabs as Record<string, any>)
      vocabsCount = vocabValues.length
      pairs = vocabValues.slice(0, 50).map((v: any) => ({ front: String(v.front ?? ''), back: String(v.back ?? '') }))
      if (!obj || typeof obj !== 'object') errs.push('Root is not an object')
    } catch (e: any) {
      errs.push('Invalid JSON: ' + (e?.message || 'parse error'))
    }
    setJsonErrors(errs)
    setJsonPreview({ decks: decksCount, vocabs: vocabsCount, pairs })
  }, [jsonText, activeTab, isOpen])

  if (!isOpen) return null

  const doImport = () => {
    if (!deckId || preview.length === 0) return
    onImport(deckId, preview)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass w-full max-w-3xl p-0">
        <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
          <h3 className="text-lg font-semibold">Bulk</h3>
          <div className="inline-flex rounded-md overflow-hidden border border-white/10">
            <button className={`px-3 py-1 text-sm ${activeTab==='cards' ? 'bg-red-600/60' : 'bg-white/5'}`} onClick={() => setActiveTab('cards')}>Cards</button>
            <button className={`px-3 py-1 text-sm ${activeTab==='data' ? 'bg-red-600/60' : 'bg-white/5'}`} onClick={() => setActiveTab('data')}>Data</button>
          </div>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="px-5 pb-3 max-h-[80vh] overflow-auto">
          {activeTab === 'cards' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Target deck</label>
                <select className="w-full" value={deckId} onChange={e => setDeckId(e.target.value)}>
                  {decks.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Paste lines (front | back, comma or tab)</label>
                <textarea className="w-full min-h-[160px]" value={text} onChange={e => setText(e.target.value)} placeholder={`hello, merhaba\n"good morning", "gunaydin"`} />
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap text-sm">
                <div className="chip">{preview.length} parsed • {errors.length} errors</div>
                <label className="inline-flex items-center gap-2 text-xs opacity-80">
                  <input type="checkbox" className="accent-red-500" checked={showErrors} onChange={e => setShowErrors(e.target.checked)} /> Show errors
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="mb-1">Preview</div>
                  <ul className="max-h-40 overflow-auto space-y-1">
                    {preview.slice(0, 50).map((p, i) => (
                      <li key={i} className="text-gray-300">{p.front} <span className="opacity-60">→</span> {p.back}</li>
                    ))}
                    {preview.length > 50 && <li className="opacity-60">…</li>}
                  </ul>
                </div>
                {showErrors && (
                  <div>
                    <div className="mb-1">Errors</div>
                    <ul className="max-h-40 overflow-auto space-y-1">
                      {errors.map((e, i) => (
                        <li key={i} className="text-red-300">Line {e.line}: {e.reason} — <span className="opacity-70">{e.raw}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Target deck</label>
                <select className="w-full" value={deckId} onChange={e => setDeckId(e.target.value)}>
                  {decks.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Import JSON (paste)</label>
                <textarea className="w-full min-h-[160px]" value={jsonText} onChange={e => setJsonText(e.target.value)} placeholder="Paste exported JSON here" />
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap text-sm">
                <div className="chip">{jsonPreview.decks} decks • {jsonPreview.vocabs} cards • {jsonErrors.length} errors</div>
                <label className="inline-flex items-center gap-2 text-xs opacity-80">
                  <input type="checkbox" className="accent-red-500" checked={showErrors} onChange={e => setShowErrors(e.target.checked)} /> Show errors
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="mb-1">Preview</div>
                  <ul className="max-h-40 overflow-auto space-y-1">
                    {jsonPreview.pairs.map((p, i) => (
                      <li key={i} className="text-gray-300">{p.front} <span className="opacity-60">→</span> {p.back}</li>
                    ))}
                    {jsonPreview.pairs.length === 0 && <li className="opacity-60">No preview</li>}
                  </ul>
                </div>
                {showErrors && (
                  <div>
                    <div className="mb-1">Errors</div>
                    <ul className="max-h-40 overflow-auto space-y-1">
                      {jsonErrors.map((e, i) => (
                        <li key={i} className="text-red-300">{e}</li>
                      ))}
                      {jsonErrors.length === 0 && <li className="opacity-60">No errors</li>}
                    </ul>
                  </div>
                )}
              </div>
              {status && <div className="text-sm text-gray-300">{status}</div>}
            </div>
          )}
        </div>
        <div className="sticky bottom-0 px-5 py-3 border-t border-white/10 bg-black/30 flex items-center justify-end gap-2">
          {activeTab === 'cards' ? (
            <button className="btn-primary" onClick={doImport} disabled={!deckId || preview.length === 0}>Import {preview.length > 0 ? `(${preview.length})` : ''}</button>
          ) : (
            <button className="btn-primary" onClick={() => { const ok = importData(jsonText); setStatus(ok ? 'Import successful' : 'Import failed') }} disabled={!jsonText.trim() || jsonErrors.length > 0}>Import JSON</button>
          )}
        </div>
      </div>
    </div>
  )
}
