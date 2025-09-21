import { useI18n } from '../app/I18nProvider'

export default function Home() {
  const { t } = useI18n()
  return (
    <section>
      <h1>{t('page.home.title')}</h1>
      <p>TODO: Dashboard, quick actions.</p>
    </section>
  )
}
