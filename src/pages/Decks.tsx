import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'
import { Link } from 'react-router-dom'

export default function Decks() {
  const { t } = useI18n()
  const { getDecks, getVocabsByDeck, addDeck, deleteDeck, addVocab } = useAppStore()
  const decks = getDecks()

  // unified page state
  const SELECTED_KEY = 'ui.selectedDeck'
  const [selectedId, setSelectedId] = useState<string>(() => localStorage.getItem(SELECTED_KEY) || '')
  useEffect(() => {
    if (!selectedId && decks.length > 0) setSelectedId(decks[0].id)
    if (decks.length === 0) setSelectedId('')
  }, [decks.length])
  useEffect(() => {
    if (selectedId) localStorage.setItem(SELECTED_KEY, selectedId)
  }, [selectedId])

  const selectedDeck = useMemo(() => decks.find(d => d.id === selectedId), [decks, selectedId])
  const cards = selectedId ? getVocabsByDeck(selectedId) : []

  // forms
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [eFront, setEFront] = useState('')
  const [eBack, setEBack] = useState('')

  const onCreateDeck = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const d = addDeck(name.trim(), desc.trim() || undefined)
    setName(''); setDesc('')
    setSelectedId(d.id)
  }

  const onAddCard = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedId || !front.trim() || !back.trim()) return
    addVocab(selectedId, front.trim(), back.trim())
    setFront(''); setBack('')
  }

  const startEditCard = (id: string, f: string, b: string) => {
    setEditingId(id)
    setEFront(f)
    setEBack(b)
  }

  const saveEditCard = (e: FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    if (!eFront.trim() || !eBack.trim()) return
    useAppStore.getState().updateVocab(editingId, { front: eFront.trim(), back: eBack.trim() })
    setEditingId(null)
  }

  const deleteCard = (id: string) => {
    useAppStore.getState().deleteVocab(id)
    if (editingId === id) setEditingId(null)
  }

  return (
    <section className="space-y-6">
      <h1>{t('page.decks.title')}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Decks + Create */}
        <div className="space-y-4">
          <form onSubmit={onCreateDeck} className="space-y-3 glass p-4">
            <div className="text-sm text-gray-300">{t('decks.create')}</div>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🗂️</span>
                <input className={`w-full pl-9 ${!name.trim() ? 'border-red-500/60 focus:ring-red-500/50' : 'border-white/20 focus:ring-red-500/40'}`} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Spanish Basics" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">📝</span>
                <input className="w-full pl-9" value={desc} onChange={e => setDesc(e.target.value)} placeholder="optional" />
              </div>
            </div>
            <button className="btn-primary">{t('decks.create')}</button>
          </form>

          <div className="grid gap-3 sm:grid-cols-2">
            {decks.map(d => {
              const count = getVocabsByDeck(d.id).length
              const active = d.id === selectedId
              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  className={`text-left glass p-4 border cursor-pointer ${active ? 'border-red-500' : 'border-white/10'}`}
                  onClick={() => setSelectedId(d.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(d.id) } }}
                >
                  <div className="font-semibold">{d.name}</div>
                  {d.description && <div className="text-sm text-gray-400">{d.description}</div>}
                  <div className="text-xs mt-2 chip">Cards: {count}</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="btn bg-red-700 hover:bg-red-600 text-white"
                      onClick={(ev) => { ev.stopPropagation(); if (confirm(t('decks.delete.confirm'))) deleteDeck(d.id) }}
                    >{t('cards.delete')}</button>
                  </div>
                </div>
              )
            })}
            {decks.length === 0 && <p>No decks yet.</p>}
          </div>
        </div>

        {/* Right: Add card to selected deck */}
        <div className="space-y-4">
          <div className="glass p-4">
            <div className="mb-2 text-sm text-gray-300">Add card</div>
            {!selectedDeck ? (
              <p className="text-sm text-gray-400">Create or select a deck to add cards.</p>
            ) : (
              <form onSubmit={onAddCard} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Front</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔤</span>
                    <input className={`w-full pl-9 ${!front.trim() ? 'border-red-500/60 focus:ring-red-500/50' : 'border-green-500/60 focus:ring-green-500/40'}`} value={front} onChange={e => setFront(e.target.value)} placeholder="question / term" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Back</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">💬</span>
                    <input className={`w-full pl-9 ${!back.trim() ? 'border-red-500/60 focus:ring-red-500/50' : 'border-green-500/60 focus:ring-green-500/40'}`} value={back} onChange={e => setBack(e.target.value)} placeholder="answer / definition" />
                  </div>
                </div>
                <button className="btn-primary">Add</button>
              </form>
            )}
            <div className="mt-3 text-xs text-gray-400">
              Need to add many at once? <Link className="underline" to="/settings#bulk-add">Use Bulk Add</Link>.
            </div>
          </div>

          {selectedDeck && (
            <div className="glass p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-gray-300">Cards in <span className="text-red-300">{selectedDeck.name}</span></div>
                <div className="chip">{cards.length} cards</div>
              </div>
              <div className="divide-y divide-white/10">
                {cards.map(c => (
                  <div key={c.id} className="py-3 flex items-center gap-3 justify-between">
                    {editingId === c.id ? (
                      <form onSubmit={saveEditCard} className="flex-1 grid gap-2 md:grid-cols-2">
                        <input value={eFront} onChange={e => setEFront(e.target.value)} placeholder="Front" />
                        <input value={eBack} onChange={e => setEBack(e.target.value)} placeholder="Back" />
                      </form>
                    ) : (
                      <div className="flex-1">
                        <div className="font-medium">{c.front}</div>
                        <div className="text-sm text-gray-400">{c.back}</div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {editingId === c.id ? (
                        <>
                          <button className="btn-primary" onClick={saveEditCard}>Save</button>
                          <button className="btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-ghost" onClick={() => startEditCard(c.id, c.front, c.back)}>Edit</button>
                          <button className="btn bg-red-700 hover:bg-red-600 text-white" onClick={() => deleteCard(c.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {cards.length === 0 && <div className="text-sm text-gray-400">No cards yet.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
