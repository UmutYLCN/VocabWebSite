import Flashcard from '../components/Flashcard'
import ReviewControls from '../components/ReviewControls'
import { useI18n } from '../app/I18nProvider'

export default function Review() {
  const { t } = useI18n()
  return (
    <section className="space-y-4">
      <h1>{t('page.review.title')}</h1>
      <Flashcard />
      <ReviewControls />
      <p>TODO: Review session flow.</p>
    </section>
  )
}
