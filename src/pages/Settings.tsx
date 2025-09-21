import { useI18n } from '../app/I18nProvider'

export default function Settings() {
  const { t, locale, setLocale } = useI18n()
  return (
    <section>
      <h1>{t('page.settings.title')}</h1>
      <p>TODO: Theme, language.</p>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">{t('settings.language')}</label>
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

      {/* Only language selection retained per request */}
    </section>
  )
}
