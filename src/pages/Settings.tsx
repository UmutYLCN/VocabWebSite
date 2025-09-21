import { useI18n } from '../app/I18nProvider'
import { useAppStore } from '../store/useAppStore'
import { useState } from 'react'

export default function Settings() {
  const { t, locale, setLocale } = useI18n()
  const { exportData, importData, resetAll } = useAppStore()
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  return (
    <section>
      <h1>{t('page.settings.title')}</h1>
      <p>TODO: Theme, language, data management.</p>

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

      <div className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Data</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            onClick={() => {
              const data = exportData()
              navigator.clipboard?.writeText(data)
              setStatus('Exported to clipboard')
            }}
          >
            Export (copy)
          </button>
          <a
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            href={URL.createObjectURL(new Blob([exportData()], { type: 'application/json' }))}
            download={`vocab-backup-${Date.now()}.json`}
          >
            Download JSON
          </a>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white"
            onClick={() => {
              if (confirm('Reset all data?')) {
                resetAll()
                setStatus('All data reset')
              }
            }}
          >
            Reset All
          </button>
        </div>
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          placeholder="Paste exported JSON here to import"
          value={importText}
          onChange={e => setImportText(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => {
            const ok = importData(importText)
            setStatus(ok ? 'Import successful' : 'Import failed')
          }}
        >
          Import JSON
        </button>
        <div>
          <input
            type="file"
            accept="application/json"
            onChange={async e => {
              const file = e.target.files?.[0]
              if (!file) return
              const text = await file.text()
              const ok = importData(text)
              setStatus(ok ? 'Import successful' : 'Import failed')
            }}
          />
        </div>
        {status && <div className="text-sm text-gray-600 dark:text-gray-300">{status}</div>}
      </div>
    </section>
  )
}
