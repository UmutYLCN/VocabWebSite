import { useMemo, useState, FormEvent } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useI18n } from '../app/I18nProvider'

export default function DeckDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDeck, getVocabsByDeck, updateDeck, updateVocab, deleteVocab } = useAppStore()
  const { t } = useI18n()

  const deck = id ? getDeck(id) : undefined
  const vocabs = useMemo(() => (id ? getVocabsByDeck(id) : []), [id, getVocabsByDeck])

  const [name, setName] = useState(deck?.name ?? '')
  const [desc, setDesc] = useState(deck?.description ?? '')
  const [editing, setEditing] = useState<string | null>(null)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  if (!deck) {
    return (
      <section className="space-y-3">
        <h1>Deck</h1>
        <p>Deck not found.</p>
        <Link className="underline" to="/decks">{t('decks.manage.back')}</Link>
      </section>
    )
  }

  const saveMeta = (e: FormEvent) => {
    e.preventDefault()
    updateDeck(deck.id, { name, description: desc })
  }

  const startEdit = (id: string, f: string, b: string) => {
    setEditing(id)
    setFront(f)
    setBack(b)
  }

  const saveVocab = () => {
    if (!editing) return
    if (!front.trim() || !back.trim()) return
    updateVocab(editing, { front: front.trim(), back: back.trim() })
    setEditing(null)
    setFront('')
    setBack('')
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Deck</h1>
        <Link className="underline" to="/decks">{t('decks.manage.back')}</Link>
      </div>

      <form onSubmit={saveMeta} className="space-y-3 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <input className="w-full border rounded px-3 py-2" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded bg-blue-600 text-white">{t('decks.save')}</button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Cards</h2>
        <div className="divide-y border rounded">
          {vocabs.map(v => (
            <div key={v.id} className="p-3 flex items-center gap-2 justify-between">
              {editing === v.id ? (
                <div className="flex-1 flex gap-2">
                  <input className="border rounded px-2 py-1 flex-1" value={front} onChange={e => setFront(e.target.value)} />
                  <input className="border rounded px-2 py-1 flex-1" value={back} onChange={e => setBack(e.target.value)} />
                </div>
              ) : (
                <div className="flex-1">
                  <div className="font-medium">{v.front}</div>
                  <div className="text-sm text-gray-500">{v.back}</div>
                </div>
              )}
              <div className="flex gap-2">
                {editing === v.id ? (
                  <>
                    <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={saveVocab}>{t('cards.save')}</button>
                    <button className="px-3 py-1 rounded bg-gray-300" onClick={() => setEditing(null)}>{t('cards.cancel')}</button>
                  </>
                ) : (
                  <>
                    <button className="px-3 py-1 rounded bg-gray-200" onClick={() => startEdit(v.id, v.front, v.back)}>{t('cards.edit')}</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => deleteVocab(v.id)}>{t('cards.delete')}</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {vocabs.length === 0 && <div className="p-3 text-sm text-gray-500">{t('cards.none')}</div>}
        </div>
      </div>
    </section>
  )
}
