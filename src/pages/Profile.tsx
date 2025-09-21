import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'

export default function Profile() {
  const { t, locale, setLocale } = useI18n()
  const stats = useAppStore(s => s.stats)
  const decksCount = useAppStore(s => Object.keys(s.decks).length)
  const vocabsCount = useAppStore(s => Object.keys(s.vocabs).length)
  const dueCount = useAppStore(s => Object.values(s.vocabs).filter(v => new Date(v.review.dueAt).getTime() <= Date.now()).length)
  const progressPct = Math.min(100, stats.xp % 100)

  return (
    <section className="space-y-6">
      <h1>{t('page.profile.title')}</h1>

      <div className="glass p-4 inline-block">
        <label className="block text-sm mb-1">{t('settings.language')}</label>
        <select
          aria-label={t('settings.selectLanguage')}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-900"
          value={locale}
          onChange={e => setLocale(e.target.value as 'en' | 'tr')}
        >
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass p-4">
          <div className="text-sm opacity-80">Decks</div>
          <div className="text-2xl font-semibold">{decksCount}</div>
        </div>
        <div className="glass p-4">
          <div className="text-sm opacity-80">Cards</div>
          <div className="text-2xl font-semibold">{vocabsCount}</div>
        </div>
        <div className="glass p-4">
          <div className="text-sm opacity-80">Due</div>
          <div className="text-2xl font-semibold">{dueCount}</div>
        </div>
      </div>

      <div className="glass p-4">
        <div className="text-sm opacity-80 mb-2">XP • Streak • Level</div>
        <div className="flex gap-6 text-lg">
          <div>XP: <span className="text-red-300">{stats.xp}</span></div>
          <div>Streak: <span className="text-red-300">{stats.streak} 🔥</span></div>
          <div>Level: <span className="text-red-300">{stats.level}</span></div>
        </div>
        <div className="mt-4">
          <div className="text-sm mb-1">Next level progress</div>
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded">
            <div className="h-3 bg-green-500 rounded" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

