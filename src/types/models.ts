// Models placeholders (fields are names only; types TBD)

export interface Vocab {
  id: string // TODO: UUID
  front: string // TODO: term/question
  back: string // TODO: definition/answer
  deckId: string
  createdAt: string // ISO date
}

export interface Deck {
  id: string
  name: string
  description?: string
  createdAt: string // ISO date
}

export interface Gamification {
  xp: number
  streak: number
  level: number
}
