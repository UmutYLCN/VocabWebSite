import { useEffect, useMemo, useState } from 'react'
import Flashcard from '../components/Flashcard'
import ReviewControls from '../components/ReviewControls'
import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'
import { Vocab } from '../types/models'

export default function Review() {
  const { t } = useI18n()
  const { getDueVocabs, reviewAnswer, getDecks } = useAppStore()
  const decks = getDecks()
  const [filterDeck, setFilterDeck] = useState<string | 'all' | ''>('all')
  const [queue, setQueue] = useState<Vocab[]>([])
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const current = queue[index]

  useEffect(() => {
    const deckId = filterDeck === 'all' ? undefined : filterDeck
    setQueue(getDueVocabs(undefined, deckId))
    setIndex(0)
    setShowBack(false)
  }, [getDueVocabs, filterDeck])

  const remaining = useMemo(() => (queue.length ? queue.length - index : 0), [queue.length, index])

  const handleAnswer = (q: 0|1|2|3|4|5) => {
    if (!current) return
    reviewAnswer(current.id, q)
    // After answering, advance
    const nextIdx = index + 1
    setIndex(nextIdx)
    setShowBack(false)
    if (nextIdx >= queue.length) {
      // refresh queue after finishing batch
      const updated = getDueVocabs()
      setQueue(updated)
      setIndex(0)
    }
  }

  if (!current) {
    return (
      <section className="space-y-4">
        <h1>{t('page.review.title')}</h1>
        <p>No cards due. Great job! 🎉</p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <h1>{t('page.review.title')}</h1>
      <div className="glass p-3 flex flex-wrap gap-3 items-center">
        <label className="text-sm">Scope</label>
        <select className="min-w-[160px]" value={filterDeck} onChange={e => setFilterDeck(e.target.value as any)}>
          <option value="all">All decks</option>
          <option value="">No deck (All)</option>
          {decks.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="text-xs chip">Remaining: {remaining}</div>
      </div>
      
      <Flashcard front={current.front} back={current.back} showBack={showBack} />
      {!showBack ? (
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={() => setShowBack(true)}
        >
          Show Answer
        </button>
      ) : (
        <ReviewControls onAnswer={handleAnswer} />
      )}
    </section>
  )
}
