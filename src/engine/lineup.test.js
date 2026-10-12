import { describe, it, expect } from 'vitest'
import { reconcileBatting } from './lineup'

const field = (slots = {}) => ({
  P: null, C: null, '1B': null, '2B': null, '3B': null,
  SS: null, LF: null, CF: null, RF: null, DH: null,
  ...slots,
})
const order = (...ids) => [...ids, ...Array(9 - ids.length).fill(null)]

describe('reconcileBatting', () => {
  it('returns an empty order for an empty team', () => {
    expect(reconcileBatting(field(), order())).toEqual(order())
  })

  it('auto-fills the first empty spots for new hitters', () => {
    const f = field({ C: 25, SS: 6 })
    expect(reconcileBatting(f, order())).toEqual(order(25, 6))
  })

  it('keeps the order when two hitters swap positions', () => {
    const f = field({ C: 6, SS: 25 }) // was C: 25, SS: 6
    expect(reconcileBatting(f, order(25, 6))).toEqual(order(25, 6))
  })

  it('gives a replacement the departing hitter\'s spot', () => {
    const f = field({ C: 25, SS: 9 }) // 9 replaced 6
    expect(reconcileBatting(f, order(25, 6))).toEqual(order(25, 9))
  })

  it('empties the spot when a hitter leaves the lineup', () => {
    const f = field({ C: 25, LF: 9 }) // 6 left the field
    expect(reconcileBatting(f, order(25, 6, 9))).toEqual(order(25, null, 9))
  })

  it('swaps a hitter with the pitcher', () => {
    const f = field({ P: 6, SS: 9 }) // was P: 9, SS: 6
    expect(reconcileBatting(f, order(6))).toEqual(order(9))
  })

  it('fills arrivals into the highest available spots', () => {
    // 6 and 9 left; 40, 41, 42 arrived
    const f = field({ C: 25, SS: 40, LF: 41, CF: 42 })
    expect(reconcileBatting(f, order(25, 6, 9))).toEqual(order(25, 40, 41, 42))
  })

  it('never puts the pitcher in the batting order', () => {
    const f = field({ P: 1, C: 25 })
    const result = reconcileBatting(f, order())
    expect(result).toEqual(order(25))
    expect(result).not.toContain(1)
  })

  it('fills the highest available spot, even above a vacated one', () => {
    const f = field({ C: 25, LF: 40 }) // 40 replaced 6
    expect(reconcileBatting(f, order(25, null, 6))).toEqual(order(25, 40))
  })

    it('gives the same result when run twice', () => {
    const f = field({ C: 25, SS: 40, LF: 41, CF: 42 })
    const once = reconcileBatting(f, order(25, 6, 9))
    expect(reconcileBatting(f, once)).toEqual(once)
  })
})