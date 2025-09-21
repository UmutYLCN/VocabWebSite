import { useEffect, useMemo, useState } from 'react'
import Flashcard from '../components/Flashcard'
import ReviewControls from '../components/ReviewControls'
import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'
import { Vocab } from '../types/models'
import { useSearchParams } from 'react-router-dom'

export default function Review() {
  const { t } = useI18n()
  const { getDueVocabs, reviewAnswer, getTodayBatch } = useAppStore()
  const [params] = useSearchParams()
  const [queue, setQueue] = useState<Vocab[]>([])
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const current = queue[index]

  useEffect(() => {
    const limitParam = params.get('limit')
    const deckParam = params.get('deck') || undefined
    if (limitParam) {
      const limit = parseInt(limitParam, 10)
      setQueue(getTodayBatch(isNaN(limit) ? undefined : limit, deckParam || undefined))
    } else {
      setQueue(getDueVocabs())
    }
    setIndex(0)
    setShowBack(false)
  }, [getDueVocabs, getTodayBatch, params])

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
      <div className="text-sm text-gray-400 chip">Remaining: {remaining}</div>
      
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
