import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Review from './pages/Review'
import Decks from './pages/Decks'
import DeckDetail from './pages/DeckDetail'
import AddVocab from './pages/AddVocab'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import BackgroundFX from './components/BackgroundFX'

function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundFX />
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<Review />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/decks/:id" element={<DeckDetail />} />
          <Route path="/add" element={<AddVocab />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        {/* TODO: Footer content */}
      </footer>
    </div>
  )
}

export default App
