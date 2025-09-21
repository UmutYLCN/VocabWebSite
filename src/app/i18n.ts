// i18n placeholder
// TODO:
// - Add en.json and tr.json under a locales/ directory
// - Implement an i18n library setup (e.g., i18next) and wire language detection
// - Provide translation hooks (t) via I18nProvider
export const SUPPORTED_LOCALES = ['en', 'tr'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

export function detectLocale(): Locale {
  const raw = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  return raw.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

