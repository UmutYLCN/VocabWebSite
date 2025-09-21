import { useI18n } from '../app/I18nProvider'

export default function Decks() {
  const { t } = useI18n()
  return (
    <section>
      <h1>{t('page.decks.title')}</h1>
      <p>TODO: List, create, manage decks.</p>
    </section>
  )
}
