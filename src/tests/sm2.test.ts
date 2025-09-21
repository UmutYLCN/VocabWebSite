import { describe, it, expect } from 'vitest'
import { initReviewState, reviewWithSm2 } from '../lib/sm2'

describe('SM-2', () => {
  it('initializes review state', () => {
    const s = initReviewState(new Date('2020-01-01T00:00:00.000Z'))
    expect(s.ef).toBeCloseTo(2.5)
    expect(s.reps).toBe(0)
  })

  it('handles a good sequence', () => {
    let s = initReviewState(new Date('2020-01-01T00:00:00.000Z'))
    s = reviewWithSm2(s, 5, new Date('2020-01-01T00:00:00.000Z')) // interval 1
    expect(s.interval).toBe(1)
    s = reviewWithSm2(s, 5, new Date('2020-01-02T00:00:00.000Z')) // interval 6
    expect(s.interval).toBe(6)
    const after = reviewWithSm2(s, 5, new Date('2020-01-08T00:00:00.000Z'))
    expect(after.interval).toBeGreaterThanOrEqual(7) // rounded ef*6
  })

  it('resets on failure', () => {
    let s = initReviewState(new Date('2020-01-01T00:00:00.000Z'))
    s = reviewWithSm2(s, 1, new Date('2020-01-01T00:00:00.000Z'))
    expect(s.reps).toBe(0)
    expect(s.interval).toBe(1)
  })
})

