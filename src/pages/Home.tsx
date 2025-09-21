import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'

export default function Home() {
  const { t } = useI18n()
  const { getDecks, getDueVocabs, stats } = useAppStore()
  const decks = getDecks()
  const due = getDueVocabs()
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
      <p className="mt-4">TODO: Dashboard, quick actions.</p>
    </section>
  )
}
