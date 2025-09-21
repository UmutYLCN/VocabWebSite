import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { getDecks, getDueVocabs, stats, getTodayBatch, preferences, setScope, setDailyGoal } = useAppStore()
  const decks = getDecks()
  const due = getDueVocabs()
  const today = getTodayBatch()
  const scopeDeck = preferences.scope === 'deck' ? decks.find(d => d.id === preferences.deckId) : undefined
  const yesterday = getYesterdayExamples()
  const progressPct = Math.min(100, (stats.xp % 100))
  return (
    <section>
      <h1>{t('page.home.title')}</h1>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <div>Decks: {decks.length}</div>
        <div>Due cards: {due.length}</div>
        <div>XP: {stats.xp} • Streak: {stats.streak} 🔥 • Level: {stats.level}</div>
      </div>
      <div className="mt-4">
        <div className="text-sm mb-1">Next level progress</div>
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded">
          <div className="h-3 bg-green-500 rounded" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Controls */}
      <div className="glass p-4 mt-6 flex flex-wrap items-center gap-3">
        <div className="text-sm">Scope</div>
        <select
          className="min-w-[160px]"
          value={preferences.scope === 'deck' ? preferences.deckId ?? '' : 'all'}
          onChange={e => {
            const val = e.target.value
            if (val === 'all') setScope('all')
            else setScope('deck', val)
          }}
        >
          <option value="all">All decks</option>
          {decks.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <div className="text-sm">Daily goal</div>
        <input type="number" className="w-20" min={1} max={200} value={preferences.dailyGoal} onChange={e => setDailyGoal(parseInt(e.target.value || '10', 10))} />
        <div className="chip">Today preview: {today.length} cards{scopeDeck ? ` • ${scopeDeck.name}` : ''}</div>
        <button className="btn-primary ml-auto" onClick={() => navigate(`/review?limit=${preferences.dailyGoal}${scopeDeck ? `&deck=${scopeDeck.id}` : ''}`)}>Start</button>
      </div>

      {/* Two-up panels */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="glass p-4">
          <h2 className="text-xl mb-3">Dün Öğrendiklerim</h2>
          {yesterday.list.length === 0 ? (
            <div className="text-sm opacity-70">No activity yesterday.</div>
          ) : (
            <ul className="space-y-2">
              {yesterday.list.map(v => (
                <li key={v.id} className="flex items-center justify-between">
                  <div className="font-medium">{v.front}</div>
                  <div className="text-sm opacity-70">{new Date(v.review.lastReviewedAt!).toLocaleTimeString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass p-4">
          <h2 className="text-xl mb-3">Bugün Öğreneceklerim</h2>
          {today.length === 0 ? (
            <div className="text-sm opacity-70">No cards planned yet.</div>
          ) : (
            <ul className="space-y-2">
              {today.slice(0, 10).map(v => (
                <li key={v.id} className="flex items-center justify-between">
                  <div className="font-medium">{v.front}</div>
                  <div className="text-xs chip">due {new Date(v.review.dueAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function getYesterdayExamples() {
  const store = useAppStore.getState()
  const list = Object.values(store.vocabs)
    .filter(v => !!v.review.lastReviewedAt)
    .filter(v => sameDayOffset(new Date(v.review.lastReviewedAt!), -1))
    .sort((a, b) => new Date(b.review.lastReviewedAt!).getTime() - new Date(a.review.lastReviewedAt!).getTime())
    .slice(0, 5)
  return { list }
}

function sameDayOffset(d: Date, offsetDays: number) {
  const now = new Date()
  const cmp = new Date(now)
  cmp.setDate(now.getDate() + offsetDays)
  return d.getFullYear() === cmp.getFullYear() && d.getMonth() === cmp.getMonth() && d.getDate() === cmp.getDate()
}
