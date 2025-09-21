import { useEffect, useMemo, useState, FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useI18n } from '../app/I18nProvider'

export default function DeckDetail() {
  const { id } = useParams()
  const updateDeck = useAppStore(s => s.updateDeck)
  const updateVocab = useAppStore(s => s.updateVocab)
  const deleteVocab = useAppStore(s => s.deleteVocab)
  const deck = useAppStore(s => (id ? s.decks[id] : undefined))
  const vocabs = useAppStore(s => (id ? Object.values(s.vocabs).filter(v => v.deckId === id) : []))
  const { t } = useI18n()

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
        <Link className="btn-ghost" to="/decks">{t('decks.manage.back')}</Link>
      </div>

      <form onSubmit={saveMeta} className="glass p-4 space-y-3 max-w-xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Deck name" />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="optional" />
          </div>
        </div>
        <button className="btn-primary">{t('decks.save')}</button>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Cards</h2>
        <div className="glass p-2">
          <div className="divide-y divide-white/10">
            {vocabs.map(v => (
              <div key={v.id} className="p-3 flex items-center gap-4 justify-between">
                {editing === v.id ? (
                  <div className="flex-1 grid gap-2 sm:grid-cols-2">
                    <input value={front} onChange={e => setFront(e.target.value)} placeholder="Front" />
                    <input value={back} onChange={e => setBack(e.target.value)} placeholder="Back" />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-medium">{v.front}</div>
                    <div className="text-sm text-gray-400">{v.back}</div>
                  </div>
                )}
                <div className="flex gap-2">
                  {editing === v.id ? (
                    <>
                      <button className="btn-primary" onClick={saveVocab}>{t('cards.save')}</button>
                      <button className="btn-ghost" onClick={() => setEditing(null)}>{t('cards.cancel')}</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-ghost" onClick={() => startEdit(v.id, v.front, v.back)}>{t('cards.edit')}</button>
                      <button className="btn bg-red-700 hover:bg-red-600 text-white" onClick={() => deleteVocab(v.id)}>{t('cards.delete')}</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {vocabs.length === 0 && <div className="p-3 text-sm text-gray-400">{t('cards.none')}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
