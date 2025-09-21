import { NavLink } from 'react-router-dom'
import { useTheme } from '../app/ThemeProvider'
import { useI18n } from '../app/I18nProvider'

const linkBase = 'px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800'
const active = 'font-semibold underline'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold">{t('app.title')}</span>
          <ul className="hidden sm:flex items-center gap-2">
            <li>
              <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/review" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.review')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/decks" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.decks')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.add')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
                {t('nav.settings')}
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
      {/* mobile links */}
      <div className="sm:hidden border-t border-gray-200 dark:border-gray-800">
        <ul className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <li>
            <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/review" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.review')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/decks" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.decks')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/add" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.add')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}>
              {t('nav.settings')}
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  )
}
