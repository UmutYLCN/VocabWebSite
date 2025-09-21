import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { ThemeProvider } from '../app/ThemeProvider'
import { StoreProvider } from '../app/StoreProvider'
import { I18nProvider } from '../app/I18nProvider'

describe('App skeleton', () => {
  it('renders navbar links', () => {
    render(
      <ThemeProvider>
        <StoreProvider>
          <I18nProvider>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </I18nProvider>
        </StoreProvider>
      </ThemeProvider>
    )
    expect(screen.getAllByText(/Home/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Review/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Cards/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Settings|Ayarlar/i)[0]).toBeInTheDocument()
  })

  it('supports Turkish translations', () => {
    localStorage.setItem('locale', 'tr')
    render(
      <ThemeProvider>
        <StoreProvider>
          <I18nProvider>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </I18nProvider>
        </StoreProvider>
      </ThemeProvider>
    )
    expect(screen.getAllByText(/Ana Sayfa/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/Ayarlar/i)[0]).toBeInTheDocument()
  })
})
