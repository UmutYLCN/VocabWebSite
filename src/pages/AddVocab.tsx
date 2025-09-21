import { FormEvent, useState } from 'react'
import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'

export default function AddVocab() {
  const { t } = useI18n()
  const { getDecks, addVocab } = useAppStore()
  const decks = getDecks()
  const [deckId, setDeckId] = useState(decks[0]?.id || '')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!deckId || !front || !back) return
    addVocab(deckId, front, back)
    setFront('')
    setBack('')
  }

  return (
    <section className="space-y-4">
      <h1>{t('page.add.title')}</h1>
      {decks.length === 0 ? (
        <p>Create a deck first in Decks page.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 max-w-xl glass p-4">
          <div>
            <label className="block text-sm mb-1">Deck</label>
            <select className="w-full border rounded px-3 py-2" value={deckId} onChange={e => setDeckId(e.target.value)}>
              {decks.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Front</label>
            <input className="w-full border rounded px-3 py-2" value={front} onChange={e => setFront(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Back</label>
            <input className="w-full border rounded px-3 py-2" value={back} onChange={e => setBack(e.target.value)} />
          </div>
          <button className="btn-primary">Add</button>
        </form>
      )}
    </section>
  )
}
