import { NavLink } from 'react-router-dom'
import { useTheme } from '../app/ThemeProvider'
import { useI18n } from '../app/I18nProvider'

const linkBase = 'px-3 py-2 rounded-md hover:bg-white/10 transition-colors'
const active = 'font-semibold text-red-400'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-20">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 glass mt-3">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="text-lg font-bold tracking-tight text-red-400">
            {t('app.title')}
          </NavLink>
          <ul className="hidden sm:flex items-center gap-2">
            <li>
              <NavLink to="/review" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.review')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/decks" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.cards')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.profile')}
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="btn-ghost border border-white/10"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
      {/* mobile links */}
      <div className="sm:hidden">
        <ul className="container mx-auto px-4 py-2 flex items-center justify-between text-sm glass">
          <li>
            <NavLink to="/review" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.review')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/decks" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.cards')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.profile')}
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  )
}
