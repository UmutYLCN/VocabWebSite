import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'
import { useMemo, useState } from 'react'

export default function Settings() {
  const { t, locale, setLocale } = useI18n()
  const { exportData, importData, resetAll, getDecks, addVocab } = useAppStore()
  const decks = getDecks()
  const hasDecks = decks.length > 0
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  return (
    <section>
      <h1>{t('page.settings.title')}</h1>
      <p>TODO: Theme, language, data management.</p>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">{t('settings.language')}</label>
        <select
          aria-label={t('settings.selectLanguage')}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-900"
          value={locale}
          onChange={e => setLocale(e.target.value as 'en' | 'tr')}
        >
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>

      <div id="data" className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Data</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            onClick={() => {
              const data = exportData()
              navigator.clipboard?.writeText(data)
              setStatus('Exported to clipboard')
            }}
          >
            Export (copy)
          </button>
          <a
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            href={URL.createObjectURL(new Blob([exportData()], { type: 'application/json' }))}
            download={`vocab-backup-${Date.now()}.json`}
          >
            Download JSON
          </a>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white"
            onClick={() => {
              if (confirm('Reset all data?')) {
                resetAll()
                setStatus('All data reset')
              }
            }}
          >
            Reset All
          </button>
        </div>
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          placeholder="Paste exported JSON here to import"
          value={importText}
          onChange={e => setImportText(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => {
            const ok = importData(importText)
            setStatus(ok ? 'Import successful' : 'Import failed')
          }}
        >
          Import JSON
        </button>
        <div>
          <input
            type="file"
            accept="application/json"
            onChange={async e => {
              const file = e.target.files?.[0]
              if (!file) return
              const text = await file.text()
              const ok = importData(text)
              setStatus(ok ? 'Import successful' : 'Import failed')
            }}
          />
        </div>
        {status && <div className="text-sm text-gray-600 dark:text-gray-300">{status}</div>}
      </div>

      {/* Bulk Add */}
      <div id="bulk-add" className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold">Bulk Add Cards</h2>
        {!hasDecks ? (
          <p className="text-sm text-gray-400">No decks yet. Create one in Cards page.</p>
        ) : (
          <BulkAdd decks={{ ids: decks.map(d => d.id), items: decks.map(d => ({ id: d.id, name: d.name })) }} onAdd={(deckId, pairs) => {
            let count = 0
            for (const p of pairs) {
              if (p.front && p.back) {
                addVocab(deckId, p.front, p.back)
                count++
              }
            }
            setStatus(`Imported ${count} cards into selected deck`)
          }} />
        )}
      </div>
    </section>
  )
}

type DeckMeta = { id: string; name: string }

function BulkAdd({ decks, onAdd }: { decks: { ids: string[]; items: DeckMeta[] }; onAdd: (deckId: string, pairs: { front: string; back: string }[]) => void }) {
  const [deckId, setDeckId] = useState(decks.ids[0] || '')
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<{ front: string; back: string }[]>([])

  const parse = (raw: string) => {
    const lines = raw.split(/\r?\n/)
    const out: { front: string; back: string }[] = []
    for (const line of lines) {
      const s = line.trim()
      if (!s) continue
      const m = s.match(/^(.*?)\s*[|,\t]\s*(.+)$/)
      if (m) {
        out.push({ front: m[1].trim(), back: m[2].trim() })
      }
    }
    return out
  }

  const onPreview = () => setPreview(parse(text))
  const onImport = () => {
    const items = parse(text)
    if (!deckId || items.length === 0) return
    onAdd(deckId, items)
    setText('')
    setPreview([])
  }

  return (
    <div className="glass p-4 space-y-3">
      <div>
        <label className="block text-sm mb-1">Target deck</label>
        <select className="w-full" value={deckId} onChange={e => setDeckId(e.target.value)}>
          {decks.items.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Lines (front | back)</label>
        <textarea
          className="w-full min-h-[160px]"
          placeholder={`hello | merhaba\ncat | kedi`}
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button className="btn-ghost" onClick={onPreview}>Preview</button>
        <button className="btn-primary" onClick={onImport}>Import</button>
      </div>
      {preview.length > 0 && (
        <div className="text-sm text-gray-300">
          Preview ({preview.length}): {preview.slice(0, 3).map(p => `${p.front} → ${p.back}`).join(', ')}{preview.length > 3 ? '…' : ''}
        </div>
      )}
    </div>
  )
}
