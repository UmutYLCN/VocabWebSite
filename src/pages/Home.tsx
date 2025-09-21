import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'

export default function Home() {
  const { t } = useI18n()
  const { getDecks, getDueVocabs, stats } = useAppStore()
  const decks = getDecks()
  const due = getDueVocabs()
  return (
    <section>
      <h1>{t('page.home.title')}</h1>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <div>Decks: {decks.length}</div>
        <div>Due cards: {due.length}</div>
        <div>XP: {stats.xp} • Streak: {stats.streak} 🔥 • Level: {stats.level}</div>
      </div>
      <p className="mt-4">TODO: Dashboard, quick actions.</p>
    </section>
  )
}
