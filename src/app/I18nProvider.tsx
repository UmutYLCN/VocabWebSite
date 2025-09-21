import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '../locales/en.json'
import tr from '../locales/tr.json'
import { detectLocale } from './i18n'

type Messages = Record<string, string>
type Locale = 'en' | 'tr'

const LOCALES: Record<Locale, Messages> = { en, tr }
const STORAGE_KEY = 'locale'

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (initialLocale) return initialLocale
    const fromStorage = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Locale | null
    if (fromStorage === 'en' || fromStorage === 'tr') return fromStorage
    return detectLocale()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const messages = LOCALES[locale]

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => messages[key] ?? key
    }),
    [locale, messages]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
