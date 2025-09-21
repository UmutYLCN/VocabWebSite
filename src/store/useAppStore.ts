import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AppState = {
  // TODO: add settings, user preferences, etc.
}

type AppActions = {
  // TODO: add actions
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // TODO: initial state and actions
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

