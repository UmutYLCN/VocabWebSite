import { Navigate } from 'react-router-dom'

export default function AddVocab() {
  // Route kept for backward compatibility; unified into Decks page
  return <Navigate to="/decks" replace />
}
