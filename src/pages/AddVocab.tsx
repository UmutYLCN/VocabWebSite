import { useI18n } from '../app/I18nProvider'

export default function AddVocab() {
  const { t } = useI18n()
  return (
    <section>
      <h1>{t('page.add.title')}</h1>
      <p>TODO: Form to add vocabulary items.</p>
    </section>
  )
}
