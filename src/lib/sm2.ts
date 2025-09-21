import { ReviewState } from '../types/models'

// SM-2 implementation
// EF update: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
// Constraints: EF >= 1.3
// If q < 3 => reps = 0, interval = 1
// Else: reps++, if reps == 1 => interval = 1, if reps == 2 => interval = 6, else interval = round(interval * EF)

export function initReviewState(now: Date = new Date()): ReviewState {
  return {
    ef: 2.5,
    interval: 0,
    reps: 0,
    dueAt: now.toISOString()
  }
}

export function reviewWithSm2(prev: ReviewState, quality: 0|1|2|3|4|5, now: Date = new Date()): ReviewState {
  const next: ReviewState = { ...prev }

  // update EF
  const q = quality
  let ef = next.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (ef < 1.3) ef = 1.3
  next.ef = ef

  if (q < 3) {
    next.reps = 0
    next.interval = 1
  } else {
    next.reps = (next.reps || 0) + 1
    if (next.reps === 1) next.interval = 1
    else if (next.reps === 2) next.interval = 6
    else next.interval = Math.round(next.interval * next.ef) || 1
  }

  const due = new Date(now)
  due.setDate(due.getDate() + next.interval)
  next.dueAt = due.toISOString()
  next.lastReviewedAt = now.toISOString()
  return next
}
