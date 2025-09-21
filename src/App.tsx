import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Review from './pages/Review'
import Decks from './pages/Decks'
import AddVocab from './pages/AddVocab'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<Review />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/add" element={<AddVocab />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        {/* TODO: Footer content */}
      </footer>
    </div>
  )
}

export default App

