import { FormEvent, useState } from 'react'
import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'

export default function Decks() {
  const { t } = useI18n()
  const { getDecks, getVocabsByDeck, addDeck } = useAppStore()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const decks = getDecks()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name) return
    addDeck(name, desc || undefined)
    setName('')
    setDesc('')
  }

  return (
    <section className="space-y-6">
      <h1>{t('page.decks.title')}</h1>
      <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <input className="w-full border rounded px-3 py-2" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Create Deck</button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map(d => {
          const count = getVocabsByDeck(d.id).length
          return (
            <div key={d.id} className="border rounded p-4">
              <div className="font-semibold">{d.name}</div>
              {d.description && <div className="text-sm text-gray-500">{d.description}</div>}
              <div className="text-sm mt-2">Cards: {count}</div>
            </div>
          )
        })}
        {decks.length === 0 && <p>No decks yet.</p>}
      </div>
    </section>
  )
}
