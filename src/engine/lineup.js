// @ts-check

export const HITTER_SLOTS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

/**
 * @param {Record<string, number | null>} field  slot -> Pokémon ID
 * @param {(number | null)[]} prevBatting  nine batting spots
 * @returns {(number | null)[]}
 */
export function reconcileBatting(field, prevBatting) {
  const hitters = HITTER_SLOTS.map((slot) => field[slot]).filter((id) => id != null);
  const batting = prevBatting.map((id) => (id != null && hitters.includes(id) ? id : null));
  const arrivals = hitters.filter((id) => !batting.includes(id));
  for (const id of arrivals) {
    batting[batting.indexOf(null)] = id;
  }
  return batting;
}