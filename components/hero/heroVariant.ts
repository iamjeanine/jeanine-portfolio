/**
 * Hero variant switch for the hero-explorations branch, read from the
 * search string (?hero=...), which HashRouter never touches: the hash
 * carries the route, so ?hero survives chapter navigation untouched.
 *
 *   ?hero=dusk     the in-between hour comp (default on this branch)
 *   ?hero=unstill  duotoned Num and Tom photograph on umber
 *   ?hero=gels     the light-gel rack of Productions palettes
 *   ?hero=signal   the earlier treated-footage glowing frame
 *   ?hero=plate    signal frozen on one treated frame
 *   ?hero=off      the production typographic Cover
 */
export type HeroVariant = 'signal' | 'off' | 'plate' | 'unstill' | 'gels' | 'dusk';

const VARIANTS: HeroVariant[] = ['signal', 'off', 'plate', 'unstill', 'gels', 'dusk'];

export function getHeroVariant(): HeroVariant {
  try {
    const v = new URLSearchParams(window.location.search).get('hero') as HeroVariant | null;
    if (v && VARIANTS.includes(v)) return v;
  } catch {
    // Unparseable location: fall through to the branch default.
  }
  return 'dusk';
}
